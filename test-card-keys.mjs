import { TAROT_DECK } from './server/data/tarotDeck.ts';
import { tarotCardImages } from './server/data/tarotCardImages.ts';
import { cardNameToImageKey } from './server/data/cardKeyConverter.ts';

const allKeys = Object.keys(tarotCardImages);
console.log(`Total image keys available: ${allKeys.length}\n`);

const missing = [];
TAROT_DECK.forEach((card) => {
  const key = cardNameToImageKey(card.name, card.suit);
  const hasImage = allKeys.includes(key);
  
  if (!hasImage) {
    missing.push({
      cardName: card.name,
      suit: card.suit,
      generatedKey: key
    });
  }
});

if (missing.length === 0) {
  console.log('✅ All cards have matching image keys!');
} else {
  console.log(`❌ ${missing.length} cards missing images:\n`);
  missing.forEach(m => {
    console.log(`"${m.cardName}" (${m.suit}) -> "${m.generatedKey}"`);
  });
}
