import { CommandInteractionHandler } from '../../@types';
import { SlashCommandBuilder } from 'discord.js';
import { listAll } from './all';
import { listView } from './view';

const list: CommandInteractionHandler = {
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
    } else if (cmd === 'view') {
      await listView(interaction);
    }
  },
};

export default list;
