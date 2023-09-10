require("dotenv").config();
const {Client, IntentsBitField, EmbedBuilder} = require('discord.js');
const addSlashCommands = require("./slach-commends/register-commends");
const connection = require("./config/connection");

const raidService = require("./service/raid/raid");
const partyService = require("./service/raid/party");
const memberService = require("./service/raid/member");

const a = (async () => {
  await addSlashCommands();
})();


const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ]
});


client.on('ready', (c) => {
  console.log(`${c.user.tag} is online`)
})

client.on('messageCreate', (message) => {
  if (message.author.bot) {
    return;
  }

  if (message.content === "hello") {
    message.reply("hi")
  }
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }
  if (interaction.commandName === 'hello') {
    interaction.reply("hi")
  }
  if (interaction.commandName === '파티생성') {
    try {
      const result = await partyService.addParty(interaction.options.get("content").value, interaction.options.get("party-name").value, interaction.options.get("start-time").value);
      if (!result) {
        interaction.reply("error!")
        return;
      }
    } catch (e) {
      console.log(e)
      interaction.reply("error!")
      return;
    }
    interaction.reply("OK")
  }

  if (interaction.commandName === '파티참여') {
    const result = await memberService.addMember(interaction.options.get("party-id").value, interaction.options.get("user-name").value, interaction.options.get("role").value);
    if (!result) {
      interaction.reply("error!")
      return;
    }
    interaction.reply("OK");
  }

  if (interaction.commandName === '파티확인') {
    const result = await partyService.findAllParty()
    console.log(result);

    if (!result) {
      interaction.reply("파티가 없어요 ㅠㅠ");
      return;
    }
    const embeds = result.map((party) => {
      const embed = new EmbedBuilder()
        .setTitle(`${party.id}. : ${party.party_name}`)
        .addFields({
            name: "목표",
            value: `${party.contents}`,
            inline: true
          },
          {
            name: "출발 시간",
            value: `${party.start_time.getMonth() + 1}월 ${party.start_time.getDate()}일 ${party.start_time.getHours()}:${party.start_time.getMinutes()}`,
            inline: true
          },
          {
            name: "인원",
            value: `${party.cnt}`,
            inline: true
          })
      return embed;
    })

    interaction.reply({embeds: embeds});
  }

  if (interaction.commandName == '파티멤버확인') {
    const result = await memberService.findByParty(interaction.options.get("party-id").value)
    // console.log(result);
    if (!result) {
      interaction.reply("파티가 없어요 ㅠㅠ");
      return;
    }
    /*
        {
          party: { id: 3, name: '상아탑 하드', party_name: '테스트용 상아탑 파티' },
          dealer: [ { name: '생임이요' }, { name: '생임이야' } ],
            supporter: []
        }
    */
    console.log(result);
    const embed = new EmbedBuilder()
      .setTitle(`${result.party.id}. ${result.party.party_name}`)
      .addFields({
          name: "목표",
          value: `${result.party.name}`,
        },
        {
          name: "딜러",
          value: `닉네임 : ${result.dealer.map((name) => {
            return `${name.name}, `
          })}`,
        },
        {
          name: "서포터",
          value: `닉네임 : ${result.supporter.map((name) => {
            return `${name.name}, `
          })}`,
        }
      )
    console.log(embed);
    interaction.reply({embeds: [embed]});
  }

  if (interaction.commandName == '파티멤버취소') {
    const result = await memberService.deleteByPartyAndName(interaction.options.get("party-id").value, interaction.options.get("name").value)
    // console.log(result);
    if (!result) {
      interaction.reply("error");
      return;
    }
    interaction.reply("OK");
  }

  if (interaction.commandName == '요일별파티확인') {
    const result = await partyService.findByDay(interaction.options.get("day").value)
    // console.log(result);
    if (!result) {
      interaction.reply("error");
      return;
    }
    const embeds = result.map((party) => {
      const embed = new EmbedBuilder()
        .setTitle(`${party.id}. : ${party.party_name}`)
        .addFields({
            name: "목표",
            value: `${party.contents}`,
            inline: true
          },
          {
            name: "출발 시간",
            value: `${party.start_time.getMonth() + 1}월 ${party.start_time.getDate()}일 ${party.start_time.getHours()}:${party.start_time.getMinutes()}`,
            inline: true
          },
          {
            name: "인원",
            value: `${party.cnt}`,
            inline: true
          })
      return embed;
    })

    interaction.reply({embeds: embeds});
  }

})

client.login(process.env.TOKEN);