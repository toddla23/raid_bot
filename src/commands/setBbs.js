const { SlashCommandBuilder } = require("discord.js");
const bbsService = require("../service/bbs");
const sendPartyList = require("../util/sendPartyList");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("설정-시간표")
    .setDescription("시간표가 나올 채널을 설정해요"),

  async execute(interaction) {
    const bbsId = await bbsService.findBbsIdByGuildId(interaction.guildId);
    // console.log(bbsId);
    if (!bbsId) {
      await bbsService.addBbsId(interaction.guildId, interaction.channelId);
    } else {
      await bbsService.updateBbsIdByGuildId(
        interaction.guildId,
        interaction.channelId
      );
    }
    await interaction.reply("현재 채널이 시간표 채널로 설정되었어요!");
    await sendPartyList(interaction.client, interaction.guildId);
  },
};
