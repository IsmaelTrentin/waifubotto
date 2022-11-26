import { LocalCharacterSchema } from './local.character';

export interface UserSchema {
  _id: string;
  dsid: string;
  xp: number;
  points: number;
  waifuDust: number;
  characters: LocalCharacterSchema[];
  favouriteCharacterId?: number;
  claimedDaily: boolean;
  claimedDailyGacha: boolean;
}
