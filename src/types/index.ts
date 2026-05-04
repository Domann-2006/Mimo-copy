export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  points: number;
  level: number;
  streak: number;
  badges: string[];
  learningPath?: string;
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  language: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  lessonsCount: number;
  image?: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  content: string;
  order: number;
  type: 'reading' | 'coding' | 'quiz';
  challenge?: {
    initialCode: string;
    solution: string;
    testCases: string;
  };
}

export interface Progress {
  id: string;
  userId: string;
  lessonId: string;
  courseId: string;
  completed: boolean;
  score: number;
  completedAt: string;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  tags: string[];
  type: 'discussion' | 'project' | 'help';
  upvotes: number;
  createdAt: string;
}
