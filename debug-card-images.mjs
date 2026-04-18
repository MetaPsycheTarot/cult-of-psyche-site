import { TAROT_DECK } from './server/data/tarotDeck.ts';
import { tarotCardImages } from './server/data/tarotCardImages.ts';
import { cardNameToImageKey } from './server/data/cardKeyConverter.ts';

console.log('Checking card image mappings...\n');

let missingCount = 0;
TAROT_DECK.forEach((card) => {
  const key = cardNameToImageKey(card.name, card.suit);
  const imageUrl = tarotCardImages[key];
  
  if (!imageUrl) {
    console.log(`❌ MISSING: "${card.name}" (${card.suit}) -> key: "${key}"`);
    missingCount++;
  }
});

console.log(`\n✅ Total cards: ${TAROT_DECK.length}`);
console.log(`❌ Missing images: ${missingCount}`);
console.log(`✅ With images: ${TAROT_DECK.length - missingCount}`);
