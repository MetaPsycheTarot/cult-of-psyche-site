import { cardNameToImageKey } from './server/data/cardKeyConverter.ts';

// Test a few card names
const testCards = [
  { name: "The Psyche Awakens", suit: "major" },
  { name: "The Oracle Feed", suit: "major" },
  { name: "The Gate of Login", suit: "major" },
  { name: "Lanore, Guardian Cat", suit: "major" },
  { name: "Trix the Tricklight", suit: "major" },
  { name: "Lola of Soft Judgment", suit: "major" },
  { name: "Rudy the Wander Signal", suit: "major" },
  { name: "Marbles of Chaos Play", suit: "major" },
  { name: "The Cult of Psyche", suit: "major" },
  { name: "Chat Flood", suit: "major" },
];

testCards.forEach(card => {
  const key = cardNameToImageKey(card.name, card.suit);
  console.log(`"${card.name}" -> "${key}"`);
});
