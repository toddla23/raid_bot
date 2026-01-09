// util/sendPartyList.js
const { EmbedBuilder } = require("discord.js");
const getCharacterData = require("./lostarkApi.js");
const partyService = require("../service/party.js");
const bbsService = require("../service/bbs.js");
const formatDateWithKoreanDay = require("./formatDate.js");

let lastMessages = []; // 마지막으로 보낸 메시지 ID 저장 {bbsId: string, messageId:string}

async function sendPartyList(client, guild_id) {
  const bbsId = (await bbsService.findBbsIdByGuildId(guild_id)).bbs_id;
  const results = await partyService.findAllParty(guild_id);
  const channel = client.channels.cache.get(bbsId);
  if (!channel) return;

  const embeds = await Promise.all(
    results.map(async (result) => {
      const dealers = await Promise.all(
        result.members.dealer.map((d) => getCharacterData(d.character_name))
      );
      const supporters = await Promise.all(
        result.members.supporter.map((s) => getCharacterData(s.character_name))
      );

      return new EmbedBuilder()
        .setTitle(
          `${result.party.party_name}  ${
            (dealers.length === 6) & (supporters.length == 2) ? "[마감]" : ""
          }`
        )
        .addFields(
          { name: "목표", value: result.party.contents, inline: true },
          {
            name: "출발 시간",
            value: `${formatDateWithKoreanDay(result.party.start_time)}`,
            inline: false,
          },
          {
            name: `딜러 (${dealers.length} / 6)`,
            value:
              dealers.length === 0
                ? "없음"
                : dealers
                    .map(
                      (d) =>
                        `${d.CharacterName} | ${d.CharacterClassName} (${d.ItemAvgLevel})`
                    )
                    .join("\n"),
          },
          {
            name: `서포터 (${supporters.length} / 2)`,
            value:
              supporters.length === 0
                ? "없음"
                : supporters
                    .map(
                      (s) =>
                        `${s.CharacterName} | ${s.CharacterClassName} (${s.ItemAvgLevel})`
                    )
                    .join("\n"),
          }
        );
    })
  );

  // 파티가 없으면 따로 embed
  const finalEmbeds =
    embeds.length === 0
      ? [new EmbedBuilder().setDescription("😢 현재 파티가 없습니다.")]
      : embeds;

  const lastMessage = lastMessages.find(
    (lastMessage) => lastMessage.bbsId == bbsId
  );

  if (lastMessage) {
    try {
      const msg = await channel.messages.fetch(lastMessage.messageId);
      await msg.edit({ embeds: finalEmbeds });
      return;
    } catch (err) {
      console.error("메시지 수정 실패, 새로 보냄:", err.message);
      lastMessages = lastMessages.filter(
        (lastMessage) => lastMessage.bbsId != bbsId
      );
    }
  }

  // 기존 메시지 없거나 수정 실패 → 새로 전송
  const newMsg = await channel.send({ embeds: finalEmbeds });
  lastMessages.push({ bbsId: bbsId, messageId: newMsg.id });
}

module.exports = sendPartyList;
