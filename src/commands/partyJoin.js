const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const memberService = require("../service/member.js");
const partyService = require("../service/party.js");
const getCharacterData = require("../util/lostarkApi.js");
const {sendPartyList} = require("../util/sendPartyList.js");
const formatDateWithKoreanDay = require("../util/formatDate.js");

const roleChoices = [
  { name: "딜러", value: 0 },
  { name: "서포터", value: 1 },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("참여")
    .setDescription("파티에 참여합니다")
    .addStringOption(
      (option) =>
        option
          .setName("파티명")
          .setDescription("참여할 파티를 선택하세요")
          .setRequired(true)
          .setAutocomplete(true)
    )
    .addStringOption((option) =>
      option.setName("캐릭터명").setDescription("123").setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("포지션")
        .setDescription("딜러 또는 서포터")
        .setRequired(true)
        .addChoices(...roleChoices)
    ),

  async execute(interaction) {
    const partyId = interaction.options.getString("파티명");
    const role = interaction.options.getNumber("포지션");
    const characterName = interaction.options.getString("캐릭터명");

    const userId = interaction.user.id;
    const userName = interaction.user.globalName;

    await memberService.addMember(
      partyId,
      userName,
      userId,
      characterName,
      role
    );
    const characterData = await getCharacterData(characterName);

    await interaction.reply({
      content: `✅ ${characterName} (${characterData.ItemAvgLevel}) 캐릭터로 파티에 참여했습니다.`,
      ephemeral: true,
    });

    await sendPartyList(interaction.client, interaction.guildId);
  },

  // 자동완성 처리
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    const allParties = await partyService.findByName(
      interaction.guildId,
      focusedValue
    );

    // findName에 검색어 전달해서 필터링 가능
    const choices = allParties.map((p) => ({
      name: `${p.party_name} | ${p.contents} | ${formatDateWithKoreanDay(
        p.start_time
      )}`,
      value: `${p.id}`,
    }));

    await interaction.respond(choices.slice(0, 25));
  },
};
