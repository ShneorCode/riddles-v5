import { question } from 'readline-sync';
import { playGame } from './play.js'
import { viewLeaderboardMenu } from './menu.js'


export async function guestMenu() {
    while (true) {
        console.log("\n" + "==============================");
        console.log("  Welcome to the Riddle Game!  ");
        console.log("==============================" + "\n");
        console.log("What do you want to do?");
        console.log("1. Play the game");
        console.log("2. View leaderboard");
        console.log("3. Exit\n");
        const choice = question("Enter your choice: ");
        console.log();
        switch (choice) {
            case "1": await playGame(); break;
            case "2": await viewLeaderboardMenu(); break;
            case "3":
                console.log("Thank you for playing! Goodbye!");
                process.exit(0);

            default: console.log("Invalid option. Please try again.\n");
        }
    }
}