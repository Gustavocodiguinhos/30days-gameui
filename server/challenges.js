export const TOTAL_DAYS = 30;

export const challenges = [
  {
    day: 1,
    title: 'Main Menu',
    game: 'Hades',
    type: 'recreate',
    reference: '/references/day-01.jpg',
    tips: ['Emphasize the title hierarchy', 'Show the menu buttons clearly separated from the art']
  },
  {
    day: 2,
    title: 'Health Bar / HUD',
    game: 'Bioshock',
    type: 'recreate',
    reference: '/references/day-02.jpg'
  },
  {
    day: 3,
    title: 'Crafiting Browser',
    game: 'Ruined King: A League of Legends Story',
    type: 'recreate',
    reference: '/references/day-03.jpg'
  },
  {
    day: 4,
    title: 'Load/Save',
    game: 'Hollow Knight Silksong',
    type: 'recreate',
    reference: '/references/day-04.jpg'
  },
  {
    day: 5,
    title: 'Dialogue Box',
    game: 'Death Stranding 2: On the Beach',
    type: 'recreate',
    reference: '/references/day-05.jpg'
  },
  {
    day: 6,
    title: 'Skill Tree',
    game: 'Citizen-Sleeper-2',
    type: 'recreate',
    reference: '/references/day-06.jpg'
  },
  {
    day: 7,
    title: 'Spacecraft HUD',
    game: 'Fictional: deep-space explorer cockpit',
    type: 'scratch',
    tips: ['Invent a ship system (fuel, shields, map)', 'Keep the HUD sci-fi but functional']
  },
  {
    day: 8,
    title: 'Skill Tree',
    game: 'Ghost of Yotei',
    type: 'recreate',
    reference: '/references/day-08.jpg'
  },
  {
    day: 9,
    title: 'Item Shop',
    game: 'Fortnite',
    type: 'recreate',
    reference: '/references/day-09.jpg',
    tips: ['Feature the daily spotlight item', 'Use urgency without clutter']
  },
  {
    day: 10,
    title: 'Character Select',
    game: 'Elden Ring Nightreign',
    type: 'recreate',
    reference: '/references/day-10.jpg'
  },
  {
    day: 11,
    title: 'Stats Screen',
    game: 'Pokémon',
    type: 'recreate',
    reference: '/references/day-11.jpg',
    tips: ['Show bars that scale with values', 'Support comparison and leveling up']
  },
  {
    day: 12,
    title: 'Quest Log',
    game: 'Cyberpunk 2077',
    type: 'recreate',
    reference: '/references/day-12.jpg',
    tips: ['Rank quests by importance', 'Add tracking and rewards per quest']
  },
  {
    day: 13,
    title: 'Choose Loadout',
    game: 'Call of duty',
    type: 'recreate',
    reference: '/references/day-13.jpg'
  },
  {
    day: 14,
    title: 'Fantasy Tavern Shop',
    game: 'Fictional: medieval inn in a fantasy world',
    type: 'scratch',
    tips: ['Create a themed store (ale, food, quests)', 'Warm palette, wooden UI']
  },
  {
    day: 15,
    title: 'Main menu',
    game: 'Legends of Runeterra',
    type: 'recreate',
    reference: '/references/day-15.png'
  },
  {
    day: 16,
    title: 'Codex',
    game: "Assassin's Creed Valhalla",
    type: 'recreate',
    reference: '/references/day-16.jpg'
  },
  {
    day: 17,
    title: 'Buying menu',
    game: 'Astral Chain',
    type: 'recreate',
    reference: '/references/day-17.jpg'
  },
  {
    day: 18,
    title: 'Skill Menu',
    game: "Another Crab's Treasure",
    type: 'recreate',
    reference: '/references/day-18.jpg'
  },
  {
    day: 19,
    title: 'Victory / Level Complete',
    game: 'Candy Crush',
    type: 'recreate',
    reference: '/references/day-19.jpg',
    tips: ['Celebrate with motion and stars', 'Make the rewards unmissable']
  },
  {
    day: 20,
    title: 'Item/Ability selection menu',
    game: 'Persona 4',
    type: 'recreate',
    reference: '/references/day-20.jpg'
  },
  {
    day: 21,
    title: 'Hacking Minigame UI',
    game: 'Fictional: cyberpunk terminal breach',
    type: 'scratch',
    tips: ['Design a sequence/timer minigame', 'Use neon colors, glitch effects']
  },
  {
    day: 22,
    title: 'Tutorial / Controls',
    game: 'Lost Records Bloom & Rage',
    type: 'recreate',
    reference: '/references/day-22.jpg',
    tips: ['Teach one action at a time', 'Reinforce with the game art style']
  },
  {
    day: 23,
    title: 'Pause menu',
    game: 'Persona 3',
    type: 'recreate',
    reference: '/references/day-23.jpg',
    tips: ['Bold art direction', 'Make navigation stylish but clear']
  },
  {
    day: 24,
    title: 'Result Screen',
    game: 'Overwatch 2',
    type: 'recreate',
    reference: '/references/day-24.jpg'
  },
  {
    day: 25,
    title: 'Team Summary',
    game: 'Persona 4',
    type: 'recreate',
    reference: '/references/day-25.jpg'
  },
  {
    day: 26,
    title: 'Pause Menu',
    game: 'Super Mario Wonder',
    type: 'recreate',
    reference: '/references/day-26.jpg',
    tips: ['Show positions clearly', 'Highlight the current player']
  },
  {
    day: 27,
    title: 'Difficulty menu',
    game: 'Borderlands',
    type: 'recreate',
    reference: '/references/day-27.jpg'
  },
  {
    day: 28,
    title: 'Achievement Unlocked',
    game: 'Fictional: simple mobile popup',
    type: 'scratch',
    tips: ['Design a quick toast notification', 'Show icon, name and points']
  },
  {
    day: 29,
    title: 'Farm Shop',
    game: 'Fictional: cozy farming store',
    type: 'scratch',
    tips: ['Seeds, tools and produce catalog', 'Soft colors, rounded UI']
  },
  {
    day: 30,
    title: 'Level Up Screen',
    game: 'Fictional: XP bar + new title',
    type: 'scratch',
    tips: ['Celebrate the milestone', 'Show XP gained and new abilities']
  }
];

export function getChallenge(day) {
  return challenges.find((c) => c.day === day) || null;
}
