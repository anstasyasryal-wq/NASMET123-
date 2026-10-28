export type AppView =
  | 'home'
  | 'stage_player'
  | 'competitions_hub'
  | 'leaderboard'
  | 'dioceses'
  | 'supervisor'
  | 'final_ceremony'
  | 'participants'
  | 'spiritual_life'
  | 'biblical_study'
  | 'personal_space'
  | 'library'
  | 'workshops'
  | 'creative_lab'
  | 'study_tools'
  | 'monastic_oasis'
  | 'spiritual_games'
  | 'collective_challenges'
  | 'spiritual_calendar'
  | 'spiritual_father'
  | 'consecrated_manual'
  | 'saints_stickers'
  | 'prayer_fortress'
  | 'virtue_jar'
  | 'monastic_puzzle'
  | 'hesychia_path';

export type UserRole = 'participant' | 'supervisor' | 'guest';

export type ConsecrationVocation = 'كاهن' | 'مكرسة' | 'راهب' | 'راهبة';

export interface User {
  id: string;
  name: string;
  email?: string;
  vocation: ConsecrationVocation;
  consecrationRank?: string;
  diocese: string;
  totalScore: number;
  currentStageId: number;
  role: UserRole;
  completedStages: number[];
  stageScores: Record<number, number>;
  createdAt?: string;
  avatarIcon?: string;
}

export type QuestionType = 'multiple_choice' | 'true_false' | 'matching';

export type QuestionSubject = 'religion' | 'genetics' | 'culture' | 'patristics';

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface Question {
  id: string;
  stageId: number;
  type: QuestionType;
  subject: QuestionSubject;
  text: string;
  options?: string[]; // For multiple_choice
  correctAnswer?: number | string | boolean; // index for MC, boolean for true/false
  matchingPairs?: MatchingPair[]; // For matching
  explanation: string;
  scriptureReference?: string;
  points: number;
}

export interface Stage {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  timeLimitSec: number;
  passingScore: number;
  isOpen: boolean;
  questionIds: string[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  isUrgent?: boolean;
}

export interface DioceseRanking {
  diocese: string;
  totalPoints: number;
  participantsCount: number;
  avgScore: number;
}

export interface SoloQuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpentSec: number;
  date: string;
  candidateName: string;
  vocation: string;
  rankBadge: string;
}
