const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("파티탈퇴")
    .setDescription("파티에서 빠집니다.")
    .addNumberOption(option =>
      option.setName("party-id")
        .setDescription("파티 번호")
        .setRequired(true)),

  async execute(interaction) {
    await interaction.reply("파티에서 탈퇴했습니다.");
  },
};
