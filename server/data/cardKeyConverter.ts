/**
 * Convert card names to image keys for lookup in tarotCardImages mapping
 */

export function cardNameToImageKey(cardName: string, suit?: string): string {
  // Remove "The " prefix if present
  let key = cardName.replace(/^The\s+/i, "");
  
  // Remove commas and other special characters
  key = key.replace(/[,]/g, "");
  
  // Convert to lowercase and replace spaces with hyphens
  key = key.toLowerCase().replace(/\s+/g, "-");
  
  // Handle special cases for numbered cards (e.g., "Ace" -> "ace", "Two" -> "two")
  const numberMap: Record<string, string> = {
    "ace": "ace",
    "two": "two",
    "three": "three",
    "four": "four",
    "five": "five",
    "six": "six",
    "seven": "seven",
    "eight": "eight",
    "nine": "nine",
    "ten": "ten",
    "page": "page",
    "knight": "knight",
    "queen": "queen",
    "king": "king",
  };
  
  // If suit is provided, prepend it (for numbered cards)
  if (suit && suit !== "major") {
    // Check if the key is a number word
    for (const [word, replacement] of Object.entries(numberMap)) {
      if (key.includes(word)) {
        return `${suit}-${replacement}`;
      }
    }
    // Otherwise, try suit-key format
    return `${suit}-${key}`;
  }
  
  return key;
}
