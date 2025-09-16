const { SlashCommandBuilder } = require("discord.js");
const partyService = require("../service/raid/party.js");
const sendPartyList = require("../util/sendPartyList.js");
const formatDateWithKoreanDay = require("../util/formatDate");
const memberService = require("../service/raid/member.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("삭제")
    .setDescription("파티를 삭제합니다")
    .addStringOption(
      (option) =>
        option
          .setName("파티명")
          .setDescription("삭제할 파티를 선택하세요")
          .setRequired(true)
          .setAutocomplete(true) // ✅ 자동완성
    ),

  // 실제 삭제 처리
  async execute(interaction) {
    const partyValue = interaction.options.getString("파티명");

    const result1 = await memberService.findByParty(partyValue);

    if (result1.dealer.length != 0 || result1.supporter.length != 0) {
      return await interaction.reply({
        content: `😰 ${partyValue} 파티에 공대원이 있어요.`,
        ephemeral: true
      });
    }

    // 삭제 처리
    await partyService.deleteById(partyValue);
    await interaction.reply({
      content: `🗑️ ${partyValue} 파티를 삭제했습니다.`,
    });
    await sendPartyList(interaction.client);
  },

  // 자동완성 (내가 만든 파티만 보여주기)
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();

    const myParties = await partyService.findByName(focusedValue);

    const choices = myParties.map((p) => ({
      name: `${p.party_name} | ${p.contents} | ${formatDateWithKoreanDay(
        p.start_time
      )}`, // 유저가 보는 텍스트
      value: `${p.id}`, // 실제로 execute에 들어가는 값
    }));

    await interaction.respond(choices.slice(0, 25));
  },
};
