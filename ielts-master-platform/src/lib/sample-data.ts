import type { IeltsTest, ProgressLog, Student, Teacher, User, VocabularyWord } from "@/lib/types";

export const currentUser: User = {
  id: "u_001",
  name: "Sardor Usanov",
  email: "sardor@example.com",
  role: "student",
  avatar: "SU",
};

export const students: Student[] = [
  { id: "s1", name: "Aziza Karimova", targetBand: 7.5, currentLevel: "B2", streak: 18, vocabularyProgress: 72, privateLessons: 3, weakSkills: ["listening", "writing"] },
  { id: "s2", name: "Jasur Aliyev", targetBand: 7, currentLevel: "B1+", streak: 9, vocabularyProgress: 54, privateLessons: 1, weakSkills: ["reading", "speaking"] },
  { id: "s3", name: "Madina Sobirova", targetBand: 8, currentLevel: "C1", streak: 27, vocabularyProgress: 86, privateLessons: 4, weakSkills: ["writing"] },
];

export const teachers: Teacher[] = [
  { id: "t1", name: "Dilnoza Sanokulova", specialization: "Writing and Speaking", activeStudents: 42, pendingReviews: 12 },
  { id: "t2", name: "Akmal Rahimov", specialization: "Reading and Listening", activeStudents: 36, pendingReviews: 8 },
];

export const skillProgress: ProgressLog[] = [
  { label: "Reading", score: 7.5, change: 0.5, color: "bg-indigo-500" },
  { label: "Listening", score: 6.5, change: -0.2, color: "bg-sky-500" },
  { label: "Speaking", score: 7, change: 0.3, color: "bg-emerald-500" },
  { label: "Writing", score: 6, change: 0.4, color: "bg-amber-500" },
];

export const tests: IeltsTest[] = [
  { id: "r1", title: "AI in Education", skill: "reading", section: "passage1", duration: 20, difficulty: "Intermediate", estimatedBand: "6.0-7.0", tags: ["technology", "education"], status: "published", questions: 13, completions: 128 },
  { id: "r2", title: "Urban Biodiversity", skill: "reading", section: "passage2", duration: 20, difficulty: "Advanced", estimatedBand: "7.0-8.0", tags: ["environment"], status: "published", questions: 13, completions: 94 },
  { id: "l1", title: "Library Membership Form", skill: "listening", section: "part1", duration: 10, difficulty: "Foundation", estimatedBand: "5.0-6.5", tags: ["forms"], status: "published", questions: 10, completions: 203 },
  { id: "l4", title: "Marine Science Lecture", skill: "listening", section: "part4", duration: 10, difficulty: "Advanced", estimatedBand: "7.0-8.5", tags: ["science"], status: "published", questions: 10, completions: 77 },
  { id: "w1", title: "Academic Task 1: Line Graph", skill: "writing", section: "task1", duration: 20, difficulty: "Intermediate", estimatedBand: "6.0-7.5", tags: ["academic"], status: "published", questions: 1, completions: 61 },
  { id: "w2", title: "Task 2: Technology Essay", skill: "writing", section: "task2", duration: 40, difficulty: "Advanced", estimatedBand: "7.0-8.5", tags: ["essay"], status: "draft", questions: 1, completions: 22 },
  { id: "s2", title: "Speaking Cue Cards: Society", skill: "speaking", section: "part2", duration: 15, difficulty: "Intermediate", estimatedBand: "6.0-7.5", tags: ["cue card"], status: "published", questions: 6, completions: 48 },
];

export const dailyTasks = [
  "Complete Reading Passage 1",
  "Review 20 saved vocabulary cards",
  "Record Speaking Part 2 cue card",
  "Rewrite Task 2 introduction from feedback",
];

export const recentActivity = [
  "Completed Listening Part 1 with 8/10",
  "Saved 12 vocabulary words from podcast",
  "Teacher left feedback on Writing Task 2",
  "Started Full Reading Mock",
];

export const vocabulary: VocabularyWord[] = [
  {
    word: "mitigate",
    pronunciation: "/ˈmɪtɪɡeɪt/",
    meaning: "to make something less harmful or serious",
    uzbek: "yumshatmoq, kamaytirmoq",
    example: "Governments should mitigate the effects of climate change.",
    topic: "Environment",
    synonyms: ["reduce", "alleviate"],
    collocations: ["mitigate risk", "mitigate damage"],
  },
  {
    word: "curriculum",
    pronunciation: "/kəˈrɪkjələm/",
    meaning: "the subjects taught in a school or course",
    uzbek: "o'quv dasturi",
    example: "Technology should be included in the national curriculum.",
    topic: "Education",
    synonyms: ["syllabus", "program"],
    collocations: ["school curriculum", "national curriculum"],
  },
  {
    word: "workforce",
    pronunciation: "/ˈwɜːrkfɔːrs/",
    meaning: "all the people who work in a company or country",
    uzbek: "ishchi kuchi",
    example: "Automation will change the future workforce.",
    topic: "Work",
    synonyms: ["employees", "labour force"],
    collocations: ["skilled workforce", "global workforce"],
  },
];

export const analytics = {
  activeUsers: 1248,
  completedTests: 9342,
  averageBand: 6.8,
  subscriptionsActive: 812,
};
