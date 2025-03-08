import { InteractionResponseType } from 'discord-interactions';
import { pool } from './db.js';


async function showGamelist(options) {
  try {
    // todo: add pagination
    const limit = options?.find(option => option.name === 'limit')?.value || 25;
    const sort = options?.find(option => option.name === 'sort')?.value || 'score';
    const order = options?.find(option => option.name === 'order')?.value || 'DESC';

    console.log('Limit:', limit);
    console.log('Sort:', sort); 
    console.log('Order:', order);
    const result = await pool.query(
      'SELECT * FROM "Games" ' +
      'ORDER BY ' + sort + ' ' + order + ' ' +
      'LIMIT $1',
      [limit]
    );
    
    if (result.rows.length === 0) {
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'The gamelist is empty!'
        }
      };
    }
    
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: `Games in gamelist (ordered by ${sort}):\n${result.rows.map((game, index) => `${index + 1}. ${game.name} (Score: ${game.score}, Price: $${game.price})`).join('\n')}`
      }
    };
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to fetch games from database');
  }
} 

export { showGamelist };