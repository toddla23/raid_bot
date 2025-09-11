const { SlashCommandBuilder } = require("discord.js");
const contents = require("../util/content");
const difficulty = require("../util/difficulty");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("파티생성")
    .setDescription("파티를 생성합니다.")
    .addNumberOption((option) =>
      option
        .setName("보스")
        .setDescription("레이드갈 컨텐츠")
        .setRequired(true)
        .addChoices(...contents)
    )
    .addNumberOption((option) =>
      option
        .setName("난이도")
        .setDescription("레이드 난이도")
        .setRequired(true)
        .addChoices(...difficulty)
    )
    .addStringOption((option) =>
      option
        .setName("파티명")
        .setDescription("파티명 (아무거나 적어도 됩니다)")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("시작시간")
        .setDescription("시작시간 (예: 2023-10-31 00:00:00)")
        .setRequired(true)
    ),

  async execute(interaction) {
    const boss = interaction.options.getNumber("보스");
    const level = interaction.options.getNumber("난이도");
    const name = interaction.options.getString("파티명");
    const time = interaction.options.getString("시작시간");

    const result = await partyService.addParty(boss, name, time);
    if (!result) {
      interaction.reply("error!");
      return;
    }
    // console.log(result);
    const startTime = time;
    const delay = timeParesr(startTime);

    if (delay <= 0 || !delay) {
      interaction.reply("지난 시간에 이벤트를 예약할 수 없습니다.");
      return;
    }

    setTimeout(async () => {
      // 예약된 시간에 이벤트를 실행합니다.
      const partyId = result.insertId;
      // console.log(await memberService.findByParty(partyId));
      const result1 = await memberService.findUserIdByParty(partyId);
      const embed = new EmbedBuilder()
        .setTitle(`${result1.party.id}. ${result1.party.party_name}`)
        .addFields(
          {
            name: "목표",
            value: `${result1.party.name}`,
          },
          {
            name: "딜러",
            value: `닉네임 : ${result1.dealer.map((name) => {
              return `<@${name.user_id}>, `;
            })}`,
          },
          {
            name: "서포터",
            value: `닉네임 : ${result1.supporter.map((name) => {
              return `<@${name.user_id}>, `;
            })}`,
          }
        );
      interaction.channel.send({ embeds: [embed] });
      // 여기에서 원하는 이벤트 동작을 추가할 수 있습니다.
    }, delay);

    // interaction.reply(`이벤트가 ${hours}:${minutes}에 예약되었습니다.`);

    interaction.reply(
      ` "${interaction.options.get("파티명").value}"파티가 생성 되었습니다.`
    );

    await interaction.reply(
      `파티 생성됨!\n보스: ${boss}, 난이도: ${level}, 이름: ${name}, 시간: ${time}`
    );
  },
};
