import { Command } from '../../@types';
import { SlashCommandBuilder } from 'discord.js';
import { listAll } from './list.all';

const list: Command = {
  data: new SlashCommandBuilder()
    .setName('list')
    .setDescription('Claimed characters list related commands')
    .addSubcommand(cmd =>
      cmd.setName('all').setDescription('List all your claimed characters')
    )
    .addSubcommand(cmd =>
      cmd
        .setName('view')
        .setDescription('View a specific character')
        .addIntegerOption(opt =>
          opt
            .setName('localid')
            .setDescription(
              'The character local id, aka its position in the list'
            )
            .setMinValue(1)
            .setRequired(true)
        )
    ),
  execute: async interaction => {
    const cmd = interaction.options.getSubcommand();

    if (cmd === 'all') {
      await listAll(interaction);
      return;
    }
    // } else if (cmd === 'view') {
    //   await listView(interaction);
    //   return;
    // }

    // should be unreachable
    await interaction.reply('Unknown command provided');
  },
};

export default list;
