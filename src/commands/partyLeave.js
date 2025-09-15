const { SlashCommandBuilder } = require("discord.js");
const memberService = require("../service/raid/member.js");
const partyService = require("../service/raid/party.js");
const sendPartyList = require("../util/sendPartyList.js");
const formatDateWithKoreanDay = require("../util/formatDate");


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
          .setAutocomplete(true) // ✅ 자동완성 활성화
    ),

  // 실제 탈퇴 처리
  async execute(interaction) {
    const partyValue = interaction.options.getString("파티명");
    const userId = interaction.user.id;

    // 탈퇴 처리
    await memberService.deleteByPartyAndName(partyValue, userId);
    await interaction.reply({
      content: `✅ 파티에서 탈퇴했습니다.`,
      ephemeral: true,
    });

    await sendPartyList(interaction.client);
  },

  // 자동완성 (사용자가 참여한 파티만 보여주기)
  async autocomplete(interaction) {
    const userId = interaction.user.id;

    // 이 함수는 "유저가 현재 참여 중인 파티 목록"을 반환한다고 가정
    const joinedParties = await partyService.findByUserId(userId);

    // Discord에 보낼 choices 배열
    const choices = joinedParties.map((p) => ({
      name: `${p.party_name} | ${p.contents} | ${formatDateWithKoreanDay(p.start_time)}`, // 유저가 보는 이름
      value: `${p.id}`, // 실제 커맨드에서 넘어오는 값
    }));

    await interaction.respond(choices.slice(0, 25)); // 최대 25개
  },
};
