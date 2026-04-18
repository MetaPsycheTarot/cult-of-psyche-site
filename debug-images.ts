import { TAROT_DECK } from './server/data/tarotDeck';
import { tarotCardImages } from './server/data/tarotCardImages';
import { cardNameToImageKey } from './server/data/cardKeyConverter';

console.log('Checking card image mappings...\n');

let missingCount = 0;
const missing: Array<{name: string; suit: string; key: string}> = [];

TAROT_DECK.forEach((card) => {
  const key = cardNameToImageKey(card.name, card.suit);
  const imageUrl = tarotCardImages[key];
  
  if (!imageUrl) {
    console.log(`❌ MISSING: "${card.name}" (${card.suit}) -> key: "${key}"`);
    missing.push({ name: card.name, suit: card.suit, key });
    missingCount++;
  }
});

console.log(`\n✅ Total cards: ${TAROT_DECK.length}`);
console.log(`❌ Missing images: ${missingCount}`);
console.log(`✅ With images: ${TAROT_DECK.length - missingCount}`);

if (missing.length > 0) {
  console.log('\nMissing card details:');
  missing.forEach(m => {
    console.log(`  - ${m.name} (${m.suit}): key="${m.key}"`);
  });
}
