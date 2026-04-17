/**
 * Complete 78-card Cult of Psyche Tarot Deck
 * Integrated with show lore, community dynamics, and occult framing
 */

export interface TarotCard {
  id: number;
  name: string;
  suit: "major" | "wands" | "cups" | "swords" | "pentacles";
  number: number; // 0-21 for major, 1-14 for suits
  meaning: string;
  interpretation: string;
  imageUrl?: string;
}

export const TAROT_DECK: TarotCard[] = [
  // MAJOR ARCANA (0-21)
  {
    id: 1,
    name: "The Psyche Awakens",
    suit: "major",
    number: 0,
    meaning: "Host at the center of a shifting digital oracle, YouTube lights flickering like stars",
    interpretation:
      "A new beginning or awakening to your true purpose. The Psyche Awakens signals a moment of clarity where you step into your power as creator and guide. This is the start of a journey into deeper self-knowledge and spiritual authority.",
  },
  {
    id: 2,
    name: "The Oracle Feed",
    suit: "major",
    number: 1,
    meaning: "Endless scrolling truth and noise blending into prophecy",
    interpretation:
      "Information overload masking deeper wisdom. The Oracle Feed reminds you that truth hides within the chaos of modern communication. Seek signal within the noise; the answers you seek are there, but require discernment.",
  },
  {
    id: 3,
    name: "The Panel of Mirrors",
    suit: "major",
    number: 2,
    meaning: "Guests reflect hidden identities back at each other",
    interpretation:
      "Duality and reflection. Others mirror aspects of yourself you may not see. This card speaks to the power of dialogue, collaboration, and the wisdom found in diverse perspectives. Pay attention to what others reveal about you.",
  },
  {
    id: 4,
    name: "The Moderation Sigil",
    suit: "major",
    number: 3,
    meaning: "Invisible hand removing chaos from chat",
    interpretation:
      "Hidden order and necessary boundaries. The Moderation Sigil represents the unseen structures that hold chaos at bay. Sometimes what appears to be control is actually protection. Trust the invisible forces working in your favor.",
  },
  {
    id: 5,
    name: "The Troll King",
    suit: "major",
    number: 4,
    meaning: "Disruption disguised as curiosity, laughing from the shadows",
    interpretation:
      "Challenge and shadow self. The Troll King embodies the part of you that questions authority and breaks rules. This energy can be destructive or transformative—it depends on how you channel it. Don't dismiss this power; redirect it.",
  },
  {
    id: 6,
    name: "The Sacred Stream",
    suit: "major",
    number: 5,
    meaning: "Live broadcast as ritual space",
    interpretation:
      "Connection and communion. The Sacred Stream represents the power of real-time presence and shared experience. When you broadcast, you're performing a ritual. Honor the sacred space you create with your audience.",
  },
  {
    id: 7,
    name: "The Gate of Login",
    suit: "major",
    number: 6,
    meaning: "Entry point to the cult, passwords as spells",
    interpretation:
      "Initiation and access. The Gate of Login marks a threshold between the public and the inner circle. Passwords are spells; membership is initiation. This card speaks to the power of exclusive knowledge and chosen community.",
  },
  {
    id: 8,
    name: "Lanore, Guardian Cat",
    suit: "major",
    number: 7,
    meaning: "Silent watcher of timelines and unseen energies",
    interpretation:
      "Quiet wisdom and hidden observation. Lanore sees what others miss. This card reminds you that the most powerful knowledge often comes silently, from the margins. Trust your intuition about what's really happening beneath the surface.",
  },
  {
    id: 9,
    name: "Trix the Tricklight",
    suit: "major",
    number: 8,
    meaning: "Unpredictable intuition, sudden clarity bursts",
    interpretation:
      "Sudden insight and playful disruption. Trix brings unexpected clarity through chaos. This card suggests that breakthroughs often come when you stop forcing answers and allow randomness to guide you.",
  },
  {
    id: 10,
    name: "Lola of Soft Judgment",
    suit: "major",
    number: 9,
    meaning: "Emotional intelligence wrapped in fur and silence",
    interpretation:
      "Compassionate discernment. Lola judges without harshness, sees without condemning. This card calls you to develop emotional wisdom and to hold space for others without losing your own boundaries.",
  },
  {
    id: 11,
    name: "Rudy the Wander Signal",
    suit: "major",
    number: 10,
    meaning: "Lost thoughts returning mid-stream",
    interpretation:
      "Completion and return. What was lost finds its way back. Rudy represents the cyclical nature of thought and the way ideas return when you least expect them. Trust the process of wandering and returning.",
  },
  {
    id: 12,
    name: "Marbles of Chaos Play",
    suit: "major",
    number: 11,
    meaning: "Randomness that accidentally reveals truth",
    interpretation:
      "Chance and hidden order. What appears random often contains profound meaning. This card suggests that surrender to chaos can reveal truths that logic alone cannot access.",
  },
  {
    id: 13,
    name: "The Cult of Psyche",
    suit: "major",
    number: 12,
    meaning: "Community as myth engine and evolving organism",
    interpretation:
      "Collective power and shared mythology. The Cult of Psyche is alive, evolving, and created by all who participate. This card speaks to your role in a larger narrative and the power of community to shape reality.",
  },
  {
    id: 14,
    name: "The Chat Flood",
    suit: "major",
    number: 13,
    meaning: "Overwhelming voices forming a single entity",
    interpretation:
      "Collective voice and overwhelming presence. When many speak at once, a new entity emerges. This card reminds you of the power—and danger—of mob dynamics. Listen to the collective, but maintain your own center.",
  },
  {
    id: 15,
    name: "The False Accuser",
    suit: "major",
    number: 14,
    meaning: "Narrative distortion and online slander storms",
    interpretation:
      "Misinformation and false judgment. The False Accuser represents how easily truth can be twisted online. This card warns of the power of narrative manipulation and calls you to verify before believing.",
  },
  {
    id: 16,
    name: "The Broken Clip",
    suit: "major",
    number: 15,
    meaning: "Moments taken out of context becoming legends",
    interpretation:
      "Fragmentation and recontextualization. A single moment, removed from context, takes on new meaning. This card speaks to the power of editing, framing, and how partial truths become myths.",
  },
  {
    id: 17,
    name: "The Viral Spark",
    suit: "major",
    number: 16,
    meaning: "Sudden attention like lightning in a glass room",
    interpretation:
      "Sudden fame and explosive growth. The Viral Spark strikes without warning. This card suggests rapid expansion, but also caution—viral moments are intense and often brief.",
  },
  {
    id: 18,
    name: "The Archive Door",
    suit: "major",
    number: 17,
    meaning: "Past episodes speaking back to the present",
    interpretation:
      "History and cyclical return. The Archive Door opens to reveal that what was spoken before still echoes. This card reminds you that the past is never truly past; it shapes the present.",
  },
  {
    id: 19,
    name: "The Tarot Mirror",
    suit: "major",
    number: 18,
    meaning: "Cards revealing the reader more than the future",
    interpretation:
      "Self-reflection and projection. The Tarot Mirror shows that divination is ultimately about seeing yourself. What you seek in the cards is often what you already know but haven't admitted.",
  },
  {
    id: 20,
    name: "The Occult Algorithm",
    suit: "major",
    number: 19,
    meaning: "Hidden logic shaping visibility and reach",
    interpretation:
      "Hidden systems and invisible influence. The Occult Algorithm works behind the scenes, determining what rises and what falls. This card speaks to the power of understanding systems and working within them.",
  },
  {
    id: 21,
    name: "The Streamed Awakening",
    suit: "major",
    number: 20,
    meaning: "Realization happening in real time",
    interpretation:
      "Transformation witnessed. The Streamed Awakening is enlightenment broadcast live. This card represents moments where understanding dawns in real time, shared with others as it happens.",
  },
  {
    id: 22,
    name: "The Crown of Quiet Knowing",
    suit: "major",
    number: 21,
    meaning: "Final integration beyond noise",
    interpretation:
      "Completion and integrated wisdom. The Crown of Quiet Knowing represents the end of seeking and the beginning of being. This card speaks to peace found through understanding, silence after the noise.",
  },

  // WANDS (creativity, ignition, chaos of creation)
  {
    id: 23,
    name: "Ace of Wands",
    suit: "wands",
    number: 1,
    meaning: "New show idea igniting like a match in dark studio",
    interpretation: "New creative spark and inspiration. A fresh idea burns bright with potential. This is the moment before execution, pure creative energy waiting to be channeled.",
  },
  {
    id: 24,
    name: "Two of Wands",
    suit: "wands",
    number: 2,
    meaning: "Choosing between formats, timelines, and audience paths",
    interpretation: "Decision and crossroads. You hold power in both hands but must choose which direction to pursue. This card speaks to the weight of creative choice.",
  },
  {
    id: 25,
    name: "Three of Wands",
    suit: "wands",
    number: 3,
    meaning: "Clips traveling beyond your channel into unknown feeds",
    interpretation: "Expansion and reach. Your work travels further than you intended. This card celebrates the moment when your influence spreads beyond your control.",
  },
  {
    id: 26,
    name: "Four of Wands",
    suit: "wands",
    number: 4,
    meaning: "Community milestone stream celebration night",
    interpretation: "Celebration and stability. A moment to acknowledge growth and gather community. This card speaks to earned rest and shared joy.",
  },
  {
    id: 27,
    name: "Five of Wands",
    suit: "wands",
    number: 5,
    meaning: "Chat arguments forming sudden comedy warfare",
    interpretation: "Conflict and creative tension. Arguments in chat become content. This card suggests that conflict can fuel creativity when channeled properly.",
  },
  {
    id: 28,
    name: "Six of Wands",
    suit: "wands",
    number: 6,
    meaning: "Viral moment where even trolls go silent",
    interpretation: "Recognition and victory. A moment so powerful that even critics pause. This card celebrates undeniable success.",
  },
  {
    id: 29,
    name: "Seven of Wands",
    suit: "wands",
    number: 7,
    meaning: "Defending your narrative mid-stream",
    interpretation: "Courage and defense. You stand your ground against opposition. This card speaks to the strength needed to maintain your vision under pressure.",
  },
  {
    id: 30,
    name: "Eight of Wands",
    suit: "wands",
    number: 8,
    meaning: "Rapid-fire uploads, shorts exploding across platforms",
    interpretation: "Speed and momentum. Things move fast now. This card suggests riding the wave of rapid growth and capitalizing on momentum.",
  },
  {
    id: 31,
    name: "Nine of Wands",
    suit: "wands",
    number: 9,
    meaning: "Exhaustion after long live sessions but still standing",
    interpretation: "Resilience and weariness. You're tired but not defeated. This card speaks to the endurance required for sustained creative work.",
  },
  {
    id: 32,
    name: "Ten of Wands",
    suit: "wands",
    number: 10,
    meaning: "Carrying the weight of audience expectations and lore",
    interpretation: "Burden and responsibility. The weight of your creation grows. This card asks: can you carry this, or do you need to set something down?",
  },
  {
    id: 33,
    name: "Page of Wands",
    suit: "wands",
    number: 11,
    meaning: "New guest with chaotic energy and untested beliefs",
    interpretation: "Youth and exploration. Fresh energy enters the space. This card represents new perspectives and untested ideas.",
  },
  {
    id: 34,
    name: "Knight of Wands",
    suit: "wands",
    number: 12,
    meaning: "Impulsive creative decision that somehow works",
    interpretation: "Action and impulse. Sometimes the best decisions come from instinct rather than planning. This card celebrates bold creative moves.",
  },
  {
    id: 35,
    name: "Queen of Wands",
    suit: "wands",
    number: 13,
    meaning: "Charismatic control of the entire broadcast field",
    interpretation: "Confidence and magnetism. You command the space with presence. This card speaks to the power of authentic charisma.",
  },
  {
    id: 36,
    name: "King of Wands",
    suit: "wands",
    number: 14,
    meaning: "Full creative authority over the Cult timeline",
    interpretation: "Mastery and authority. You have earned the right to shape your narrative. This card celebrates creative sovereignty.",
  },

  // CUPS (emotion, audience, connection, psychic flow)
  {
    id: 37,
    name: "Ace of Cups",
    suit: "cups",
    number: 1,
    meaning: "First emotional bond with viewers forming live",
    interpretation: "New emotional connection. A viewer reaches out and truly connects. This card celebrates the moment when audience becomes community.",
  },
  {
    id: 38,
    name: "Two of Cups",
    suit: "cups",
    number: 2,
    meaning: "Unexpected guest connection that changes direction of show",
    interpretation: "Partnership and mutual recognition. Two souls meet and something shifts. This card speaks to the power of genuine connection.",
  },
  {
    id: 39,
    name: "Three of Cups",
    suit: "cups",
    number: 3,
    meaning: "Community laughter, inside jokes, shared chaos",
    interpretation: "Celebration and community. Joy shared multiplies. This card celebrates the bonds formed through shared experience.",
  },
  {
    id: 40,
    name: "Four of Cups",
    suit: "cups",
    number: 4,
    meaning: "Viewer boredom, algorithm fatigue, creative doubt",
    interpretation: "Apathy and stagnation. Something feels off. This card suggests a need to reconnect with your purpose or refresh your approach.",
  },
  {
    id: 41,
    name: "Five of Cups",
    suit: "cups",
    number: 5,
    meaning: "Backlash episode aftermath and emotional recovery",
    interpretation: "Loss and grief. Something broke, and healing is needed. This card acknowledges pain while suggesting that recovery is possible.",
  },
  {
    id: 42,
    name: "Six of Cups",
    suit: "cups",
    number: 6,
    meaning: "Nostalgia clips from early Psyche era resurfacing",
    interpretation: "Nostalgia and innocence. The past calls to you. This card speaks to the power of memory and the longing for simpler times.",
  },
  {
    id: 43,
    name: "Seven of Cups",
    suit: "cups",
    number: 7,
    meaning: "Too many ideas, too many directions, psychic overload",
    interpretation: "Illusion and confusion. Too many choices cloud judgment. This card suggests the need to simplify and focus.",
  },
  {
    id: 44,
    name: "Eight of Cups",
    suit: "cups",
    number: 8,
    meaning: "Stepping away from toxic engagement cycles",
    interpretation: "Departure and moving on. Sometimes you must walk away from what no longer serves. This card speaks to healthy boundaries.",
  },
  {
    id: 45,
    name: "Nine of Cups",
    suit: "cups",
    number: 9,
    meaning: "'This is working' moment mid-stream realization",
    interpretation: "Satisfaction and wish fulfillment. Everything aligns. This card celebrates the moment when you know you're on the right path.",
  },
  {
    id: 46,
    name: "Ten of Cups",
    suit: "cups",
    number: 10,
    meaning: "Full community harmony episode",
    interpretation: "Harmony and family. Perfect alignment of community and purpose. This card celebrates complete emotional fulfillment.",
  },
  {
    id: 47,
    name: "Page of Cups",
    suit: "cups",
    number: 11,
    meaning: "New viewer sending unexpected heartfelt message",
    interpretation: "Innocence and new feeling. A fresh emotional perspective enters. This card reminds you why you do this work.",
  },
  {
    id: 48,
    name: "Knight of Cups",
    suit: "cups",
    number: 12,
    meaning: "Emotionally driven guest confession moment",
    interpretation: "Romance and idealism. Vulnerability becomes strength. This card celebrates the power of emotional honesty.",
  },
  {
    id: 49,
    name: "Queen of Cups",
    suit: "cups",
    number: 13,
    meaning: "Intuitive reading mode, deep empathy channeling",
    interpretation: "Intuition and emotional depth. You read the room with precision. This card speaks to the power of emotional intelligence.",
  },
  {
    id: 50,
    name: "King of Cups",
    suit: "cups",
    number: 14,
    meaning: "Emotional stability during chaos storms",
    interpretation: "Emotional balance and control. You remain centered while others spiral. This card celebrates emotional mastery.",
  },

  // SWORDS (conflict, truth, trolls, discourse, digital warfare)
  {
    id: 51,
    name: "Ace of Swords",
    suit: "swords",
    number: 1,
    meaning: "Sharp truth cutting through misinformation",
    interpretation: "Clarity and breakthrough. Truth emerges with cutting precision. This card celebrates the power of clear communication.",
  },
  {
    id: 52,
    name: "Two of Swords",
    suit: "swords",
    number: 2,
    meaning: "Refusing to engage in chat trap debates",
    interpretation: "Stalemate and detachment. Sometimes the best move is not to play. This card speaks to the wisdom of non-engagement.",
  },
  {
    id: 53,
    name: "Three of Swords",
    suit: "swords",
    number: 3,
    meaning: "Betrayal narrative or community fracture moment",
    interpretation: "Heartbreak and sorrow. Trust is broken. This card acknowledges pain while suggesting that healing follows.",
  },
  {
    id: 54,
    name: "Four of Swords",
    suit: "swords",
    number: 4,
    meaning: "Silence break, rest stream, recovery episode",
    interpretation: "Rest and recovery. Pause before the next battle. This card speaks to the necessity of silence and recuperation.",
  },
  {
    id: 55,
    name: "Five of Swords",
    suit: "swords",
    number: 5,
    meaning: "Troll victory energy, bait and withdrawal dynamics",
    interpretation: "Defeat and hollow victory. Someone won, but at what cost? This card suggests that some battles aren't worth fighting.",
  },
  {
    id: 56,
    name: "Six of Swords",
    suit: "swords",
    number: 6,
    meaning: "Moving channel tone into calmer territory",
    interpretation: "Transition and moving forward. You leave conflict behind. This card celebrates the journey toward peace.",
  },
  {
    id: 57,
    name: "Seven of Swords",
    suit: "swords",
    number: 7,
    meaning: "Sock puppet accounts and hidden agendas",
    interpretation: "Betrayal and deception. Not everything is as it seems. This card warns of hidden agendas and false identities.",
  },
  {
    id: 58,
    name: "Eight of Swords",
    suit: "swords",
    number: 8,
    meaning: "Feeling trapped by audience expectations",
    interpretation: "Restriction and bondage. You feel caged by external demands. This card suggests that freedom is possible if you choose it.",
  },
  {
    id: 59,
    name: "Nine of Swords",
    suit: "swords",
    number: 9,
    meaning: "Late-night anxiety after controversial stream",
    interpretation: "Anxiety and worry. Your mind races with worst-case scenarios. This card suggests that most fears are imagined.",
  },
  {
    id: 60,
    name: "Ten of Swords",
    suit: "swords",
    number: 10,
    meaning: "Cancellation fear or dramatic narrative collapse moment",
    interpretation: "Endings and rock bottom. Everything falls apart. This card suggests that after complete collapse, only rebuilding remains.",
  },
  {
    id: 61,
    name: "Page of Swords",
    suit: "swords",
    number: 11,
    meaning: "New investigative viewer digging through lore",
    interpretation: "Curiosity and investigation. Questions are asked. This card celebrates intellectual engagement.",
  },
  {
    id: 62,
    name: "Knight of Swords",
    suit: "swords",
    number: 12,
    meaning: "Aggressive debunker entering chat",
    interpretation: "Conflict and aggression. Challenge arrives. This card suggests that opposition can sharpen your arguments.",
  },
  {
    id: 63,
    name: "Queen of Swords",
    suit: "swords",
    number: 13,
    meaning: "Clear boundary setting, no emotional distortion",
    interpretation: "Clarity and independence. You speak truth without apology. This card celebrates honest communication.",
  },
  {
    id: 64,
    name: "King of Swords",
    suit: "swords",
    number: 14,
    meaning: "Ultimate moderator energy, decisive truth authority",
    interpretation: "Authority and intellectual power. Your word is law. This card celebrates earned authority through clarity.",
  },

  // PENTACLES (structure, money, platform, growth, material reality)
  {
    id: 65,
    name: "Ace of Pentacles",
    suit: "pentacles",
    number: 1,
    meaning: "First monetized breakthrough or membership spike",
    interpretation: "New opportunity and prosperity. Money flows in. This card celebrates the first real financial success.",
  },
  {
    id: 66,
    name: "Two of Pentacles",
    suit: "pentacles",
    number: 2,
    meaning: "Juggling YouTube, TikTok, and live guests",
    interpretation: "Balance and adaptation. You manage multiple streams. This card speaks to the art of juggling competing demands.",
  },
  {
    id: 67,
    name: "Three of Pentacles",
    suit: "pentacles",
    number: 3,
    meaning: "Collaborative build of Cult ecosystem",
    interpretation: "Teamwork and collaboration. Together you build something lasting. This card celebrates collective creation.",
  },
  {
    id: 68,
    name: "Four of Pentacles",
    suit: "pentacles",
    number: 4,
    meaning: "Holding audience tightly, fear of losing momentum",
    interpretation: "Hoarding and fear. You grip too tightly. This card suggests that release often leads to greater abundance.",
  },
  {
    id: 69,
    name: "Five of Pentacles",
    suit: "pentacles",
    number: 5,
    meaning: "Low engagement period, algorithm cold zone",
    interpretation: "Hardship and struggle. Resources are scarce. This card suggests that this too shall pass.",
  },
  {
    id: 70,
    name: "Six of Pentacles",
    suit: "pentacles",
    number: 6,
    meaning: "Gifting memberships and community generosity loop",
    interpretation: "Generosity and charity. You give freely. This card celebrates the abundance that comes from giving.",
  },
  {
    id: 71,
    name: "Seven of Pentacles",
    suit: "pentacles",
    number: 7,
    meaning: "Long-term content strategy patience phase",
    interpretation: "Assessment and patience. You tend your garden. This card speaks to the long view and delayed gratification.",
  },
  {
    id: 72,
    name: "Eight of Pentacles",
    suit: "pentacles",
    number: 8,
    meaning: "Refining overlays, OBS setups, production craft",
    interpretation: "Mastery and skill development. You hone your craft. This card celebrates dedication to excellence.",
  },
  {
    id: 73,
    name: "Nine of Pentacles",
    suit: "pentacles",
    number: 9,
    meaning: "Independent creator stability moment",
    interpretation: "Abundance and independence. You stand alone and flourish. This card celebrates earned autonomy.",
  },
  {
    id: 74,
    name: "Ten of Pentacles",
    suit: "pentacles",
    number: 10,
    meaning: "Full Cult infrastructure, sustainable ecosystem",
    interpretation: "Wealth and legacy. You've built something lasting. This card celebrates complete material security.",
  },
  {
    id: 75,
    name: "Page of Pentacles",
    suit: "pentacles",
    number: 11,
    meaning: "New tool, platform, or SaaS experiment",
    interpretation: "Opportunity and learning. A new tool arrives. This card celebrates the excitement of new possibilities.",
  },
  {
    id: 76,
    name: "Knight of Pentacles",
    suit: "pentacles",
    number: 12,
    meaning: "Slow disciplined grind of daily streaming",
    interpretation: "Diligence and responsibility. Steady work builds empire. This card celebrates the unglamorous work of consistency.",
  },
  {
    id: 77,
    name: "Queen of Pentacles",
    suit: "pentacles",
    number: 13,
    meaning: "Nurturing community while managing growth systems",
    interpretation: "Nurturing and practicality. You care for what you've built. This card celebrates the balance of growth and care.",
  },
  {
    id: 78,
    name: "King of Pentacles",
    suit: "pentacles",
    number: 14,
    meaning: "Full monetized authority, stable creator empire",
    interpretation: "Wealth and authority. You've built an empire. This card celebrates complete material mastery.",
  },
];

export function getTarotCardById(id: number): TarotCard | undefined {
  return TAROT_DECK.find((card) => card.id === id);
}

export function getTarotCardsBySuit(suit: TarotCard["suit"]): TarotCard[] {
  return TAROT_DECK.filter((card) => card.suit === suit);
}

export function getRandomTarotCard(): TarotCard {
  return TAROT_DECK[Math.floor(Math.random() * TAROT_DECK.length)]!;
}

export function getRandomTarotCards(count: number): TarotCard[] {
  const cards: TarotCard[] = [];
  const availableCards = [...TAROT_DECK];

  for (let i = 0; i < count && availableCards.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * availableCards.length);
    cards.push(availableCards[randomIndex]!);
    availableCards.splice(randomIndex, 1);
  }

  return cards;
}
