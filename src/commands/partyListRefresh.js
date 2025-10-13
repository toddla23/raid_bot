const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const sendPartyList = require("../util/sendPartyList.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("새로고침")
    .setDescription("파티 리스트를 새로고침 해요"),

  async execute(interaction) {
    await sendPartyList(interaction.client);
  },
};
