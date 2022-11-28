import { CharacterSchema } from 'shared-types';
import { hyperlink } from 'discord.js';

export const malCharacterLink = (character: CharacterSchema) => {
  return `https://myanimelist.net/character/${character._id}`;
};

export const hyperMalCharacterLink = (
  character: CharacterSchema,
  content?: string
) => {
  return hyperlink(content ?? character.name, malCharacterLink(character));
};
