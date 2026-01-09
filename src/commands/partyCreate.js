const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const sendPartyList = require("../util/sendPartyList.js");

const contents = require("../util/content.js");
const timeParesr = require("../util/timeParesr.js");

const partyService = require("../service/party.js");
const memberService = require("../service/member.js");

global.scheduledParties = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("추가")
    .setDescription("파티를 추가합니다")
    .addNumberOption((option) =>
      option
        .setName("보스")
        .setDescription("레이드갈 컨텐츠")
        .setRequired(true)
        .addChoices(...contents)
    )
    .addStringOption((option) =>
      option
        .setName("파티명")
        .setDescription("파티명 (아무거나 적어도 됩니다)")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("날짜")
        .setDescription("날짜 (예: 10-31)")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("시간")
        .setDescription("시간 (예: 18:30)")
        .setRequired(true)
    ),

  async execute(interaction) {
    const boss = interaction.options.getNumber("보스");
    const name = interaction.options.getString("파티명");
    const time = `${new Date().getFullYear()}-${interaction.options.getString(
      "날짜"
    )} ${interaction.options.getString("시간")}:00`;

    const result = await partyService.addParty(
      interaction.guildId,
      boss,
      name,
      time
    );

    if (!result) {
      interaction.reply({ content: "error!", ephemeral: true });
      return;
    }
    const startTime = time;
    const delay = timeParesr(startTime);

    if (delay <= 0 || !delay) {
      interaction.reply({
        content: "지난 시간에 이벤트를 예약할 수 없습니다.",
        ephemeral: true,
      });
      return;
    }

    await interaction.reply({
      content: `"${name}"파티가 생성 되었습니다.`,
      ephemeral: true,
    });
    await sendPartyList(interaction.client, interaction.guildId);
  },
};
