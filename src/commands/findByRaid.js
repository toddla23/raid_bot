const { SlashCommandBuilder } = require("discord.js");
const contents = require("../util/content");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("레이드로파티찾기")
    .setDescription("레이드 선택시 해당 레이드의 파티를 리턴")
    .addNumberOption(option =>
      option.setName("content")
        .setDescription("레이드갈 컨텐츠")
        .setRequired(true)
        .addChoices(...contents)),

  async execute(interaction) {
    await interaction.reply("해당 레이드의 파티를 보여줍니다.");
  },
};
