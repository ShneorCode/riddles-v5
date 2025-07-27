import { getAllPlayers, upsertPlayer } from '../dal/playersSupabaseDAL.js';

export async function getPlayersController(req, res) {
  try {
    const players = await getAllPlayers();
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: "Failed to get players." });
  }
}

export async function upsertPlayerController(req, res) {
  try {
    const { name, difficulty, newTime } = req.body;
    if (!name || !difficulty || newTime === undefined) {
      return res.status(400).json({ error: "Missing required fields." });
    }
    const updatedPlayer = await upsertPlayer(name, difficulty, newTime);
    res.json(updatedPlayer);
  } catch (err) {
    console.error('Error in POST /api/players:', err);
    res.status(500).json({ error: "Failed to update player." });
  }
}
