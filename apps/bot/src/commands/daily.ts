import { BLANK } from '../utils/embeds';
import { CommandInteractionHandler } from '../@types';
import { EmbedBuilder } from '@discordjs/builders';
import { SlashCommandBuilder } from 'discord.js';
import { User } from '../models/user';
import { hasProfile } from '../utils/interactions';

const daily: CommandInteractionHandler = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Claim your daily waifu dust'),
  execute: async interaction => {
    await interaction.deferReply();

    const dsid = interaction.user.id;
    let [isRegistered, user] = await hasProfile(dsid);

    if (!isRegistered || user == null) {
      const profileModel = new User({
        dsid,
      });
      user = await profileModel.save();
    }

    const dustAmount = Math.round(Math.random() * 20) + 5;
    const embed = new EmbedBuilder();

    if (!user.claimedDaily) {
      user
        .$inc('xp', 10)
        .$inc('waifuDust', dustAmount)
        .$set('claimedDaily', true);
      user = await user.save();

      embed
        .setTitle('Daily')
        .setDescription(
          `Cool beans, you claimed \`${dustAmount}\` **waifu dust** and \`10\` **xp**.\nCome back tomorrow for some more.`
        )
        .setFields(
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
    } else {
      const date = new Date();
      const seconds = (59 - date.getSeconds()).toString().padStart(2, '0');
      const minutes = (59 - date.getMinutes()).toString().padStart(2, '0');
      const hours = (23 - date.getHours()).toString().padStart(2, '0');
      const diff = `${hours}:${minutes}:${seconds}`;
      embed
        .setTitle('AWO!?')
        .setDescription('You have already claimed your daily reward!')
        .setFields({
          name: `Come back in:\t\`${diff}\``,
          value: '\u200B',
        });
    }

    await interaction.editReply({ embeds: [embed] });
  },
};

export default daily;
