import { Command } from '../../@types';
import { SlashCommandBuilder } from 'discord.js';
import { profileSetFav } from './setfav';
import { profileShow } from './show';

const profile: Command = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('Profile related commands')
    .addSubcommand(sub =>
      sub.setName('show').setDescription('Take a look at your profile')
    )
    .addSubcommand(sub =>
      sub
        .setName('setfav')
        .setDescription('Set your favourite character')
        .addIntegerOption(opt =>
          opt
            .setName('malid')
            .setDescription('The character MAL id')
            .setMinValue(1)
            .setRequired(true)
        )
    ),
  execute: async interaction => {
    const cmd = interaction.options.getSubcommand();

    if (cmd === 'show') {
      await profileShow(interaction);
      return;
    } else if (cmd === 'setfav') {
      await profileSetFav(interaction);
      return;
    }

    // should be unreachable
    await interaction.reply('Unknown command provided');
  },
};

export default profile;
