import { Awaitable, CacheType, Collection, Interaction } from 'discord.js';
import {
  ButtonInteractionData,
  ButtonInteractionExecute,
} from './button.interaction';
import {
  CommandInteractionData,
  CommandInteractionExecute,
} from './command.interaction';

export interface InteractionHandler<D = unknown, E = unknown> {
  data: D;
  execute: E;
}

export type CommandInteractionHandler = InteractionHandler<
  CommandInteractionData,
  CommandInteractionExecute
>;

export type ButtonInteractionHandler = InteractionHandler<
  ButtonInteractionData,
  ButtonInteractionExecute
>;

export type InteractionHandlerTypes =
  | CommandInteractionHandler
  | ButtonInteractionHandler;

export type InteractionEventHandler<T extends InteractionHandlerTypes> = (
  interaction: Interaction<CacheType>,
  collection: Collection<string, T>
) => Awaitable<void>;
