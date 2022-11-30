import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

import { BTN_INTERACTIONS_IDS } from '../../utils/constants';
import { ButtonInteractionHandler } from '../../@types';
import { buildCharactersListEmbed } from '../../utils/embeds';
import { getListPage } from '../../utils/characters';

const listAllControls: ButtonInteractionHandler = {
  data: {
    parent: BTN_INTERACTIONS_IDS.listall.$cmd,
  },
  execute: async interaction => {
    const embed = interaction.message.embeds[0];
    const embedAuthor = embed.author;
    const embedFooter = embed.footer;

    if (
      embed == undefined ||
      embedAuthor == null ||
      embedAuthor.iconURL == undefined ||
      embedFooter == null
    ) {
      await interaction.reply({
        content: 'Sorry, this list embed appears to be invalid',
        ephemeral: true,
      });
      return;
    }

    const ownerDsId = embedAuthor.iconURL.split('/')[4];

    if (ownerDsId !== interaction.user.id) {
      await interaction.reply({
        content: 'You do not own this list',
        ephemeral: true,
      });
      return;
    }

    await interaction.deferUpdate();

    const footerComps = embedFooter.text.split(' ');
    const embedCurrentPage = parseInt(footerComps[footerComps.length - 3]);
    const isNextPageBtn =
      interaction.customId === BTN_INTERACTIONS_IDS.listall.next ? true : false;
    const nextPage = isNextPageBtn
      ? embedCurrentPage + 1
      : Math.max(embedCurrentPage - 1, 1);
    const { localCharacters, charactersData, maxPage } = await getListPage(
      ownerDsId,
      nextPage
    );

    const updatedEmbed = buildCharactersListEmbed(
      interaction,
      localCharacters,
      charactersData,
      nextPage,
      maxPage
    );

    const updatedRowOne = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setCustomId(BTN_INTERACTIONS_IDS.listall.prev)
        .setStyle(ButtonStyle.Primary)
        .setLabel('⬅')
        .setDisabled(nextPage === 1),
      new ButtonBuilder()
        .setCustomId(BTN_INTERACTIONS_IDS.listall.next)
        .setStyle(ButtonStyle.Primary)
        .setLabel('➡')
        .setDisabled(nextPage === maxPage)
    );

    await interaction.editReply({
      embeds: [updatedEmbed],
      components: [updatedRowOne as any],
    });
  },
};

export default listAllControls;
