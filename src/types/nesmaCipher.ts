export type CipherWorldId = 'garden_of_beginnings' | 'library_of_secrets' | 'cave_of_reflection';

export type CipherPuzzleType =
  | 'image_puzzle'
  | 'letters_box'
  | 'sentence_order'
  | 'maze'
  | 'pattern_match'
  | 'emotion_sorting'
  | 'riddle'
  | 'dial_cipher'
  | 'breathing_flow'
  | 'synthesis';

export interface CompanionDialogue {
  intro: string;
  hint: string;
  celebration: string;
}

export interface NesmaCipherStage {
  id: number;
  stageNumber: number;
  worldId: CipherWorldId;
  worldNameAr: string;
  titleAr: string;
  subtitleAr: string;
  puzzleType: CipherPuzzleType;
  icon: string;
  narrativeIntroAr: string;
  narrativeOutroAr: string;
  companionDialogue: CompanionDialogue;
  psychologicalConceptAr: string;
  scientificReferenceAr: string;
  quotePartAr: string;
  quoteId: number;
  puzzleConfig: Record<string, any>;
  unlockedEnvironmentEffect: string;
}

export interface PsychologicalQuote {
  id: number;
  worldId: CipherWorldId;
  fullQuoteAr: string;
  domainAr: string;
  scientificFramework: 'CBT' | 'ACT' | 'EmotionalRegulation' | 'Boundaries' | 'SelfCompassion';
  authorOrSchoolAr: string;
  practicalReflectionAr: string;
  targetStageIds: number[];
}

export interface WorldSecretOption {
  id: string;
  labelAr: string;
  symbol: string;
  isCorrect: boolean;
}

export type SecretPuzzleType = 'order_marks' | 'connect_parchment' | 'sequence_pattern';

export interface WorldSecret {
  id: string;
  worldId: CipherWorldId;
  worldNameAr: string;
  titleAr: string;
  icon: string;
  badgeSymbol: string;
  discoveryConditionAr: string;
  minCompletedStages: number;
  clueHintAr: string;
  puzzleType: SecretPuzzleType;
  interactiveChallenge: {
    promptAr: string;
    descriptionAr: string;
    hintAr: string;
    // For Garden: order 2 marks
    marksToOrder?: { id: string; labelAr: string; symbol: string }[];
    correctOrderIds?: string[];
    // For Library: connect 2 parchment pieces
    parchmentLeadAr?: string;
    fragmentsToConnect?: { id: string; textAr: string; symbol: string; isCorrect: boolean }[];
    // For Cave: sequence of pattern symbols
    patternSymbols?: { id: string; nameAr: string; symbol: string; originWorldAr: string }[];
    correctSequenceIds?: string[];
    options?: WorldSecretOption[];
    correctExplanationAr: string;
  };
  relicNameAr: string;
  relicIcon: string;
  narrativeRevelationAr: string;
  practicalWisdomAr: string;
}

export interface GrandSecretThread {
  id: string;
  secretId: string;
  worldNameAr: string;
  relicNameAr: string;
  symbol: string;
  truthCoreAr: string;
  revelationAr: string;
}

export interface GrandSecretData {
  id: string;
  titleAr: string;
  subtitleAr: string;
  icon: string;
  badgeSymbol: string;
  threads: GrandSecretThread[];
  weavingChallenge: {
    promptAr: string;
    descriptionAr: string;
    deductionQuestionAr: string;
    options: {
      id: string;
      textAr: string;
      isCorrect: boolean;
      feedbackAr: string;
    }[];
  };
  unifiedRevelationAr: string;
  grandCovenantAr: string;
  relicNameAr: string;
  relicIcon: string;
}

export interface CipherProgress {
  completedLevels: number[];
  currentLevel: number;
  score: number;
  stars: Record<number, number>;
  discoveredQuotes: number[];
  gardenItems: string[];
  discoveredSecrets: string[];
  unlockedGrandSecret?: boolean;
  grandSecretUnlockedAt?: number;
  lastPlayedTimestamp: number;
}
