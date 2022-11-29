import { Schema, SchemaOptions } from 'mongoose';

import type { LocalCharacterSchema } from 'shared-types';

const options: SchemaOptions = {
  autoCreate: false,
  _id: false,
};

export const localCharacterSchema = new Schema<LocalCharacterSchema>(
  {
    id: {
      type: Number,
      required: true,
    },
    localId: {
      type: Number,
      required: true,
    },
    affection: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  options
);
