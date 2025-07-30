import { question } from "readline-sync";
import { playGame } from "./play.js";
import { createRiddle, readAllRiddles, updateRiddle, deleteRiddle } from "./riddles.js";
import { showLeaderboard } from "./leaderboard.js";
import { loadPlayers } from "./playerService.js";
import { loginUser, logoutUser, getCurrentUser } from '../dal/authService.js';

export async function mainMenu() {
  while (true) {
    const currentUser = getCurrentUser();
    const isLoggedIn = !!currentUser;
    const isAdmin = isLoggedIn && currentUser.role === 'admin';
    const isUser = isLoggedIn && currentUser.role === 'user';

    console.log("\n" + "==============================");
    console.log("  Welcome to the Riddle Game!  ");
    console.log("==============================" + "\n");

    if (isLoggedIn) {
        console.log(`Logged in as: ${currentUser.username} (${currentUser.role})`);
    } else {
        console.log("You are logged in as a guest.");
    }

    console.log("\nWhat would you like to do?");
    console.log("1. Play the game");

    if (isUser || isAdmin) {
        console.log("2. View all riddles");
    }

    if (!isLoggedIn) {
        console.log("3. Login / Register");
    } else {
        console.log("3. Logout");
    }

    if (isUser || isAdmin) {
        console.log("4. Create a new riddle");
    }
    if (isAdmin) {
        console.log("5. Update a riddle");
        console.log("6. Delete a riddle");
    }
    console.log("7. View leaderboard");
    console.log("8. Exit\n");

    const choice = question("Enter your choice: ");
    console.log();

    switch (choice) {
      case "1": await playGame(); break;
      case "2":
        if (isUser || isAdmin) {
            await readAllRiddles();
        } else {
            console.log("Invalid option for a guest.");
        }
        break;
      case "3":
        if (!isLoggedIn) {
            await handleLoginRegister();
        } else {
            logoutUser();
        }
        break;
      case "4":
        if (isUser || isAdmin) {
            await createRiddle();
        } else {
            console.log("You do not have permission to perform this action. Please log in as a user or admin.");
        }
        break;
      case "5":
        if (isAdmin) {
            await updateRiddle();
        } else {
            console.log("You do not have permission to perform this action. Only admins can update riddles.");
        }
        break;
      case "6":
        if (isAdmin) {
            await deleteRiddle();
        } else {
            console.log("You do not have permission to perform this action. Only admins can delete riddles.");
        }
        break;
      case "7": await viewLeaderboardMenu(); break;
      case "8":
        console.log("Thank you for playing! Goodbye!");
        return;
      default: console.log("Invalid option. Please try again.\n");
    }
  }
}

async function handleLoginRegister() {
    const username = question("Enter username: ");
    const password = question("Enter password: ");
    const success = await loginUser(username, password);
    if (!success) {
        console.log("Login or registration failed. Please try again.");
    }
}

async function viewLeaderboardMenu() {
    const test = await loadPlayers();
    if (test === -1) {
      console.log("Could not connect to the server. Please make sure it is running.");
      return;
    }
  while (true) {
    console.log("\n" + "------------------------------");
    console.log("  View Leaderboard by Difficulty  ");
    console.log("-".repeat(30) + "\n");
    console.log("1. Easy");
    console.log("2. Medium");
    console.log("3. Hard");
    console.log("4. All");
    console.log("5. Back to main menu\n");
    const choice = question("Enter your choice: ");
    console.log();
    switch (choice) {
      case "1": await showLeaderboard("easy"); break;
      case "2": await showLeaderboard("medium"); break;
      case "3": await showLeaderboard("hard"); break;
      case "4": await showLeaderboard("all"); break;
      case "5": return;
      default: console.log("Invalid option. Please try again.\n");
    }
  }
}