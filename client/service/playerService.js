import { getAuthHeaders } from '../utils/authUtils.js';

const BASE_URL = 'http://localhost:3007/api/players';

export async function loadPlayers() {
  try {
    const response = await fetch(BASE_URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading players:", error.message);
    return -1;
  }
}

export async function updatePlayerTime(name, difficulty, newTime) {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, difficulty, newTime })
    });
    const data = await response.json();
    if (!response.ok) {
        console.error(`Error updating player time: ${data.message || response.statusText}`);
        return null;
    }
    return data;
  } catch (error) {
    console.error("Error updating player time:", error.message);
    return null;
  }
}