import { TAROT_DECK } from './server/data/tarotDeck.ts';
import { tarotCardImages } from './server/data/tarotCardImages.ts';
import { cardNameToImageKey } from './server/data/cardKeyConverter.ts';

console.log('Checking for missing image URLs...\n');

const missing = [];
TAROT_DECK.forEach((card) => {
  const key = cardNameToImageKey(card.name, card.suit);
  const imageUrl = tarotCardImages[key];
  
  if (!imageUrl) {
    missing.push({
      name: card.name,
      suit: card.suit,
      generatedKey: key,
      availableKeys: Object.keys(tarotCardImages).filter(k => k.includes(card.suit))
    });
  }
});

if (missing.length > 0) {
  console.log(`❌ Found ${missing.length} cards with missing images:\n`);
  missing.forEach(m => {
    console.log(`Card: "${m.name}" (${m.suit})`);
    console.log(`  Generated key: "${m.generatedKey}"`);
    console.log(`  Available ${m.suit} keys: ${m.availableKeys.slice(0, 3).join(', ')}...`);
    console.log();
  });
} else {
  console.log('✅ All cards have image URLs!');
}
