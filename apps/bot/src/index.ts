import { Client, GatewayIntentBits } from 'discord.js';

import { connectDb } from './services/db';
import dotenv from 'dotenv';
import { handleCommandError } from './utils/commands';
import logger from '@note-dev-org/service-logger';
import { readCommands } from './read.commands';
import { registerCommands } from './register.commands';
import { startJobs } from './start.jobs';

dotenv.config();

if (process.env.NODE_ENV === 'production') {
  logger.info('Running in production mode');
} else {
  logger.info('Running in development mode');
}

if (process.env.CLIENT_ID == undefined) {
  logger.error('FATAL: no discord client id provided in .env (CLIENT_ID)');
  process.exit(1);
}
if (process.env.TOKEN == undefined) {
  logger.error('FATAL: no discord token provided in .env (TOKEN)');
  process.exit(1);
}

const main = async () => {
  const client = new Client({
    intents: [GatewayIntentBits.Guilds],
  });
  const commands = await readCommands();

  try {
    await connectDb();
  } catch (error) {
    logger.error((error as Error).toString(), { at: 'a' });
    process.exit(1);
  }

  // test dev branch
  startJobs();

  client.login(process.env.TOKEN).catch(err => logger.error(err));

  client.on('ready', async () => {
    logger.info(`Logged in as ${client?.user?.tag}!`);
    await registerCommands([...commands.values()].map(v => v.data));
  });

  client.on('interactionCreate', async interaction => {
    if (interaction.isChatInputCommand()) {
      const cmd = commands.get(interaction.commandName);
      if (!cmd) return;

      try {
        await cmd.execute(interaction);
      } catch (error) {
        logger.warn('latest cmd.execute error:');
        console.error(error);
        await handleCommandError(error, interaction);
      }
    } else if (interaction.isButton()) {
      // await interaction.update('test updte');
      await interaction.reply('button interaction');
    }
  });

  client.on('error', error => {
    logger.error('' + error, { at: 'client' });
  });
};

main().catch(err => logger.error(err));
