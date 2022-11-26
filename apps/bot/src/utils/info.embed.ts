import { CacheType, ChatInputCommandInteraction } from 'discord.js';
import { EmbedBuilder, hyperlink } from '@discordjs/builders';
import { buildAuthor, buildRequestedByFooter } from './embeds';

import { CharacterSchema } from 'shared-types';

export const buildCharacterInfoEmbed = (
  character: CharacterSchema,
  interaction: ChatInputCommandInteraction<CacheType>
) => {
  const characterUrl = `https://myanimelist.net/character/${character._id}`;
  const title = character.japaneseName
    ? `${character.name} | ${character.japaneseName}`
    : character.name;
  const aliases = (() => {
    const _ = character.aliases.join(', ');
    return _.length === 0 ? '-' : _;
  })();
  const descSliced = character.description.slice(0, 150);
  const idx = descSliced.indexOf('\n\n');
  const desc =
    descSliced.slice(0, idx) +
    '\n' +
    hyperlink('keep reading...', characterUrl);

  const embed = new EmbedBuilder({
    title,
    url: characterUrl,
    description: desc,
    author: buildAuthor(interaction),
    thumbnail: {
      url: character.image,
    },
    image: { url: character.image },
    footer: buildRequestedByFooter(interaction),
    fields: [
      {
        name: 'Name',
        value: character.name,
        inline: true,
      },
      {
        name: 'Japanese name',
        value: character.japaneseName ?? '-',
        inline: true,
      },
      {
        name: '\u200B',
        value: '\u200B',
        inline: true,
      },
      {
        name: 'Aliases',
        value: aliases,
        inline: true,
      },
      {
        name: 'Favourites',
        value: character.favorites.toString(),
        inline: true,
      },
      {
        name: '\u200B',
        value: '\u200B',
        inline: true,
      },
      {
        name: 'Seen in',
        value: `**${character.animeography.length}** animes, **${character.mangaography.length}** mangas`,
      },
    ],
  });

  return embed;
};
