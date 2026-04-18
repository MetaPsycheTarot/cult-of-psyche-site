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

// Special case mappings for cards with custom suffixes in the image keys
const MAJOR_ARCANA_ALIASES: Record<string, string> = {
  "psyche-awakens": "psyche-awakens",
  "oracle-feed": "oracle-feed",
  "panel-mirrors": "panel-mirrors",
  "moderation-sigil": "moderation-sigil",
  "troll-king": "troll-king",
  "sacred-stream": "sacred-stream",
  "lovers-chat": "lovers-chat",
  "chariot-stream": "chariot-stream",
  "strength-silence": "strength-silence",
  "hermit-code": "hermit-code",
  "wheel-fate": "wheel-fate",
  "justice-algorithm": "justice-algorithm",
  "hanged-man": "hanged-viewer",
  "death-refresh": "death-refresh",
  "temperance-balance": "temperance-balance",
  "tower-crash": "tower-crash",
  "star-signal": "star-signal",
  "moon-glitch": "moon-glitch",
  "sun-broadcast": "sun-broadcast",
  "judgement-call": "judgement-call",
  "gate-of-login": "gate-of-login",
  "lanore-guardian-cat": "lanore-guardian-cat",
  "trix-the-tricklight": "trix-the-tricklight",
  "lola-of-soft-judgment": "lola-of-soft-judgment",
  "rudy-the-wander-signal": "rudy-the-wander-signal",
  "marbles-of-chaos-play": "marbles-of-chaos-play",
  "cult-of-psyche": "cult-of-psyche",
  "chat-flood": "chat-flood",
  "false-accuser": "false-accuser",
  "broken-clip": "broken-clip",
  "viral-spark": "viral-spark",
  "archive-door": "archive-door",
  "tarot-mirror": "tarot-mirror",
  "occult-algorithm": "occult-algorithm",
  "streamed-awakening": "streamed-awakening",
  "crown-of-quiet-knowing": "crown-of-quiet-knowing",
  "world-loop": "world-loop",
  "fool-stream": "fool-stream",
  "the-chariot": "chariot-stream",
  "the-strength": "strength-silence",
  "the-hermit": "hermit-code",
  "the-wheel-of-fortune": "wheel-fate",
  "the-justice": "justice-algorithm",
  "the-hanged-man": "hanged-viewer",
  "the-death": "death-refresh",
  "the-temperance": "temperance-balance",
  "the-tower": "tower-crash",
  "the-star": "star-signal",
  "the-moon": "moon-glitch",
  "the-sun": "sun-broadcast",
  "the-judgement": "judgement-call",
  "the-world": "world-loop",
  "the-fool": "fool-stream",
  "the-lovers": "lovers-chat",
  "the-magician": "oracle-feed",
  "the-high-priestess": "panel-mirrors",
  "the-empress": "moderation-sigil",
  "the-emperor": "troll-king",
  "the-hierophant": "sacred-stream",
  "the-devil": "false-accuser",
  "the-hermitage": "hermit-code",
  "strength": "strength-silence",
  "hermit": "hermit-code",
  "wheel": "wheel-fate",
  "justice": "justice-algorithm",
  "hanged": "hanged-viewer",
  "death": "death-refresh",
  "temperance": "temperance-balance",
  "tower": "tower-crash",
  "star": "star-signal",
  "moon": "moon-glitch",
  "sun": "sun-broadcast",
  "judgement": "judgement-call",
  "world": "world-loop",
  "fool": "fool-stream",
  "lovers": "lovers-chat",
  "chariot": "chariot-stream",
  "magician": "oracle-feed",
  "high-priestess": "panel-mirrors",
  "empress": "moderation-sigil",
  "emperor": "troll-king",
  "hierophant": "sacred-stream",
  "devil": "false-accuser",
};

export function cardNameToImageKey(cardName: string, suit?: string): string {
  // Remove "The " prefix if present
  let key = cardName.replace(/^The\s+/i, "");
  
  // Remove "of [Suit]" ONLY for numbered cards (e.g., "Ace of Wands" -> "Ace")
  // Only match if it's one of the four suits: Wands, Cups, Swords, Pentacles
  key = key.replace(/\s+of\s+(wands|cups|swords|pentacles)/i, "");
  
  // Remove all special characters except spaces and hyphens
  key = key.replace(/[,!?;:'"]/g, "");
  
  // Clean up multiple consecutive spaces
  key = key.replace(/\s+/g, " ").trim();
  
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
  
  // For major arcana, check if there's an alias mapping
  if (suit === "major" || !suit) {
    const aliasKey = MAJOR_ARCANA_ALIASES[key];
    if (aliasKey) {
      return aliasKey;
    }
  }
  
  return key;
}
