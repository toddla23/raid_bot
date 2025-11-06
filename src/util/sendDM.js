const { EmbedBuilder } = require("discord.js");
const partyService = require("../service/raid/party");
const formatDateWithKoreanDay = require("./formatDate");

// DM 보내기 함수
async function sendDM(client, userId, embed) {
  try {
    const user = await client.users.fetch(userId);
    await user.send({ embeds: [embed] }); // ✅ embed 전송
    console.log(`✅ ${user.tag} 에게 DM을 보냈습니다.`);
    return true;
  } catch (error) {
    if (error.code === 50007) {
      console.log("❌ DM을 보낼 수 없습니다. (비공개 설정 또는 차단)");
    } else {
      console.error("⚠️ DM 전송 중 오류:", error);
    }
    return false;
  }
}

async function asd(client) {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 5);
  const nowString = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}`;

  const partys = await partyService.findByDateTime(nowString);
  console.log(`message sended ${nowString}`)

  partys.map((party) => {
    console.log(`⏰ "${party.party_name}" 파티 시작 5분전 입니다!`);

    // 🎨 Embed 구성
    const embed = new EmbedBuilder()
      .setColor(0x5865f2) // 파란색 (디스코드 기본 톤)
      .setTitle(`⏰ "${party.party_name}" 파티 시작 5분전 입니다!`)
      .addFields(
        {
          name: "📅 시작 시간",
          value: formatDateWithKoreanDay(party.start_time),
          inline: false,
        },
        { name: "🎯 목표", value: party.contents || "정보 없음", inline: false }
      )
      .setFooter({
        text: "레이드 알림 봇",
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();

    // 💬 각 역할 유저에게 전송
    party.dealer.map((d) => {
      console.log("Dealer:", d.userId);
      sendDM(client, d.userId, embed);
    });
    party.supporter.map((s) => {
      console.log("Supporter:", s.userId);
      sendDM(client, s.userId, embed);
    });
  });
}

module.exports = asd;
