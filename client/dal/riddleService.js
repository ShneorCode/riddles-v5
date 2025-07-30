import { getAuthHeaders } from '../utils/authUtils.js';

const BASE_URL = 'http://localhost:3007/api/riddles';

export async function loadRiddles() {
  try {
    const response = await fetch(BASE_URL, {
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error(`Error loading riddles: ${errorData.message || response.statusText}`);
        return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network or server error while loading riddles:", error.message);
    return null;
  }
}

export async function createRiddleOnServer(riddle) {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(riddle)
    });
    const data = await response.json();
    if (!response.ok) {
        console.error(`Error creating riddle: ${data.message || response.statusText}`);
        return null;
    }
    return data;
  } catch (error) {
    console.error("Error creating riddle:", error.message);
    return null;
  }
}

export async function updateRiddleOnServer(id, riddle) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(riddle)
    });
    const data = await response.json();
    if (!response.ok) {
        console.error(`Error updating riddle: ${data.message || response.statusText}`);
        return null;
    }
    return data;
  } catch (error) {
    console.error("Error updating riddle:", error.message);
    return null;
  }
}

export async function deleteRiddleOnServer(id) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) {
        const errorData = await response.json();
        console.error(`Error deleting riddle: ${errorData.message || response.statusText}`);
        return false;
    }
    return true;
  } catch (error) {
    console.error("Error deleting riddle:", error.message);
    return false;
  }
}