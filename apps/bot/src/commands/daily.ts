import { BLANK } from '../utils/embeds';
import { Command } from '../@types';
import { EmbedBuilder } from '@discordjs/builders';
import { SlashCommandBuilder } from 'discord.js';
import { User } from '../models/user';
import { UserSchema } from 'shared-types';
import { hasProfile } from '../utils/interactions';
import { replyNoProfile } from '../utils/interaction.replies';

export const daily: Command = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Claim your daily waifu dust'),
  execute: async interaction => {
    const dsid = interaction.user.id;
    let [isRegistered, user] = await hasProfile(interaction.user.id);
    const dustAmount = Math.round(Math.random() * 20) + 5;

    if (!isRegistered || user == null) {
      const profileModel = new User({
        dsid,
      });
      user = await profileModel.save();
    }

    if (!user.claimedDaily) {
      user
        .$inc('xp', 10)
        .$inc('waifuDust', dustAmount)
        .$set('claimedDaily', true);
      user = await user.save();
    } else {
      const date = new Date();
      const seconds = (59 - date.getSeconds()).toString().padStart(2, '0');
      const minutes = (59 - date.getMinutes()).toString().padStart(2, '0');
      const hours = (23 - date.getHours()).toString().padStart(2, '0');
      const diff = `${hours}:${minutes}:${seconds}`;
      const embed = new EmbedBuilder()
        .setTitle('AWO!?')
        .setDescription('You have already claimed your daily reward!')
        .addFields({
          name: `Come back in:\t\`${diff}\``,
          value: '\u200B',
        });

      await interaction.reply({ embeds: [embed] });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle('Daily')
      .setDescription(
        `Cool beans, you claimed \`${dustAmount}\` **waifu dust** and \`10\` **xp**.\nCome back tomorrow for some more.`
      )
      .addFields(
        {
          name: 'Current balance',
          value: 'XP:\nWaifu dust:',
          inline: true,
        },
        {
          name: BLANK,
          value: `\`${user.xp}\`\n\`${user.waifuDust}\``,
          inline: true,
        },
        {
          name: BLANK,
          value: BLANK,
          inline: true,
        },
        {
          name: 'Tips',
          value:
            "Looking for some statistics about what you've done on **waifubotto**?\nUse `/profile show` to view them.",
        }
      );

    await interaction.reply({ embeds: [embed] });
  },
};
