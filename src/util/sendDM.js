const { EmbedBuilder } = require("discord.js");
const partyService = require("../service/party");
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

async function sendPartyDM(date, client) {

  const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;

  const partys = await partyService.findByDateTime(dateString);

  partys.map((party) => {
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`⏰ "${party.party.party_name}" 파티 시작 5분전 입니다!`)
      .addFields(
        {
          name: "📅 시작 시간",
          value: formatDateWithKoreanDay(party.party.start_time),
          inline: false,
        },
        { name: "🎯 목표", value: party.party.contents || "정보 없음", inline: false }
      )
      .setFooter({
        text: "스트라이커",
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();

    
    party.members.dealer.map((d) => {
      sendDM(client, d.user_id, embed);
    });
    party.members.supporter.map((s) => {
      sendDM(client, s.user_id, embed);
    });
  });
}

module.exports = sendPartyDM;
