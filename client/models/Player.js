export default class Player {
  constructor(name) {
    this.name = name;
    this.times = {};
  }
  recordTime(difficulty, time) {
    if (this.times[difficulty] === undefined) {
      this.times[difficulty] = 0;
    }
    this.times[difficulty] += time;
  }
  getTotalTime() {
    return Object.values(this.times).reduce((a, b) => a + b, 0);
  }
  showStats(totalQuestionsCount) {
    const total = this.getTotalTime();
    const avgPerQuestion = total / totalQuestionsCount;
    console.log(`\nGreat job, ${this.name}!`);
    console.log(`Total time: ${total.toFixed(1)} seconds`);
    console.log(`Average time per question: ${avgPerQuestion.toFixed(1)} seconds`);
  }
}