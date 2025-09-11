const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("파티멤버확인")
    .setDescription("생성된 파티의 멤버를 확인합니다.")
    .addNumberOption(option =>
      option.setName("party-id")
        .setDescription("파티 번호")
        .setRequired(true)),

  async execute(interaction) {
    await interaction.reply("해당 파티의 멤버를 보여줍니다.");
  },
};
