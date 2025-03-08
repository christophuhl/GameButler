import { InteractionResponseType } from 'discord-interactions';
import { pool } from './db.js';
import 'dotenv/config';

export async function handleGamesCommand(data, member) {
  const subcommand = data.options[0].name;
  const subcommandOptions = data.options[0].options?.[0]?.value;
  
  switch (subcommand) {
    case 'get':
      return handleGet(subcommandOptions);
    case 'add':
      return handleAdd(data.options[0].options, member.user);
    case 'update':
      console.log('Handling update command:', subcommandOptions);
      return handleUpdate(data.options[0].options);
    case 'remove':
      if (member.user.id !== process.env.ADMIN_ROLE_ID) {
        return {
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: 'Not authorized to remove games from the gamelist.'
          }
        }
      }
      return handleRemove(subcommandOptions);
    default:
      throw new Error('Unknown subcommand');
  }
}

async function handleGet(gameName) {
  try {
    const result = await pool.query(
      'SELECT * FROM "Games" WHERE name = $1',
      [gameName]
    );
    
    console.log(result.rows);
    if (result.rows.length > 0) {
      const game = result.rows[0];
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `Game Details:\n` +
                  `• Name: ${game.name}\n` +
                  `• Rank: ${game.rank}\n` +
                  `• Score: ${game.score}\n` +
                  `• Price: $${game.price}\n` +
                  `• Added on: ${game.time_added}\n` +
                  `• Added by: ${game.added_by_username}`
        }
      };
    }
    
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: `${gameName} is not in the wishlist.`
      }
    };
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to get game from database');
  }
}

async function handleAdd(options, user) {
  try {
    console.log(JSON.stringify(options, null, 2));
    const gameName = options[0].value;
    console.log(gameName);
    console.log(options[1]);
    const price = options[1].value;

    // Check if game already exists
    const existing = await pool.query(
      'SELECT * FROM "Games" WHERE name = $1',
      [gameName]
    );
    
    if (existing.rows.length > 0) {
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `${gameName} is already in the wishlist!`
        }
      };
    }
    
    // Add new game
    await pool.query(
      'INSERT INTO "Games" (name, price, added_by_username, added_by_discord_id) VALUES ($1, $2, $3, $4)',
      [gameName, price, user.username, user.id]
    );
    
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: `Added ${gameName} (Price: $${price}) to the wishlist!`
      }
    };
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to add game to database');
  }
}

async function handleUpdate(options) {
  try {
    // Check if game exists
    const gameName = options[0].value;
    const updatedPrice = options[1].value;
    const existing = await pool.query(
      'SELECT * FROM "Games" WHERE name = $1',
      [gameName]
    );

    if (existing.rows.length === 0) {
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `${gameName} is not in the wishlist.`
        }
      };
    }

    // Get updated price from Steam API or other source
    // TODO: Implement price update logic

    // Update game price
    await pool.query(
      'UPDATE "Games" SET price = $1 WHERE name = $2',
      [updatedPrice, gameName]
    );

    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: `Updated price for ${gameName} to $${updatedPrice}`
      }
    };

  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to update game in database');
  }
}


async function handleRemove(gameName) {
  try {
    const result = await pool.query(
      'DELETE FROM "Games" WHERE name = $1 RETURNING *',
      [gameName]
    );
    
    if (result.rows.length > 0) {
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `Removed ${gameName} from the gamelist!`
        }
      };
    }
    
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: `${gameName} is not in the gamelist!`
      }
    };
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to remove game from database');
  }
}
 