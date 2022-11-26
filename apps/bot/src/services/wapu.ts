import { CharacterSchema } from 'shared-types';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://wapu.priisma.dev/api/v1',
});

const getCharacter = async (id: number) => {
  const { character } = await getCharacterAndCreated(id);
  return character;
};

const getCharacterAndCreated = async (id: number) => {
  const { data, status } = await axiosInstance.get<CharacterSchema>(
    `/characters/${id}`
  );
  return {
    character: data,
    created: status === 201,
  };
};

export const wapu = {
  getCharacter,
  getCharacterAndCreated,
};
