import { pool } from './db.js';
import { InteractionResponseType } from 'discord-interactions';


async function addOrUpdateScore(gameName, user, score) {
  try {
    if (user === null || user.id === null) {
      console.error('User is null or user.id is null. user:', user);
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'Internal error'
        }
      };
    }

    // Validate score is between 0 and 10
    if (score < 0 || score > 10) {
      throw new Error('Score must be between 0 and 10');
    }

    // Check if score already exists for this game/user combination
    const existingScore = await pool.query(
      'SELECT * FROM "Scores" WHERE game = $1 AND user_id = $2',
      [gameName, user.id]
    );
    console.log('existingScore:', existingScore.rows);

    if (existingScore.rows.length > 0) {
      // Update existing score
      await pool.query(
        'UPDATE "Scores" SET score = $1 WHERE game = $2 AND user_id = $3',
        [score, gameName, user.id]
      );
      console.log(`Updated score for game ${gameName} by user ${user.id} to ${score}`);
    } else {
      // Insert new score
      await pool.query(
        'INSERT INTO "Scores" (game, score, user_id, username) VALUES ($1, $2, $3, $4)',
        [gameName, score, user.id, user.global_name ?? user.username]
      );
      console.log(`Added new score for game ${gameName} by user ${user.id}: ${score}`);
    }

    // Update the average score in Games table
    // it's not the most efficient, because we only need to update the score for the game that was rated
    // but it's the easiest way to do it
    await updateGameScores();

    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: `${gameName} rated ${score} by ${user.global_name ?? user.username}`
      }
    };

  } catch (error) {
    console.error('Error adding/updating score:', error);
    throw new Error('Failed to add/update score');
  }
}


async function updateGameScores() {
  try {
    // Get average scores for each game
    const avgScoresResult = await pool.query(
      `SELECT 
        game,
        AVG(score) as average_score,
        RANK() OVER (ORDER BY AVG(score) DESC) as rank
      FROM "Scores"
      GROUP BY game`
    );

    // Update each game's score in the Games table
    for (const row of avgScoresResult.rows) {
      await pool.query(
        `UPDATE "Games"
        SET score = $1,
            rank = $2
        WHERE name = $3`,
        [Number(row.average_score).toFixed(2), row.rank, row.game]
      );
      console.log(`Updated score for ${row.game} to ${Number(row.average_score).toFixed(2)}`);
    }

    avgScoresResult.rows.forEach(row => {
      console.log(`${row.game}: Score ${row.average_score} (Rank #${row.rank})`);
    });

    console.log('Successfully updated all game scores');
  } catch (error) {
    console.error('Error updating game scores:', error);
    throw new Error('Failed to update game scores');
  }
}

async function handleRatingsCommand(subcommand) {
  try {
    console.log(JSON.stringify(subcommand, null, 2));
    const subcommandName = subcommand.name;
    const limit = subcommand.options?.find(option => option.name === 'limit')?.value || 25;
    
    let result;
    let colToDisplay;
    if (subcommandName === 'game') {
      colToDisplay = 'username';
      result = await pool.query(
        `SELECT *
         FROM "Scores"
         WHERE game = $1
         ORDER BY score DESC
         LIMIT $2`,
        [subcommand.options[0].value, limit]
      );
    } else if (subcommandName === 'user') {
      colToDisplay = 'game';
      result = await pool.query(
        `SELECT *
         FROM "Scores"
         WHERE username = $1
         ORDER BY score DESC
         LIMIT $2`,
        [subcommand.options[0].value, limit]
      );
      console.log(JSON.stringify(result.rows, null, 2));
    }


    if (result.rows.length === 0) {
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `No ratings found for ${subcommandName}`
        }
      };
    }

    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: `Ratings for ${subcommandName} ${subcommand.options[0].value}:\n${result.rows.map((row, index) => 
          `${index + 1}. ${row[colToDisplay]} - ${row.score}/10`
        ).join('\n')}`
      }
    };
  } catch (error) {
    console.error('Error fetching ratings:', error);
    throw new Error('Failed to fetch ratings');
  }
}


export { addOrUpdateScore, updateGameScores, handleRatingsCommand };
