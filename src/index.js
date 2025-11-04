require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { REST, Routes } = require("discord.js");
const { clientId, guildId, token } = require("./config.json");

const cron = require("node-cron");
const partyService = require("./service/raid/party.js");

// 슬래시 커맨드 등록 함수
async function registerSlashCommands() {
  const commands = [];
  const commandPath = path.join(__dirname, "commands"); // __dirname 기준 절대 경로
  if (!fs.existsSync(commandPath)) {
    console.log(
      "⚠️ commands 폴더가 존재하지 않습니다. 생성 후 명령어 파일을 넣으세요."
    );
    return;
  }

  const commandFiles = fs
    .readdirSync(commandPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(path.join(commandPath, file));
    commands.push(command.data.toJSON());
  }

  const rest = new REST({ version: "10" }).setToken(token);

  try {
    console.log("슬래시 커맨드 등록 중...");

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId), // 테스트용 길드 커맨드
      { body: commands }
    );

    console.log("✅ 슬래시 커맨드 등록 완료!");
  } catch (error) {
    console.error(error);
  }
}

// 봇 초기화
(async () => {
  await registerSlashCommands(); // 커맨드 등록
  console.log("슬래시 커맨드 등록 완료 후 봇 시작");

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  client.commands = new Collection();

  const commandPath = path.join(__dirname, "commands");
  const commandFiles = fs.existsSync(commandPath)
    ? fs.readdirSync(commandPath).filter((file) => file.endsWith(".js"))
    : [];

  for (const file of commandFiles) {
    const command = require(path.join(commandPath, file));
    client.commands.set(command.data.name, command);
  }

  client.once("ready", () => {
    console.log(`${client.user.tag} 봇이 준비되었습니다!`);
    cron.schedule("0  * * *", async () => {
      const now = new Date();
      const parties = await partyService.findUpcomingNotNotified(now);

      for (const party of parties) {
        const channel = await client.channels.fetch(bbsChannelId);
        await channel.send(
          `⏰ **"${party.party_name}" 파티 시작 시간입니다!**\n📅 ${party.start_time}\n🎯 목표: ${party.contents}`
        );
        await partyService.markNotified(party.id);
      }
    });
  });

  client.on("interactionCreate", async (interaction) => {
    if (interaction.isAutocomplete()) {
      const command = client.commands.get(interaction.commandName);
      if (command && command.autocomplete) {
        try {
          await command.autocomplete(interaction);
        } catch (error) {
          console.error(error);
        }
      }
      return; // autocomplete 처리 후 끝내기
    }

    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "명령어 실행 중 오류 발생!",
          ephemeral: true,
        });
      }
    }
  });

  // 선택적으로 기존 메시지 이벤트
  client.on("messageCreate", (message) => {
    if (message.author.bot) return;

    if (message.content === "hello") {
      message.reply("hi");
    }
  });

  client.login(token);
})();
