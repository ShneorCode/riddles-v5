import { loadPlayers } from './playerService.js';

export async function showLeaderboard(difficulty = "all") {
  const players = await loadPlayers();
  if (players === -1) {
    console.log("Could not connect to the server. Please make sure it is running.");
    return;
  }
  if (players.length === 0) {
    console.log("\nNo player data yet. Play a game to create one!\n");
    return;
  }

  let filteredPlayers = players;
  if (difficulty === "all") {
    filteredPlayers = players.filter(player =>
      player.times && player.times.easy !== undefined && player.times.medium !== undefined && player.times.hard !== undefined
    );
    if (filteredPlayers.length === 0) {
      console.log("\nNo players have completed all difficulty levels yet. Try playing an 'All' game!\n");
      return;
    }
  } else {
    filteredPlayers = players.filter(player => player.times && player.times[difficulty] !== undefined);
  }

  filteredPlayers.sort((a, b) => {
    let timeA = difficulty === "all"
      ? Object.values(a.times).reduce((sum, cur) => sum + cur, 0)
      : a.times[difficulty];
    let timeB = difficulty === "all"
      ? Object.values(b.times).reduce((sum, cur) => sum + cur, 0)
      : b.times[difficulty];
    return timeA - timeB;
  });

  console.log("\n" + "============================");
  console.log(`  Leaderboard - ${difficulty}  `);
  console.log("============================" + "\n");

  if (filteredPlayers.length === 0) {
    console.log("No times recorded for this difficulty yet.\n");
    return;
  }

  filteredPlayers.forEach((player, i) => {
    let time = difficulty === "all"
      ? Object.values(player.times).reduce((sum, cur) => sum + cur, 0)
      : player.times[difficulty];
    console.log(`  ${i + 1}. ${player.name.padEnd(15)} - ${time.toFixed(1)} sec`);
  });
  console.log("\n" + "============================" + "\n");
}