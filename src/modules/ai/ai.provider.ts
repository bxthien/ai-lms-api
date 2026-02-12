export interface GenerateQuizInput {
  lessonContent: string;
  lessonTitle?: string;
  language?: string;
  questionCount?: number;
}

export interface GeneratedQuizQuestion {
  type: 'MCQ' | 'TEXT';
  question: string;
  options?: string[];
  correctAnswer?: string;
  score?: number;
}

export interface GenerateQuizResult {
  questions: GeneratedQuizQuestion[];
}

export interface GradeEssayInput {
  question: string;
  answer: string;
  rubric?: string;
  maxScore?: number;
  language?: string;
}

export interface GradeEssayResult {
  score: number;
  feedback: string;
  reasoning?: string;
}

export interface AiProvider {
  generateQuizFromLesson(input: GenerateQuizInput): Promise<GenerateQuizResult>;

  gradeEssay(input: GradeEssayInput): Promise<GradeEssayResult>;
}

export const AI_PROVIDER = 'AI_PROVIDER';

