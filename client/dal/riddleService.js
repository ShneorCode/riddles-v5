const BASE_URL = 'http://localhost:3007/api/riddles';

export async function loadRiddles() {
  try {
    const response = await fetch(BASE_URL);
    const data = await response.json();
    return data;
  } catch (error) {
    return -1;
  }
}

export async function createRiddleOnServer(riddle) {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(riddle)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating riddle:", error.message);

  }
}

export async function updateRiddleOnServer(id, riddle) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(riddle)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating riddle:", error.message);

  }
}

export async function deleteRiddleOnServer(id) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error("Error deleting riddle:", error.message);

  }
}
