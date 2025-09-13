const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const memberService = require("../service/raid/member.js");
const partyService = require("../service/raid/party.js");
const getCharacterData = require("../util/lostarkApi.js");

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
          .setAutocomplete(true) // 자동완성 활성화
    )
    .addStringOption((option) =>
      option.setName("캐릭터명").setDescription("123").setRequired(true)
    ),

  // Interaction 처리
  async execute(interaction) {
    const partyId = interaction.options.getString("파티명");
    const characterName = interaction.options.getString("캐릭터명");

    const userId = interaction.user.id;
    const userName = interaction.user.globalName;
    // console.log(partyId, role, userId, userName);

    const result = await memberService.addMember(
      partyId,
      userName,
      userId,
      characterName,
      0
    );

    // console.log(await memberService.findByParty(partyId));
    const result1 = await memberService.findUserIdByParty(partyId);
    const characterData = await getCharacterData(characterName);

    await interaction.reply({
      content: `✅ ${characterName} (${characterData.ItemAvgLevel}) 캐릭터로 파티에 참여했습니다.`,
      ephemeral: true, // 🔒 본인만 볼 수 있음
    });

    // embed 출력
    // const embed = new EmbedBuilder()
    //   .setTitle(`${result1.party.id}. ${result1.party.party_name}`)
    //   .addFields(
    //     {
    //       name: "목표",
    //       value: `${result1.party.name}`,
    //     },
    //     {
    //       name: "딜러",
    //       value: `닉네임 : ${result1.dealer.map((name) => {
    //         return `<@${name.user_id}>, `;
    //       })}`,
    //     },
    //     {
    //       name: "서포터",
    //       value: `닉네임 : ${result1.supporter.map((name) => {
    //         return `<@${name.user_id}>, `;
    //       })}`,
    //     }
    //   );
    // interaction.channel.send({ embeds: [embed] });
  },

  // 자동완성 처리
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    // console.log("hi")
    const allParties = await partyService.findByName(focusedValue);
    // console.log(allParties);
    // findName에 검색어 전달해서 필터링 가능
    const choices = allParties.map((p) => ({
      name: `${p.party_name} | ${p.contents} | ${
        p.start_time.getMonth() + 1
      }월 ${p.start_time.getDate()}일 ${p.start_time.getHours()}:${p.start_time.getMinutes()}`,
      value: `${p.id}`,
    }));
    await interaction.respond(
      choices.slice(0, 25) // Discord는 최대 25개만
    );
  },
};
