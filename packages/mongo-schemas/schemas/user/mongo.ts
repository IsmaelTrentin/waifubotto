import { Schema, SchemaOptions } from 'mongoose';

import type { UserSchema } from 'shared-types';
import { localCharacterSchema } from '../local.character';

const options: SchemaOptions = {
  collection: 'users',
};

export const userSchema = new Schema<UserSchema>(
  {
    dsid: {
      type: String,
      required: true,
    },
    xp: {
      type: Number,
      required: true,
      default: 0,
    },
    points: {
      type: Number,
      required: true,
      default: 0,
    },
    waifuDust: {
      type: Number,
      required: true,
      default: 0,
    },
    favouriteCharacterId: {
      type: Number,
      required: false,
    },
    characters: [localCharacterSchema],
    claimedDaily: {
      type: Boolean,
      required: true,
      default: false,
    },
    claimedDailyGacha: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  options
);
