const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const getCharacterData = require("../util/lostarkApi.js");

const partyService = require("../service/raid/party");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("내파티")
    .setDescription("내가 참여하는 파티를 확인해요"),

  async execute(interaction) {
    const result = await partyService.findByUserId(interaction.user.id);
    if (result.length == 0) {
      await interaction.reply("파티가 없어요 ㅠㅠ");
      return;
    }

    const embeds = await Promise.all(
      result.map(async (party) => {
        const dealers = await Promise.all(
          party.dealer.map(async (dealer) => {
            const characterData = await getCharacterData(dealer.character_name);
            return characterData;
          })
        );
        const supporters = await Promise.all(
          party.supporter.map(async (supporter) => {
            const characterData = await getCharacterData(
              supporter.character_name
            );
            return characterData;
          })
        );
        console.log(dealers)
        console.log(supporters)

        const embed = new EmbedBuilder()
          .setTitle(`${party.id}. ${party.party_name}`)
          .addFields(
            {
              name: "목표",
              value: `${party.contents}`,
              inline: true,
            },
            {
              name: "출발 시간",
              value: `${
                party.start_time.getMonth() + 1
              }월 ${party.start_time.getDate()}일 ${party.start_time.getHours()}:${party.start_time.getMinutes()}`,
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

    await interaction.reply({ embeds: embeds });
  },
};
