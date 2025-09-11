require("dotenv").config();
const {Client, IntentsBitField, EmbedBuilder} = require('discord.js');
const addSlashCommands = require("./slach-commends/register-commends");
const connection = require("./config/connection");

const timeParser = require("./util/timeParesr")
const raidService = require("./service/raid/raid");
const partyService = require("./service/raid/party");
const memberService = require("./service/raid/member");
const timeParesr = require("./util/timeParesr");

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
    const result = await partyService.addParty(interaction.options.get("content").value, interaction.options.get("party-name").value, interaction.options.get("start-time").value);
    if (!result) {
      interaction.reply("error!")
      return;
    }
    console.log(result);
    const startTime = interaction.options.get("start-time").value;
    const delay = timeParesr(startTime);

    if (delay <= 0 || !delay) {
      interaction.reply('지난 시간에 이벤트를 예약할 수 없습니다.');
      return;
    }

    setTimeout(async () => {
      // 예약된 시간에 이벤트를 실행합니다.
      const partyId = result.insertId;
      console.log(await memberService.findByParty(partyId));
      const result1 = await memberService.findUserIdByParty(partyId);
      const embed = new EmbedBuilder()
        .setTitle(`${result1.party.id}. ${result1.party.party_name}`)
        .addFields({
            name: "목표",
            value: `${result1.party.name}`,
          },
          {
            name: "딜러",
            value: `닉네임 : ${result1.dealer.map((name) => {
              return `<@${name.user_id}>, `
            })}`,
          },
          {
            name: "서포터",
            value: `닉네임 : ${result1.supporter.map((name) => {
              return `<@${name.user_id}>, `
            })}`,
          }
        )
      interaction.channel.send({embeds: [embed]});
      // 여기에서 원하는 이벤트 동작을 추가할 수 있습니다.
    }, delay);

    // interaction.reply(`이벤트가 ${hours}:${minutes}에 예약되었습니다.`);

    interaction.reply(`${result.insertId}번 파티가 생성 되었습니다.`)
  }


  if (interaction.commandName === '파티참여') {
    console.log(interaction.user);
    const result = await memberService.addMember(interaction.options.get("party-id").value, interaction.user.globalName, interaction.user.id, interaction.options.get("role").value);
    if (!result) {
      interaction.reply("error!")
      return;
    }
    interaction.reply(`${interaction.options.get("party-id").value}번 파티에 추가되었습니다.`);
  }

  if (interaction.commandName === '파티확인') {
    const result = await partyService.findAllParty()
    if (!result) {
      interaction.reply("파티가 없어요 ㅠㅠ");
      return;
    }
    const embeds = result.map((party) => {
      console.log(party);
      const embed = new EmbedBuilder()
        .setTitle(`${party.id} : ${party.party_name}`)
        .addFields({
            name: "목표",
            value: `${party.contents}`,
            inline: true
          },
          {
            name: "출발 시간",
            value: `${party.start_time.getMonth() + 1}월 ${party.start_time.getDate()}일 ${party.start_time.getHours()}:${party.start_time.getMinutes()}`,
            inline: false
          },
          {
            name: "딜러",
            value: `${party.dealer.toString()} `,
            inline: true
          },
            {
              name: "서포터",
              value: `${party.supporter.toString()} `,
              inline: true
            })
      return embed;
    })

    interaction.reply({embeds: embeds});
  }

  if (interaction.commandName === '레이드로파티찾기') {
    const result = await partyService.findAllPartyByContent(interaction.options.get("content").value)
    if (!result) {
      interaction.reply("파티가 없어요 ㅠㅠ");
      return;
    }
    const embeds = result.map((party) => {
      console.log(party);
      const embed = new EmbedBuilder()
        .setTitle(`${party.id} : ${party.party_name}`)
        .addFields({
            name: "목표",
            value: `${party.contents}`,
            inline: true
          },
          {
            name: "출발 시간",
            value: `${party.start_time.getMonth() + 1}월 ${party.start_time.getDate()}일 ${party.start_time.getHours()}:${party.start_time.getMinutes()}`,
            inline: false
          },
          {
            name: "딜러",
            value: `${party.dealer.toString()} `,
            inline: true
          },
          {
            name: "서포터",
            value: `${party.supporter.toString()} `,
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
    console.log(result);
    const embed = new EmbedBuilder()
      .setTitle(`${result.party.id} : ${result.party.party_name}`)
      .addFields({
          name: "목표",
          value: `${result.party.name}`,
        },
        {
          name: "딜러",
          value: `닉네임 : ${result.dealer.map(obj => obj.name).toString()}`,
        },
        {
          name: "서포터",
          value: `닉네임 : ${result.supporter.map(obj => obj.name).toString()}`,
        }
      )
    console.log(embed);
    interaction.reply({embeds: [embed]});
  }

  if (interaction.commandName == '파티탈퇴') {
    const result = await memberService.deleteByPartyAndName(interaction.options.get("party-id").value,  interaction.user.id)
    // console.log(result);
    if (!result) {
      interaction.reply("error");
      return;
    }
    interaction.reply(`${interaction.options.get("party-id").value}번 파티에서 제외되었습니다.`);
  }

  if (interaction.commandName == '요일로파티찾기') {
    const result = await partyService.findByDay(interaction.options.get("day").value)
    // console.log(result);
    if (result.length == 0) {
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
              name: "딜러",
              value: `${party.dealer.toString()} `,
              inline: true
            },
            {
              name: "서포터",
              value: `${party.supporter.toString()} `,
              inline: true
            })
      return embed;
    })

    interaction.reply({embeds: embeds});
  }

})

client.login(process.env.TOKEN);