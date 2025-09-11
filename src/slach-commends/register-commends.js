require('dotenv').config();
const {REST} = require('discord.js');
const {Routes, ApplicationCommandOptionType} = require('discord-api-types/v9');
const contents = require("../util/content")
const role = require("../util/role")
const days = require("../util/days")


const commands = [
  {
    name: 'hello',
    description: "reply hi",
  },
  {
    name: "파티생성",
    description: "파티를 생성합니다.",
    options: [
      {
        name: "content",
        description: "레이드갈 컨텐츠",
        type: ApplicationCommandOptionType.Number,
        required: true,
        choices: contents
      },
      {
        name: "party-name",
        description: "파티명 (아무거나 적어도 됩니다)",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "start-time",
        description: "시작시간 공백주의!! ex)2023-10-31 00:00:00",
        type: ApplicationCommandOptionType.String,
        required: true,
      }
    ],
  },
  {
    name: '파티참여',
    description: "파티에 참여합니다.",
    options: [
      {
        name: "party-id",
        description: "파티 번호",
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
      {
        name: "role",
        description: "딜러 or 서폿",
        type: ApplicationCommandOptionType.Number,
        required: true,
        choices: role
      }
    ]
  },
  {
    name: "파티확인",
    description: "생성된 파티를 확인합니다."
  },
  {
    name: "요일로파티찾기",
    description: "요일을 선택하면 해당날짜의 파티를 리턴",
    options: [
      {
        name: "day",
        description: "요일",
        type: ApplicationCommandOptionType.Number,
        required: true,
        choices: days
      }
    ]
  },{
    name: "레이드로파티찾기",
    description: "레이드 선택시 해당 레이드의 파티를 리턴",
    options: [
      {
        name: "content",
        description: "레이드갈 컨텐츠",
        type: ApplicationCommandOptionType.Number,
        required: true,
        choices: contents
      }
    ]
  },
  {
    name: "파티멤버확인",
    description: "생성된 파티를 확인합니다.",
    options: [
      {
        name: "party-id",
        description: "파티 번호",
        type: ApplicationCommandOptionType.Number,
        required: true
      }
    ]
  },
  {
    name: "파티탈퇴",
    description: "파티에서 빠짐",
    options: [
      {
        name: "party-id",
        description: "파티 번호",
        type: ApplicationCommandOptionType.Number,
        required: true
      }
    ]
  }
];

const rest = new REST({version: '10'}).setToken(process.env.TOKEN);

const addSlashCommands = (async () => {
  try {
    console.log("Registering slash commands...")
    console.log(commands)

    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      {body: commands}
    )

    console.log("slash commands registered scuuessfully")
  } catch (error) {
    console.log(error)
  }
});

module.exports = addSlashCommands;
