const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("주사위").setDescription("1~6 까지 랜덤 출력"),

  async execute(interaction) {

    await interaction.reply(`${ Math.floor(Math.random() * 6 + 1)}`);
  },
};
