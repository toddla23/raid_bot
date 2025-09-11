const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("파티확인")
    .setDescription("생성된 파티를 확인합니다."),

  async execute(interaction) {
    await interaction.reply("생성된 파티 목록을 보여줍니다.");
  },
};
