import { question } from "readline-sync";
import { playGame } from "./play.js";
import { createRiddle, readAllRiddles, updateRiddle, deleteRiddle } from "./riddles.js";
import { showLeaderboard } from "./leaderboard.js";
import { loadPlayers } from "./playerService.js";

export async function mainMenu() {
  while (true) {
    console.log("\n" + "==============================");
    console.log("  Welcome to the Riddle Game!  ");
    console.log("=============================="+ "\n");
    console.log("What do you want to do?");
    console.log("1. Play the game");
    console.log("2. Read all riddles");
    console.log("3. Create a new riddle");
    console.log("4. Update a riddle");
    console.log("5. Delete a riddle");
    console.log("6. View leaderboard");
    console.log("7. Exit\n");
    const choice = question("Enter your choice: ");
    console.log();
    switch (choice) {
      case "1": await playGame(); break;
      case "2": await readAllRiddles(); break;
      case "3": await createRiddle(); break;
      case "4": await updateRiddle(); break;
      case "5": await deleteRiddle(); break;
      case "6": await viewLeaderboardMenu(); break;
      case "7":
        console.log("Thank you for playing! Goodbye!");
        return;

      default: console.log("Invalid option. Please try again.\n");
    }
  }
}

async function viewLeaderboardMenu() {

    const test = await loadPlayers()
    if (test === -1) {
      console.log("Could not connect to the server. Please make sure it is running.")
      return
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
