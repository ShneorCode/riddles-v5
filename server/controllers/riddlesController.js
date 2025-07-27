import {
  getAllRiddles,
  addRiddle,
  updateRiddle,
  deleteRiddle
} from '../dal/riddlesMongoDAL.js';

export async function getRiddlesController(req, res) {
  try {
    const riddles = await getAllRiddles();
    res.json(riddles);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch riddles." });
  }
}

export async function addRiddleController(req, res) {
  try {
    const riddle = req.body;
    if (!riddle.name || !riddle.taskDescription || !riddle.correctAnswer || !riddle.type || !riddle.difficulty) {
      return res.status(400).json({ error: "Missing required riddle fields." });
    }
    const added = await addRiddle(riddle);
    res.status(201).json(added);
  } catch (err) {
    res.status(500).json({ error: "Failed to add riddle." });
  }
}

export async function updateRiddleController(req, res) {
  try {
    const id = req.params.id;
    const updatedFields = req.body;
    const updated = await updateRiddle(id, updatedFields);
    if (!updated) return res.status(404).json({ error: "Riddle not found." });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update riddle." });
  }
}

export async function deleteRiddleController(req, res) {
  try {
    const id = req.params.id;
    const deleted = await deleteRiddle(id);
    if (!deleted) return res.status(404).json({ error: "Riddle not found." });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete riddle." });
  }
}
