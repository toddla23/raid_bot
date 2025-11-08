const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hi")
    .setDescription("reply hi"),

  async execute(interaction) {
    console.log(interaction)
    await interaction.reply("hi");
  },
};
