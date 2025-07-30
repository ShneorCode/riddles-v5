import { question } from "readline-sync";
import { loadRiddles, createRiddleOnServer, updateRiddleOnServer, deleteRiddleOnServer } from "../dal/riddleService.js";

export async function createRiddle() {
  const testRiddles = await loadRiddles();
  if (testRiddles === null) {
    console.log("Could not connect to the server or you do not have permission to create a riddle. Make sure the server is running and you are logged in as a user/admin.");
    return;
  }

  console.log("\n--- Create New Riddle ---");
  const name = question("Enter riddle name: ");
  const task = question("Enter description: ");
  const answer = question("Enter correct answer: ");
  const hint = question("Enter a hint for this riddle (optional): ");
  let type = question("Type (basic/multiple): ");
  while (!["basic", "multiple"].includes(type)) {
    console.log("Invalid type. Please enter 'basic' or 'multiple'.");
    type = question("Type (basic/multiple): ");
  }
  let difficulty = question("Difficulty (easy/medium/hard): ");
  while (!["easy", "medium", "hard"].includes(difficulty)) {
    console.log("Invalid difficulty. Please enter 'easy', 'medium', or 'hard'.");
    difficulty = question("Difficulty (easy/medium/hard): ");
  }

  let choices = [];
  if (type === "multiple") {
    console.log("Enter choices for multiple choice (comma separated): ");
    const choicesInput = question("");
    choices = choicesInput.split(",").map(choice => choice.trim());
    if (!choices.includes(answer)) {
      choices.push(answer);
    }
  }

  const newRiddle = { name, taskDescription: task, correctAnswer: answer, hint, type, difficulty };
  if (choices.length > 0) newRiddle.choices = choices;

  try {
    const created = await createRiddleOnServer(newRiddle);
    console.log("\nRiddle created:", created);
  } catch (error) {
    console.error("Failed to create riddle:", error.message);
  }
}

export async function readAllRiddles() {
  try {
    const riddles = await loadRiddles();
    if (riddles === null) {
      console.log("Could not connect to the server or you do not have permission to view riddles. Make sure the server is running and you are logged in as a user/admin.");
      return;
    }
    if (riddles.length === 0) {
      console.log("No riddles found in the system.");
      return;
    }
    riddles.sort((a, b) => Number(a.id) - Number(b.id));
    console.log("\n--- All Riddles ---");
    riddles.forEach(r => {
      console.log(`ID: ${r.id} | Name: ${r.name} | Difficulty: ${r.difficulty} | Type: ${r.type}`);
      console.log(`Task: ${r.taskDescription}`);
      console.log(`Answer: ${r.correctAnswer}`);
      if (r.choices) console.log(`Choices: ${r.choices.join(", ")}`);
      console.log(`Hint: ${r.hint || "---"}`);
      console.log("--------------------");
    });
  } catch (error) {
    console.error("Failed to load riddles:", error.message);
  }
}

export async function updateRiddle() {
  const testRiddles = await loadRiddles();
  if (testRiddles === null) {
    console.log("Could not connect to the server or you do not have permission to update a riddle. Make sure the server is running and you are logged in as an admin.");
    return;
  }
  try {
    const riddles = await loadRiddles();
    if (riddles === null) {
      console.log("Could not connect to the server. Please make sure it is running.");
      return;
    }
    if (riddles.length === 0) {
      console.log("No riddles found to update.");
      return;
    }
    let riddle;
    let id;
    while (!riddle) {
      const idStr = question("Enter ID of the riddle to update: ");
      id = Number(idStr);
      if (isNaN(id)) {
        console.log("Invalid ID.");
        continue;
      }
      riddle = riddles.find(r => r.id === id);
      if (!riddle) {
        console.log("Riddle not found.");
      }
    }
    console.log(`Updating riddle ${riddle.name} (ID ${riddle.id})`);
    const name = question(`Name (${riddle.name}): `) || riddle.name;
    const taskDescription = question(`Description (${riddle.taskDescription}): `) || riddle.taskDescription;
    const correctAnswer = question(`Correct Answer (${riddle.correctAnswer}): `) || riddle.correctAnswer;
    const hint = question(`Hint (${riddle.hint || "---"}): `) || riddle.hint;
    let type = question(`Type (${riddle.type}): `) || riddle.type;
    while (!["basic", "multiple"].includes(type)) {
      console.log("Invalid type. Please enter 'basic' or 'multiple'.");
      type = question("Type (basic/multiple): ");
    }
    let difficulty = question(`Difficulty (${riddle.difficulty}): `) || riddle.difficulty;
    while (!["easy", "medium", "hard"].includes(difficulty)) {
      console.log("Invalid difficulty. Please enter 'easy', 'medium', or 'hard'.");
      difficulty = question("Difficulty (easy/medium/hard): ");
    }
    let choices = riddle.choices || [];
    if (type === "multiple") {
      console.log(`Current choices: ${choices.join(", ")}`);
      const choicesInput = question("Enter new choices (comma separated) or leave blank to keep: ");
      if (choicesInput.trim()) {
        choices = choicesInput.split(",").map(choice => choice.trim());
        if (!choices.includes(correctAnswer)) {
          choices.push(correctAnswer);
        }
      }
    } else {
      choices = [];
    }
    const updatedRiddle = { name, taskDescription, correctAnswer, hint, type, difficulty };
    if (choices.length > 0) updatedRiddle.choices = choices;
    const updated = await updateRiddleOnServer(id, updatedRiddle);
    console.log("Riddle updated:", updated);
  } catch (error) {
    console.error("Failed to update riddle:", error.message);
  }
}

export async function deleteRiddle() {
  const testRiddles = await loadRiddles();
  if (testRiddles === null) {
    console.log("Could not connect to the server or you do not have permission to delete a riddle. Make sure the server is running and you are logged in as an admin.");
    return;
  }
  try {
    const riddles = await loadRiddles();
    if (riddles === null) {
      console.log("Could not connect to the server. Please make sure it is running.");
      return;
    }
    if (riddles.length === 0) {
      console.log("No riddles found to delete.");
      return;
    }
    let id;
    let riddle;
    while (!riddle) {
      const idStr = question("Enter ID of the riddle to delete: ");
      id = Number(idStr);
      if (isNaN(id)) {
        console.log("Invalid ID. Please enter a number.");
        continue;
      }
      riddle = riddles.find(r => r.id === id);
      if (!riddle) {
        console.log("No riddle found with that ID. Try again.");
      }
    }
    await deleteRiddleOnServer(id);
    console.log("Riddle deleted successfully.");
  } catch (error) {
    console.error("Failed to delete riddle:", error.message);
  }
}