import { cardNameToImageKey } from './server/data/cardKeyConverter.ts';
import { tarotCardImages } from './server/data/tarotCardImages.ts';

const testCards = [
  { name: "The Psyche Awakens", suit: "major" },
  { name: "The Oracle Feed", suit: "major" },
  { name: "Lanore, Guardian Cat", suit: "major" },
  { name: "Ace of Wands", suit: "wands" },
  { name: "Two of Cups", suit: "cups" },
];

testCards.forEach(card => {
  const key = cardNameToImageKey(card.name, card.suit);
  const url = tarotCardImages[key];
  console.log(`${card.name} (${card.suit}) -> ${key} -> ${url ? 'FOUND' : 'NOT FOUND'}`);
});
