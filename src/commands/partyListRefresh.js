const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("새로고침")
    .setDescription("파티 리스트를 새로고침 해요"),

  async execute(interaction) {
    await sendPartyList(interaction.client);
  },
};
