import type { CharacterSchema } from 'shared-types';
import { CommandInteractionHandler } from '../@types';
import { SlashCommandBuilder } from '@discordjs/builders';
import { buildCharacterInfoEmbed } from '../utils/embeds';
import { handleRequestError } from '../utils/interactions';
import { wapu } from '../services/wapu';

const info: CommandInteractionHandler = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Displays character infos')
    .addIntegerOption(option =>
      option
        .setName('malid')
        .setDescription("The character's MyAnimeList id")
        .setMinValue(1)
        .setRequired(true)
    ),
  execute: async interaction => {
    await interaction.deferReply();

    const malid = interaction.options.getInteger('malid', true);

    let characterData: CharacterSchema | undefined;
    let isNew = true;

    try {
      const result = await wapu.getCharacterAndCreated(malid || 1);
      if (result == null) {
        await interaction.editReply({
          content: `Character ${malid} not found`,
        });
        return;
      }
      characterData = result.character;
      isNew = result.created;
    } catch (error) {
      handleRequestError(error, interaction);
      return;
    }

    if (isNew) {
      await interaction.editReply('📥 Character found and added to DB!');
    } else {
      await interaction.editReply('🔍 Character found!');
    }

    const embed = buildCharacterInfoEmbed(characterData, interaction);
    const msg = await interaction.followUp({
      content: '📜 Character details:',
      embeds: [embed],
    });
    if (msg && isNew) {
      await msg.react('📥');
    }
  },
};

export default info;
