const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const partyService = require("../service/raid/party");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("내파티")
    .setDescription("내가 참여하는 파티를 확인해요"),

  async execute(interaction) {
    const result = await partyService.findByUserId(interaction.user.id);
    console.log(result.length);
    if (result.length == 0) {
      await interaction.reply("파티가 없어요 ㅠㅠ");
      return
    }
    const embeds = result.map((party) => {
      // console.log(party);
      const embed = new EmbedBuilder()
        .setTitle(`${party.id} : ${party.party_name}`)
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
            value: `${party.dealer.toString()} `,
            inline: true,
          },
          {
            name: "서포터",
            value: `${party.supporter.toString()} `,
            inline: true,
          }
        );
      return embed;
    });

    await interaction.reply({ embeds: embeds });
  },
};
