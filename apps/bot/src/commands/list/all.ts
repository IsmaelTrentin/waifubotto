import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

import { BTN_INTERACTIONS_IDS } from '../../utils/constants';
import { CommandInteractionExecute } from '../../@types';
import { buildCharactersListEmbed } from '../../utils/embeds';
import { getListPage } from '../../utils/characters';

export const listAll: CommandInteractionExecute = async interaction => {
  await interaction.deferReply();

  const dsid = interaction.user.id;
  const { localCharacters, charactersData, maxPage } = await getListPage(
    dsid,
    1
  );
  const embed = buildCharactersListEmbed(
    interaction,
    localCharacters,
    charactersData,
    1,
    maxPage
  );

  if (localCharacters.length === 0) {
    await interaction.editReply({
      embeds: [embed],
    });
    return;
  }

  let rowOne: ActionRowBuilder | null = null;
  if (maxPage > 1) {
    rowOne = new ActionRowBuilder();
    rowOne.setComponents(
      new ButtonBuilder()
        .setCustomId(BTN_INTERACTIONS_IDS.listall.next)
        .setStyle(ButtonStyle.Primary)
        .setLabel('➡')
        .setDisabled(maxPage === 1)
    );
  }

  await interaction.editReply({
    embeds: [embed],
    components: rowOne ? [rowOne as any] : [],
  });
};
