// client/service/play.js
import { question } from "readline-sync";
import { Riddle, MultipleChoiceRiddle } from "../models/Riddle.js";
import Player from "../models/Player.js";
import { loadRiddles } from "../dal/riddleService.js";
import { updatePlayerTime } from "./playerService.js";
import { getCurrentUser } from '../dal/authService.js';

export async function playGame() {

  const allRiddles = await loadRiddles();

  if (allRiddles === null || allRiddles.length === 0) {
    console.log("Cannot start the game without riddles. Make sure the server is running and you have permission to access riddles.");
    return;
  }

  allRiddles.sort((a, b) => Number(a.id) - Number(b.id));

  const currentUser = getCurrentUser();
  const isLoggedInUserOrAdmin = currentUser && (currentUser.role === 'user' || currentUser.role === 'admin');

  let name = "Guest";
  if (isLoggedInUserOrAdmin) {
      name = currentUser.username;
      console.log(`Welcome to the game, ${name}!`);
  } else {
      console.log("You are playing as a guest. Your results will not be saved.");
  }

  console.log();
  const player = new Player(name);
  let difficultyChoice = Number(question("Choose difficulty (1-easy, 2-medium, 3-hard, 4-all): "));
  console.log();

  const diffMap = { 1: "easy", 2: "medium", 3: "hard" };
  
  let filteredRiddles = [];
  if (difficultyChoice !== 4) {
    filteredRiddles = allRiddles.filter(riddle => riddle.difficulty === diffMap[difficultyChoice]);
  } else {
    filteredRiddles = allRiddles;
  }

  if (filteredRiddles.length === 0) {
    console.log("No riddles available for the chosen difficulty.\n");
    return;
  }

  const gameRiddles = filteredRiddles.map(data =>
    data.type.toLowerCase() === "multiple"
      ? new MultipleChoiceRiddle(data)
      : new Riddle(data)
  );

  console.log("\n" + "--- Game Start ---");
  for (const riddle of gameRiddles) {
    const start = Date.now();
    riddle.ask();
    const end = Date.now();
    player.recordTime(riddle.difficulty, (end - start) / 1000);
    console.log("--------------------" + "\n");
  }
  console.log("--- Game End ---\n");

  player.showStats(gameRiddles.length);

  if (isLoggedInUserOrAdmin) {
      try {
        if (difficultyChoice === 4) {
          for (const diff in player.times) {
            await updatePlayerTime(name, diff, player.times[diff]);
          }
          console.log(`\nPlayer data for all difficulties has been saved.`);
        } else {
          const specificDiffKey = diffMap[difficultyChoice];
          await updatePlayerTime(name, specificDiffKey, player.times[specificDiffKey]);
          console.log(`\nPlayer data for ${specificDiffKey} difficulty has been saved.`);
        }
      } catch (error) {
        console.error("Failed to save player data:", error.message);
        console.log("\nCould not save player data. Make sure the server is running and you are logged in with a user/admin account.");
      }
  } else {
      console.log("\nResults were not saved because you are not logged in as a user or admin.");
  }
  console.log("\n");
}