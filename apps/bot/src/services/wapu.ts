import { ApiResponseError, CharacterSchema } from 'shared-types';
import axios, { AxiosError } from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://wapu.priisma.dev/api/v1',
});

const getCharacter = async (id: number) => {
  const result = await getCharacterAndCreated(id);
  return result?.character || null;
};

const getCharacterAndCreated = async (id: number) => {
  try {
    const { data, status } = await axiosInstance.get<CharacterSchema>(
      `/characters/${id}`
    );
    return {
      character: data,
      created: status === 201,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const { response } = error as AxiosError<ApiResponseError>;

      if (response?.status === 404 || response?.status === 400) {
        return null;
      }
    }
    throw error;
  }
};

export const wapu = {
  getCharacter,
  getCharacterAndCreated,
};
