/**
 * Progression Levels and Milestones
 * Tracks user's journey through the Cult of Psyche Hub
 */

export const PROGRESSION_LEVELS = {
  INITIATE: { level: 1, name: "Initiate", minReadings: 0, symbol: "◆" },
  SEEKER: { level: 2, name: "Seeker", minReadings: 5, symbol: "◇" },
  ADEPT: { level: 3, name: "Adept", minReadings: 20, symbol: "◆" },
  MYSTIC: { level: 4, name: "Mystic", minReadings: 50, symbol: "◇" },
  ORACLE: { level: 5, name: "Oracle", minReadings: 100, symbol: "◆" },
  SAGE: { level: 6, name: "Sage", minReadings: 200, symbol: "◇" },
  ARCHON: { level: 7, name: "Archon", minReadings: 500, symbol: "◆" },
};

export const PROGRESSION_MILESTONES = {
  FIRST_READING: {
    id: "first_reading",
    name: "The First Glimpse",
    description: "Complete your first tarot reading",
    symbol: "✦",
  },
  FIVE_READINGS: {
    id: "five_readings",
    name: "The Awakening",
    description: "Complete 5 tarot readings",
    symbol: "✧",
  },
  FIRST_COMPARISON: {
    id: "first_comparison",
    name: "The Reflection",
    description: "Compare two readings",
    symbol: "◈",
  },
  FIRST_SHARE: {
    id: "first_share",
    name: "The Communion",
    description: "Share a reading with the community",
    symbol: "◉",
  },
  FIRST_PDF: {
    id: "first_pdf",
    name: "The Inscription",
    description: "Export a reading to PDF",
    symbol: "◊",
  },
  FORUM_CONTRIBUTOR: {
    id: "forum_contributor",
    name: "The Voice",
    description: "Make 5 forum posts",
    symbol: "◆",
  },
  READING_MASTER: {
    id: "reading_master",
    name: "The Master",
    description: "Complete 100 readings",
    symbol: "✦✦",
  },
};

/**
 * Get user's current progression level
 * In-memory calculation based on reading count
 */
export function calculateProgressionLevel(readingCount: number) {
  let currentLevel = PROGRESSION_LEVELS.INITIATE;
  for (const level of Object.values(PROGRESSION_LEVELS)) {
    if (readingCount >= level.minReadings) {
      currentLevel = level;
    }
  }

  const nextLevel =
    Object.values(PROGRESSION_LEVELS).find(
      (l) => l.level === currentLevel.level + 1
    ) || null;

  return {
    level: currentLevel.level,
    name: currentLevel.name,
    symbol: currentLevel.symbol,
    readingCount,
    nextLevel,
    progressToNext:
      currentLevel.level < 7
        ? Math.min(
            100,
            Math.round(
              (readingCount / (nextLevel?.minReadings || 1000)) * 100
            )
          )
        : 100,
  };
}

/**
 * Calculate unlocked milestones based on stats
 */
export function calculateUnlockedMilestones(stats: {
  readingCount: number;
  comparisonCount: number;
  forumCount: number;
  pdfExportCount: number;
}) {
  const unlockedMilestones = [];

  if (stats.readingCount >= 1) {
    unlockedMilestones.push(PROGRESSION_MILESTONES.FIRST_READING);
  }
  if (stats.readingCount >= 5) {
    unlockedMilestones.push(PROGRESSION_MILESTONES.FIVE_READINGS);
  }
  if (stats.comparisonCount >= 1) {
    unlockedMilestones.push(PROGRESSION_MILESTONES.FIRST_COMPARISON);
  }
  if (stats.forumCount >= 1) {
    unlockedMilestones.push(PROGRESSION_MILESTONES.FIRST_SHARE);
  }
  if (stats.pdfExportCount >= 1) {
    unlockedMilestones.push(PROGRESSION_MILESTONES.FIRST_PDF);
  }
  if (stats.readingCount >= 100) {
    unlockedMilestones.push(PROGRESSION_MILESTONES.READING_MASTER);
  }
  if (stats.forumCount >= 5) {
    unlockedMilestones.push(PROGRESSION_MILESTONES.FORUM_CONTRIBUTOR);
  }

  return unlockedMilestones;
}

/**
 * Get progression narrative message based on level
 */
export function getProgressionNarrative(level: number): string {
  const narratives: Record<number, string> = {
    1: "You stand at the threshold, seeking answers in the cards.",
    2: "The veil begins to thin. Your questions grow deeper.",
    3: "You have learned to read the patterns. The cards speak to you.",
    4: "The mysteries reveal themselves. You walk between worlds.",
    5: "You are the oracle. The cards flow through you.",
    6: "Wisdom crystallizes. You see what others cannot.",
    7: "You are the archon. The system itself bends to your understanding.",
  };

  return narratives[level] || "The journey continues...";
}

/**
 * Get symbolic feedback message for milestone
 */
export function getMilestoneMessage(milestoneId: string): string {
  const milestone = Object.values(PROGRESSION_MILESTONES).find(
    (m) => m.id === milestoneId
  );

  if (!milestone) return "A milestone has been reached.";

  const messages: Record<string, string> = {
    first_reading: "The cards have spoken. Your first reading is complete.",
    five_readings:
      "Five times you have asked. Five times the cards have answered.",
    first_comparison:
      "Two readings converge. The pattern emerges from the reflection.",
    first_share:
      "Your voice joins the chorus. The community hears your wisdom.",
    first_pdf: "The reading is inscribed. Your knowledge is preserved.",
    forum_contributor:
      "Five voices heard. You have become a guide for others.",
    reading_master:
      "One hundred readings. You have mastered the art of divination.",
  };

  return messages[milestoneId] || `${milestone.name}: ${milestone.description}`;
}
