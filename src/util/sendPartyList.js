// util/sendPartyList.js
const { EmbedBuilder } = require("discord.js");
const getCharacterData = require("./lostarkApi.js");
const partyService = require("../service/raid/party.js");
const { bbsChannelId} = require("../config.json");


let lastMessageId = null; // 마지막으로 보낸 메시지 ID 저장

async function sendPartyList(client) {
  const result = await partyService.findAllParty();
  const channel = client.channels.cache.get(bbsChannelId);

  if (!channel) return;

  const embeds = await Promise.all(
    result.map(async (party) => {
      const dealers = await Promise.all(
        party.dealer.map(d => getCharacterData(d.character_name))
      );
      const supporters = await Promise.all(
        party.supporter.map(s => getCharacterData(s.character_name))
      );

      return new EmbedBuilder()
        .setTitle(`${party.id}. ${party.party_name}`)
        .addFields(
          { name: "목표", value: party.contents, inline: true },
          { 
            name: "출발 시간", 
            value: formatDate(party.start_time), 
            inline: false 
          },
          {
            name: `딜러 (${dealers.length} / 6)`,
            value: dealers.length === 0
              ? "없음"
              : dealers.map(d => `${d.CharacterName} | ${d.CharacterClassName} (${d.ItemAvgLevel})`).join("\n")
          },
          {
            name: `서포터 (${supporters.length} / 2)`,
            value: supporters.length === 0
              ? "없음"
              : supporters.map(s => `${s.CharacterName} | ${s.CharacterClassName} (${s.ItemAvgLevel})`).join("\n")
          }
        );
    })
  );

  // 파티가 없으면 따로 embed
  const finalEmbeds = embeds.length === 0
    ? [ new EmbedBuilder().setDescription("😢 현재 파티가 없습니다.") ]
    : embeds;

  if (lastMessageId) {
    try {
      const msg = await channel.messages.fetch(lastMessageId);
      await msg.edit({ embeds: finalEmbeds });
      return;
    } catch (err) {
      console.error("메시지 수정 실패, 새로 보냄:", err.message);
      lastMessageId = null; 
    }
  }

  // 기존 메시지 없거나 수정 실패 → 새로 전송
  const newMsg = await channel.send({ embeds: finalEmbeds });
  lastMessageId = newMsg.id;
}

function formatDate(date) {
  const koreanDays = ["일", "월", "화", "수", "목", "금", "토"];
  const dayOfWeek = koreanDays[date.getDay()];

  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");

  return `${month}.${day} (${dayOfWeek}) ${hour}:${minute}`;
}

module.exports = sendPartyList;
