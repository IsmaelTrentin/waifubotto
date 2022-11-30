import { CommandInteractionHandler } from '../@types';
import { SlashCommandBuilder } from 'discord.js';
import { User } from '../models/user';

const resetDaily: CommandInteractionHandler = {
  data: new SlashCommandBuilder()
    .setName('resetdaily')
    .setDescription('Reset all daily claims')
    .setDefaultMemberPermissions(8),
  execute: async interaction => {
    await interaction.deferReply({ ephemeral: true });

    const result = await User.updateMany(
      {
        $or: [{ claimedDaily: true }, { claimedDailyGacha: true }],
      },
      {
        $set: {
          claimedDaily: false,
          claimedDailyGacha: false,
        },
      }
    );

    const { matchedCount, modifiedCount } = result;
    await interaction.editReply(
      `Done. ${matchedCount} matched ${modifiedCount} modified`
    );
  },
};

export default resetDaily;
