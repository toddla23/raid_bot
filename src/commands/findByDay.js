const { SlashCommandBuilder } = require("discord.js");
const days = require("../util/days");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("요일로파티찾기")
    .setDescription("요일을 선택하면 해당날짜의 파티를 리턴")
    .addNumberOption(option =>
      option.setName("day")
        .setDescription("요일")
        .setRequired(true)
        .addChoices(...days)),

  async execute(interaction) {
    await interaction.reply("해당 요일의 파티를 보여줍니다.");
  },
};
