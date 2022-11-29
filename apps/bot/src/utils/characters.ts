import { CharacterSchema, LocalCharacterSchema } from 'shared-types';

import { MAX_ITEMS_IN_LIST } from './constants';
import { User } from '../models/user';
import { hasProfile } from './interactions';
import { hyperlink } from 'discord.js';
import { wapu } from '../services/wapu';

export const malCharacterLink = (
  character: CharacterSchema | LocalCharacterSchema
) => {
  const id =
    (character as CharacterSchema)._id != undefined
      ? (character as CharacterSchema)._id
      : (character as LocalCharacterSchema).id;

  return `https://myanimelist.net/character/${id}`;
};

export const hyperMalCharacterLink = (
  character: CharacterSchema,
  content?: string
) => {
  return hyperlink(content ?? character.name, malCharacterLink(character));
};

export const getListPage = async (dsid: string, page: number = 1) => {
  let [isRegistered, user] = await hasProfile(dsid);

  if (!isRegistered || user == null) {
    const profileModel = new User({
      dsid,
    });
    user = await profileModel.save();
  }

  const maxPage = Math.round(user.characters.length / MAX_ITEMS_IN_LIST) + 1;
  const localCharacters = user.characters.slice(
    Math.max(page - 1, 0) * MAX_ITEMS_IN_LIST,
    Math.max(page - 1, 0) * MAX_ITEMS_IN_LIST + MAX_ITEMS_IN_LIST
  );
  const charactersData: CharacterSchema[] = [];

  for (const lc of localCharacters) {
    const result = await wapu.getCharacter(lc.id);
    if (result) {
      charactersData.push(result);
    } else {
      charactersData.push({
        _id: lc.id,
        aliases: [],
        animeography: [],
        description: '',
        favorites: 0,
        image: '',
        mangaography: [],
        name: 'deleted character',
      });
    }
  }

  return {
    localCharacters,
    charactersData,
    maxPage,
  };
};
