const BASE_URL = 'http://localhost:3007/api/players';

export async function loadPlayers() {
  try {
    const response = await fetch(BASE_URL);
    const data = await response.json();
    return data;
  } catch (error) {
    return -1;
  }
}

export async function updatePlayerTime(name, difficulty, newTime) {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, difficulty, newTime })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating player time:", error.message);
  }
}
