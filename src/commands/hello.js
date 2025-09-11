const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hiiii")
    .setDescription("reply hi"),

  async execute(interaction) {
    await interaction.reply("hi");
  },
};
