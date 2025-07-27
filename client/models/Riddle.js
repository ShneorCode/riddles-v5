import { question } from "readline-sync";

class Riddle {
  constructor({ id, type, difficulty, name, taskDescription, correctAnswer, hint }) {
    this.id = id;
    this.type = type;
    this.difficulty = difficulty;
    this.name = name;
    this.taskDescription = taskDescription;
    this.correctAnswer = correctAnswer;
    this.hint = hint || "Sorry. There is no hint for this question.";
  }
  ask() {
    console.log(`\nRiddle ${this.id} - ${this.name} (${this.difficulty}):\n`);
    while (true) {
      const answer = question(`${this.taskDescription} (Type 'hint' for a hint): `);
      if (answer === "hint") {
        console.log(`Hint: ${this.hint}`);
        continue;
      }
      if (answer.trim().toLowerCase() === this.correctAnswer.trim().toLowerCase()) {
        console.log("Correct!");
        break;
      } else {
        console.log("Wrong. Try again.");
      }
    }
  }
}

class MultipleChoiceRiddle extends Riddle {
  constructor({ id, type, difficulty, name, taskDescription, correctAnswer, choices, hint }) {
    super({ id, type, difficulty, name, taskDescription, correctAnswer, hint });
    this.choices = choices || [];
  }
  ask() {
    console.log(`\nRiddle ${this.id} - ${this.name} (${this.difficulty}):\n`);
    let answeredCorrectly = false;
    while (!answeredCorrectly) {
      console.log(`${this.taskDescription}\n`);
      this.choices.forEach((choice, index) => {
        console.log(`${index + 1}. ${choice}`);
      });
      const input = question("Your choice (or type 'hint'): ");
      if (input === "hint") {
        console.log(`Hint: ${this.hint}`);
        continue;
      }
      const index = Number(input) - 1;
      if (isNaN(index) || index < 0 || index >= this.choices.length) {
        console.log("Invalid choice. Please enter a valid number.\n");
        continue;
      }
      if (this.choices[index] === this.correctAnswer) {
        console.log("Correct!");
        answeredCorrectly = true;
      } else {
        console.log("Wrong. Try again.\n");
      }
    }
  }
}

export { Riddle, MultipleChoiceRiddle };
