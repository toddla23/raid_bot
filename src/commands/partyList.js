const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const getCharacterData = require("../util/lostarkApi.js");
const partyService = require("../service/party.js");
const formatDateWithKoreanDay = require("../util/formatDate.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("확인")
    .setDescription("생성된 파티 모두를 확인합니다"),

  async execute(interaction) {
    const results = await partyService.findAllParty(interaction.guildId);

    if (!results | (results.length == 0)) {
      await interaction.reply({
        content: "파티가 없어요 ㅠㅠ",
        ephemeral: true,
      });
      return;
    }

    const embeds = await Promise.all(
      results.map(async (result) => {
        const dealers = await Promise.all(
          result.members.dealer.map(async (dealer) => {
            const characterData = await getCharacterData(dealer.character_name);
            return characterData;
          })
        );

        const supporters = await Promise.all(
          result.members.supporter.map(async (supporter) => {
            const characterData = await getCharacterData(
              supporter.character_name
            );
            return characterData;
          })
        );

        const embed = new EmbedBuilder()
          .setTitle(`${result.party.party_name}`)
          .addFields(
            {
              name: "목표",
              value: `${result.party.contents}`,
              inline: true,
            },
            {
              name: "출발 시간",
              value: `${formatDateWithKoreanDay(result.party.start_time)}`,
              inline: false,
            },
            {
              name: "딜러",
              value:
                dealers.length == 0
                  ? "없음"
                  : dealers
                      .map((dealer) => {
                        return `${dealer.CharacterName} | ${dealer.CharacterClassName} (${dealer.ItemAvgLevel})`;
                      })
                      .join("\n"),
            },
            {
              name: "서포터",
              value:
                supporters.length == 0
                  ? "없음"
                  : supporters
                      .map((supporter) => {
                        return `${supporter.CharacterName} | ${supporter.CharacterClassName} (${supporter.ItemAvgLevel})`;
                      })
                      .join("\n"),
            }
          );
        return embed;
      })
    );

    await interaction.reply({ embeds: embeds, ephemeral: true });
  },
};
