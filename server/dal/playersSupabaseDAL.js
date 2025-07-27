import { supabase } from '../db/supabaseClient.js';
import { randomUUID } from 'crypto';

const TABLE = 'players';

export async function getAllPlayers() {
  try {
    const { data, error } = await supabase.from(TABLE).select('*');
    if (error) {
      console.error("Failed to import the player list:", error.message);
      return [];
    }
    return data;
  } catch (error) {
    console.error("Unexpected error getting players:", error.message);
    return [];
  }
}

export async function upsertPlayer(name, difficulty, newTime) {
  try {
    const { data, error } = await supabase.from(TABLE).select('*').eq('name', name);
    if (error) {
      console.error("Error fetching player:", error.message);
      return null;
    }

    if (!data || data.length === 0) {
      const newPlayer = { name, times: { [difficulty]: newTime } };
      const { error } = await supabase.from(TABLE).insert([newPlayer]);
      if (error) {
        console.error("Error inserting new player:", error.message);
        return null;
      }
      return newPlayer;
    }

    const player = data[0];
    const times = player.times || {};

    if (!times[difficulty] || newTime < times[difficulty]) {
      times[difficulty] = newTime;
      const response = await supabase.from(TABLE).update({ times }).eq('id', player.id);

      if (response.error) {
        console.error("Update error:", response.error);
      }
      return { ...player, times };
    }

    return player;
  } catch (error) {
    console.error("Unexpected error in upsertPlayer:", error.message);
    return null;
  }
}


