const AUTH_URL = 'http://localhost:3007/api/auth/login';

let currentToken = null;
let currentUser = null;

export function getToken() {
    return currentToken;
}

export function getCurrentUser() {
    return currentUser;
}

export async function loginUser(username, password) {
    try {
        const response = await fetch(AUTH_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            currentToken = data.token;
            currentUser = data.user;
            console.log("Logged in successfully!");
            return true;
        } else {
            console.error(`Login failed: ${data.message || 'Unknown error'}`);
            currentToken = null;
            currentUser = null;
            return false;
        }
    } catch (error) {
        console.error("Error during login process:", error.message);
        currentToken = null;
        currentUser = null;
        return false;
    }
}

export function logoutUser() {
    currentToken = null;
    currentUser = null;
    console.log("Logged out successfully.");
}