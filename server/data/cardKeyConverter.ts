/**
 * Convert card names to image keys for lookup in tarotCardImages mapping
 * 
 * Examples:
 * - "The Psyche Awakens" -> "psyche-awakens"
 * - "The Oracle Feed" -> "oracle-feed"
 * - "Ace of Wands" (suit: wands) -> "wands-ace"
 * - "Two of Cups" (suit: cups) -> "cups-two"
 * - "The Lovers" (suit: major) -> "lovers-chat"
 */

export function cardNameToImageKey(cardName: string, suit?: string): string {
  // Remove "The " prefix if present
  let key = cardName.replace(/^The\s+/i, "");
  
  // Remove "of [Suit]" for numbered cards (e.g., "Ace of Wands" -> "Ace")
  key = key.replace(/\s+of\s+\w+/i, "");
  
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
    // Check if the key matches a number word exactly
    if (numberMap[key]) {
      return `${suit}-${key}`;
    }
    // Otherwise, try suit-key format
    return `${suit}-${key}`;
  }
  
  return key;
}
