import {
  CommandInteractionHandler,
  InteractionHandler,
  InteractionHandlerTypes,
} from './@types';

import { Collection } from 'discord.js';
import fs from 'fs/promises';
import logger from '@note-dev-org/service-logger';
import path from 'path';

export const readInteractionHandlers = async <
  T extends InteractionHandlerTypes
>(
  baseDir: 'commands' | 'buttons'
) => {
  const extFilter = process.env.NODE_ENV === 'production' ? '.js' : '.ts';
  const handlers = new Collection<string, T>();
  const handlersPath = path.join(__dirname, baseDir);

  let handlerFiles: string[] = [];
  try {
    const handlerDirs = await fs.readdir(handlersPath, { withFileTypes: true });
    handlerFiles = handlerDirs
      .filter(
        entry =>
          entry.isDirectory() ||
          (entry.isFile() &&
            !entry.name.includes('.d.ts') &&
            entry.name.endsWith(extFilter))
      )
      .map(entry => entry.name);
  } catch (error) {
    logger.error(error);
    return handlers;
  }

  logger.info(`Reading ${baseDir}...`, {
    at: `readInteractionHandlers`,
  });

  const t1 = Date.now();
  for (const [i, file] of handlerFiles.entries()) {
    const filePath = path.join(handlersPath, file);
    const module = require(filePath);

    // should cast to respective handler
    const handler = module['default'];

    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    const key = baseDir === 'buttons' ? handler.data.parent : handler.data.name;
    handlers.set(key, handler);
    logger.info(`[${i}] /${key} (${file})`, {
      at: 'readInteractionHandlers',
    });
  }
  logger.info(`✅ Read ${handlers.size} handlers in ${Date.now() - t1}ms`, {
    at: 'readInteractionHandlers',
  });

  return handlers;
};
