import type { UserSchema } from 'shared-types';
import mongoose from 'mongoose';
import { userSchema } from 'mongo-schemas';

export const User = mongoose.model<UserSchema>('User', userSchema);
