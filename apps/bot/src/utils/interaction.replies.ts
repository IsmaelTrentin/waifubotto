import { CacheType, ChatInputCommandInteraction } from 'discord.js';

export const replyNoProfile = async (
  interaction: ChatInputCommandInteraction<CacheType>
) => {
  await interaction.reply({
    content:
      "It looks like you don't have a profile 😥\nRun `/profile show` to create it",
    ephemeral: true,
  });
};
