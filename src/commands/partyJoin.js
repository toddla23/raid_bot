const { SlashCommandBuilder } = require("discord.js");
const role = require("../util/role");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("파티참여")
    .setDescription("파티에 참여합니다.")
    .addNumberOption(option =>
      option.setName("party-id")
        .setDescription("파티 번호")
        .setRequired(true))
    .addNumberOption(option =>
      option.setName("role")
        .setDescription("딜러 or 서폿")
        .setRequired(true)
        .addChoices(...role)),

  async execute(interaction) {
    await interaction.reply("파티에 참가했습니다!");
  },
};
