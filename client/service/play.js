import { question } from "readline-sync";
import { Riddle, MultipleChoiceRiddle } from "../models/Riddle.js";
import Player from "../models/Player.js";
import { loadRiddles } from "../dal/riddleService.js";
import { updatePlayerTime } from "./playerService.js";


export async function playGame() {
  
  
  const test = await loadRiddles()
  if (test === -1) {
    console.log("Could not connect to the server. Please make sure it is running.")
    return
  }

  const name = question("What is your name? ");
  console.log();

  const player = new Player(name);

  let difficultyChoice = Number(question("Choose difficulty (1-easy, 2-medium, 3-hard, 4-all): "));
  console.log();

  const diffMap = { 1: "easy", 2: "medium", 3: "hard" };

  let allRiddles = [];
  try {
    allRiddles = await loadRiddles();
    allRiddles.sort((a, b) => Number(a.id) - Number(b.id));
  } catch (error) {
    console.error("Failed to load riddles for game:", error.message);
    console.log("Cannot start game without riddles. Please ensure the server is running.");
    return;
  }

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
    console.log("\nCould not save player data. Please ensure the server is running.");
  }

  console.log("\n");
}
