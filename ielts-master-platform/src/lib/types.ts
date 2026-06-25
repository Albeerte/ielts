export type Role = "student" | "teacher" | "admin";

export type Skill =
  | "reading"
  | "listening"
  | "speaking"
  | "writing"
  | "mock"
  | "dictation"
  | "podcast"
  | "article"
  | "vocabulary";

export type TestSection =
  | "part1"
  | "part2"
  | "part3"
  | "part4"
  | "passage1"
  | "passage2"
  | "passage3"
  | "task1"
  | "task2"
  | "full";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
};

export type Student = {
  id: string;
  name: string;
  targetBand: number;
  currentLevel: string;
  streak: number;
  vocabularyProgress: number;
  privateLessons: number;
  weakSkills: Skill[];
};

export type Teacher = {
  id: string;
  name: string;
  specialization: string;
  activeStudents: number;
  pendingReviews: number;
};

export type IeltsTest = {
  id: string;
  title: string;
  skill: Skill;
  section: TestSection;
  duration: number;
  difficulty: "Foundation" | "Intermediate" | "Advanced";
  estimatedBand: string;
  tags: string[];
  status: "draft" | "published";
  questions: number;
  completions: number;
};

export type ProgressLog = {
  label: string;
  score: number;
  change: number;
  color: string;
};

export type VocabularyWord = {
  word: string;
  pronunciation: string;
  meaning: string;
  uzbek: string;
  example: string;
  topic: string;
  synonyms: string[];
  collocations: string[];
};
