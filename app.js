import 'dotenv/config';
import express from 'express';
import {
  ButtonStyleTypes,
  InteractionResponseFlags,
  InteractionResponseType,
  InteractionType,
  MessageComponentTypes,
  verifyKeyMiddleware,
} from 'discord-interactions';
import { showGamelist } from './gamelist.js';
import { handleGamesCommand } from './games.js';
import { addOrUpdateScore, handleRatingsCommand } from './scores.js';

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 * Parse request body and verifies incoming requests using discord-interactions package
 */
app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async function (req, res) {
  // Interaction id, type and data
  console.log('Received interaction:', req.body);
  const { id, type, data, member } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    // "gamelist" command
    if (name === 'gamelist') {
      try {
        const response = await showGamelist(data.options);
        return res.send(response);
      } catch (error) {
        return res.status(400).send({ error: error.message });
      }
    }

    // "games" command
    if (name === 'games') {
      try {
        const response = await handleGamesCommand(data, member);
        return res.send(response);
      } catch (error) {
        return res.status(400).send({ error: error.message });
      }
    }

    // rate command
    if (name === 'rate') {
      try {
        const response = await addOrUpdateScore(data.options[0].value, member.user, data.options[1].value);
        console.log('Response:', response);
        return res.send(response);
      } catch (error) {
        return res.status(400).send({ error: error.message });
      }
    }

    // ratings command
    if (name === 'ratings') {
      try {
        const response = await handleRatingsCommand(data.options[0]);
        return res.send(response);
      } catch (error) {
        return res.status(400).send({ error: error.message });
      }
    }
    
    console.error(`unknown command: ${name}`);
    return res.status(400).json({ error: 'unknown command' });
  }

  console.error('unknown interaction type', type);
  return res.status(400).json({ error: 'unknown interaction type' });
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
