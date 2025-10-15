export interface StudentContest {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  participants: number;
  status: "upcoming" | "active" | "completed";
  subject: string;
  difficulty: "easy" | "medium" | "hard";
  awards: {
    first: string;
    second: string;
    third: string;
  };
  rules: string[];
  tasks: ContestTask[];
  leaderboard: LeaderboardEntry[];
  isJoined: boolean;
  maxParticipants: number;
}

export interface ContestTask {
  id: string;
  title: string;
  description: string;
  points: number;
  timeLimit: number; // in minutes
  type: "quiz" | "problem-solving" | "coding" | "essay";
}

export interface LeaderboardEntry {
  id: string;
  studentId: string;
  studentName: string;
  avatar?: string;
  score: number;
  completedTasks: number;
  totalTasks: number;
  timeSpent: number; // in minutes
  rank: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// Mock data for student contests
const mockStudentContests: StudentContest[] = [
  {
    id: "1",
    title: "Mathematics Championship 2025",
    description:
      "Test your mathematical prowess in this comprehensive contest covering algebra, geometry, and calculus.",
    startDate: "2025-09-15T09:00:00Z",
    endDate: "2025-09-22T18:00:00Z",
    participants: 124,
    maxParticipants: 200,
    status: "active",
    subject: "Mathematics",
    difficulty: "medium",
    isJoined: true,
    awards: {
      first: "Trophy + $500 Prize",
      second: "Medal + $300 Prize",
      third: "Certificate + $100 Prize",
    },
    rules: [
      "Contest duration: 7 days",
      "No external help allowed",
      "Submit all answers within time limit",
      "Each task has a specific time limit",
      "Fair play policy strictly enforced",
    ],
    tasks: [
      {
        id: "t1",
        title: "Algebra Mastery",
        description: "Solve complex algebraic equations and inequalities",
        points: 100,
        timeLimit: 60,
        type: "quiz",
      },
      {
        id: "t2",
        title: "Geometry Challenge",
        description: "Prove geometric theorems and solve spatial problems",
        points: 150,
        timeLimit: 90,
        type: "problem-solving",
      },
      {
        id: "t3",
        title: "Calculus Applications",
        description: "Apply calculus concepts to real-world scenarios",
        points: 200,
        timeLimit: 120,
        type: "problem-solving",
      },
    ],
    leaderboard: [
      {
        id: "l1",
        studentId: "s1",
        studentName: "Alex Chen",
        avatar:
          "https://ui-avatars.com/api/?name=Alex+Chen&size=40&background=3b82f6&color=fff",
        score: 420,
        completedTasks: 3,
        totalTasks: 3,
        timeSpent: 245,
        rank: 1,
      },
      {
        id: "l2",
        studentId: "s2",
        studentName: "Sarah Johnson",
        avatar:
          "https://ui-avatars.com/api/?name=Sarah+Johnson&size=40&background=8b5cf6&color=fff",
        score: 395,
        completedTasks: 3,
        totalTasks: 3,
        timeSpent: 267,
        rank: 2,
      },
      {
        id: "l3",
        studentId: "s3",
        studentName: "Michael Rodriguez",
        avatar:
          "https://ui-avatars.com/api/?name=Michael+Rodriguez&size=40&background=10b981&color=fff",
        score: 380,
        completedTasks: 3,
        totalTasks: 3,
        timeSpent: 289,
        rank: 3,
      },
      {
        id: "l4",
        studentId: "s4",
        studentName: "Emma Davis",
        avatar:
          "https://ui-avatars.com/api/?name=Emma+Davis&size=40&background=f59e0b&color=fff",
        score: 365,
        completedTasks: 2,
        totalTasks: 3,
        timeSpent: 178,
        rank: 4,
      },
      {
        id: "l5",
        studentId: "s5",
        studentName: "John Smith",
        avatar:
          "https://ui-avatars.com/api/?name=John+Smith&size=40&background=ef4444&color=fff",
        score: 350,
        completedTasks: 2,
        totalTasks: 3,
        timeSpent: 156,
        rank: 5,
      },
    ],
  },
  {
    id: "2",
    title: "Science Discovery Quest",
    description:
      "Explore the fascinating world of physics, chemistry, and biology through challenging experiments and questions.",
    startDate: "2025-09-20T10:00:00Z",
    endDate: "2025-09-27T20:00:00Z",
    participants: 89,
    maxParticipants: 150,
    status: "upcoming",
    subject: "Science",
    difficulty: "hard",
    isJoined: false,
    awards: {
      first: "Science Kit + $400 Prize",
      second: "Laboratory Equipment + $250 Prize",
      third: "Science Books + $150 Prize",
    },
    rules: [
      "Contest duration: 7 days",
      "Laboratory safety rules must be followed",
      "Original research and analysis required",
      "Plagiarism will result in disqualification",
      "Submit detailed explanations for all answers",
    ],
    tasks: [
      {
        id: "t4",
        title: "Physics Phenomena",
        description: "Analyze complex physics problems and experiments",
        points: 120,
        timeLimit: 75,
        type: "problem-solving",
      },
      {
        id: "t5",
        title: "Chemical Reactions",
        description: "Balance equations and predict reaction outcomes",
        points: 110,
        timeLimit: 65,
        type: "quiz",
      },
      {
        id: "t6",
        title: "Biology Research",
        description: "Analyze biological systems and processes",
        points: 180,
        timeLimit: 100,
        type: "essay",
      },
    ],
    leaderboard: [
      {
        id: "l6",
        studentId: "s6",
        studentName: "Lisa Wang",
        avatar:
          "https://ui-avatars.com/api/?name=Lisa+Wang&size=40&background=06b6d4&color=fff",
        score: 385,
        completedTasks: 3,
        totalTasks: 3,
        timeSpent: 220,
        rank: 1,
      },
      {
        id: "l7",
        studentId: "s7",
        studentName: "David Kumar",
        avatar:
          "https://ui-avatars.com/api/?name=David+Kumar&size=40&background=ec4899&color=fff",
        score: 370,
        completedTasks: 3,
        totalTasks: 3,
        timeSpent: 235,
        rank: 2,
      },
    ],
  },
  {
    id: "3",
    title: "English Literature Challenge",
    description:
      "Dive deep into classic and contemporary literature, showcasing your analytical and creative writing skills.",
    startDate: "2025-09-01T08:00:00Z",
    endDate: "2025-09-08T22:00:00Z",
    participants: 156,
    maxParticipants: 200,
    status: "completed",
    subject: "English",
    difficulty: "easy",
    isJoined: true,
    awards: {
      first: "Book Collection + $350 Prize",
      second: "Writing Set + $200 Prize",
      third: "Literary Magazine Subscription + $100 Prize",
    },
    rules: [
      "Original writing only",
      "Proper citations required",
      "Word limits must be respected",
      "Grammar and style count towards final score",
      "Submit work in specified format",
    ],
    tasks: [
      {
        id: "t7",
        title: "Poetry Analysis",
        description: "Analyze themes and literary devices in selected poems",
        points: 90,
        timeLimit: 45,
        type: "essay",
      },
      {
        id: "t8",
        title: "Creative Writing",
        description: "Write an original short story based on given prompts",
        points: 130,
        timeLimit: 90,
        type: "essay",
      },
      {
        id: "t9",
        title: "Literature Quiz",
        description: "Answer questions about classic and modern literature",
        points: 80,
        timeLimit: 30,
        type: "quiz",
      },
    ],
    leaderboard: [
      {
        id: "l8",
        studentId: "s8",
        studentName: "Grace Taylor",
        avatar:
          "https://ui-avatars.com/api/?name=Grace+Taylor&size=40&background=14b8a6&color=fff",
        score: 290,
        completedTasks: 3,
        totalTasks: 3,
        timeSpent: 155,
        rank: 1,
      },
      {
        id: "l9",
        studentId: "s9",
        studentName: "Oliver Brown",
        avatar:
          "https://ui-avatars.com/api/?name=Oliver+Brown&size=40&background=f97316&color=fff",
        score: 275,
        completedTasks: 3,
        totalTasks: 3,
        timeSpent: 162,
        rank: 2,
      },
      {
        id: "l10",
        studentId: "s10",
        studentName: "Sophia Wilson",
        avatar:
          "https://ui-avatars.com/api/?name=Sophia+Wilson&size=40&background=a855f7&color=fff",
        score: 260,
        completedTasks: 3,
        totalTasks: 3,
        timeSpent: 148,
        rank: 3,
      },
    ],
  },
];

export const getStudentContests = async (): Promise<
  ApiResponse<StudentContest[]>
> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: "Student contests retrieved successfully",
        data: mockStudentContests,
      });
    }, 1000);
  });
};

export const joinContest = async (
  contestId: string
): Promise<ApiResponse<StudentContest>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const contest = mockStudentContests.find((c) => c.id === contestId);
      if (contest) {
        contest.isJoined = true;
        contest.participants += 1;
        resolve({
          success: true,
          message: "Successfully joined the contest",
          data: contest,
        });
      } else {
        resolve({
          success: false,
          message: "Contest not found",
        });
      }
    }, 500);
  });
};

export const leaveContest = async (
  contestId: string
): Promise<ApiResponse<StudentContest>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const contest = mockStudentContests.find((c) => c.id === contestId);
      if (contest) {
        contest.isJoined = false;
        contest.participants -= 1;
        resolve({
          success: true,
          message: "Successfully left the contest",
          data: contest,
        });
      } else {
        resolve({
          success: false,
          message: "Contest not found",
        });
      }
    }, 500);
  });
};
