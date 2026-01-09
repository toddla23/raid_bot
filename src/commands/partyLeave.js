const { SlashCommandBuilder } = require("discord.js");
const memberService = require("../service/member.js");
const partyService = require("../service/party.js");
const sendPartyList = require("../util/sendPartyList.js");
const formatDateWithKoreanDay = require("../util/formatDate.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("탈퇴")
    .setDescription("참여 중인 파티에서 탈퇴합니다")
    .addStringOption(
      (option) =>
        option
          .setName("파티명")
          .setDescription("탈퇴할 파티를 선택하세요")
          .setRequired(true)
          .setAutocomplete(true)
    ),

  async execute(interaction) {
    const partyValue = interaction.options.getString("파티명");
    const userId = interaction.user.id;

    await memberService.deleteByPartyAndUser(partyValue, userId);
    await interaction.reply({
      content: `✅ 파티에서 탈퇴했습니다.`,
      ephemeral: true,
    });

    await sendPartyList(interaction.client, interaction.guildId);
  },

  async autocomplete(interaction) {
    const userId = interaction.user.id;
    const joinedParties = await partyService.findByUserId(
      interaction.guildId,
      userId
    );

    const choices = joinedParties.map((p) => ({
      name: `${p.party.party_name} | ${p.party.contents} | ${formatDateWithKoreanDay(
        p.party.start_time
      )}`,
      value: `${p.party.id}`,
    }));

    await interaction.respond(choices.slice(0, 25));
  },
};
