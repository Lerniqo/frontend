// Contest Service - Manages contest data and operations

export interface Task {
  taskId: string;
  title: string;
  description: string;
  goal: number;
  unit: string;
  status: "not_started" | "in_progress" | "completed";
  rewardPoints: number;
}

export interface Contest {
  eventId: string;
  eventName: string;
  subtitle: string;
  bannerImage: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  tasks: Task[];
}

export interface TopRanker {
  rank: number;
  name: string;
  points: number;
}

export interface CreateContestData {
  eventName: string;
  subtitle: string;
  bannerImage: string;
  startDate: string;
  endDate: string;
  tasks: {
    title: string;
    description: string;
    goal: number;
    unit: string;
    rewardPoints: number;
    type: "1v1_battle" | "ai_quiz";
    difficulty?: "easy" | "medium" | "hard";
  }[];
}

// Mock data for contests
const mockContests: Contest[] = [
  {
    eventId: "evt_2025_math_mania_week",
    eventName: "Math Mania Week",
    subtitle:
      "A full week of math challenges! Compete daily and win special rewards.",
    bannerImage:
      "https://images.pexels.com/photos/35619/capri-ford-oldtimer-automotive.jpg?cs=srgb&dl=pexels-pixabay-35619.jpg&fm=jpg",
    startDate: "2025-10-20T00:00:00Z",
    endDate: "2025-10-26T23:59:59Z",
    isActive: true,
    tasks: [
      {
        taskId: "task_daily_challenge",
        title: "Complete Daily Challenge",
        description:
          "Solve one math challenge each day of the week (Monday to Sunday).",
        goal: 7,
        unit: "days",
        status: "in_progress",
        rewardPoints: 200,
      },
      {
        taskId: "task_leaderboard_top10",
        title: "Reach Top 10 on Leaderboard",
        description:
          "Score enough points this week to make it into the Top 10.",
        goal: 10,
        unit: "rank",
        status: "not_started",
        rewardPoints: 300,
      },
      {
        taskId: "task_perfect_quiz",
        title: "Score 10/10 in Any Quiz",
        description: "Get a perfect score in one of the daily quizzes.",
        goal: 10,
        unit: "score",
        status: "not_started",
        rewardPoints: 150,
      },
    ],
  },
  {
    eventId: "evt_2025_christmas_challenge",
    eventName: "Christmas Challenge",
    subtitle: "Complete tasks to earn exclusive rewards this season!",
    bannerImage:
      "https://images.pexels.com/photos/35619/capri-ford-oldtimer-automotive.jpg?cs=srgb&dl=pexels-pixabay-35619.jpg&fm=jpg",
    startDate: "2025-12-20T00:00:00Z",
    endDate: "2026-01-05T23:59:59Z",
    isActive: false,
    tasks: [
      {
        taskId: "task_1v1_win",
        title: "Win 10 One vs One Battles",
        description:
          "Compete against other students in live 1v1 matches and win 10 times.",
        goal: 10,
        unit: "wins",
        status: "not_started",
        rewardPoints: 100,
      },
      {
        taskId: "task_ai_quiz_score",
        title: "Score 8+ in AI-Generated Hard Quiz",
        description:
          "Attempt the AI-generated quiz and score at least 8 out of 10.",
        goal: 8,
        unit: "score",
        status: "not_started",
        rewardPoints: 150,
      },
    ],
  },
  {
    eventId: "evt_2025_summer_mission",
    eventName: "Summer Learning Mission",
    subtitle: "Sharpen your skills while everyone else takes a break!",
    bannerImage:
      "https://images.pexels.com/photos/35619/capri-ford-oldtimer-automotive.jpg?cs=srgb&dl=pexels-pixabay-35619.jpg&fm=jpg",
    startDate: "2025-07-01T00:00:00Z",
    endDate: "2025-07-20T23:59:59Z",
    isActive: false,
    tasks: [
      {
        taskId: "task_daily_login_streak",
        title: "Maintain 7-Day Login Streak",
        description: "Stay consistent and log in every day for 7 days.",
        goal: 7,
        unit: "days",
        status: "completed",
        rewardPoints: 200,
      },
      {
        taskId: "task_video_lessons",
        title: "Complete 5 Video Lessons",
        description: "Watch and finish 5 video lessons in any topic.",
        goal: 5,
        unit: "videos",
        status: "completed",
        rewardPoints: 100,
      },
    ],
  },
  {
    eventId: "evt_2025_pi_day_challenge",
    eventName: "Pi Day Math Marathon",
    subtitle:
      "Celebrate Pi Day with mathematical missions and earn rare badges!",
    bannerImage:
      "https://images.pexels.com/photos/35619/capri-ford-oldtimer-automotive.jpg?cs=srgb&dl=pexels-pixabay-35619.jpg&fm=jpg",
    startDate: "2025-03-10T00:00:00Z",
    endDate: "2025-03-20T23:59:59Z",
    isActive: false,
    tasks: [
      {
        taskId: "task_pi_quiz_master",
        title: "Ace the Circle Geometry Quiz",
        description: "Score at least 9 out of 10 in the Circle Geometry quiz.",
        goal: 9,
        unit: "score",
        status: "completed",
        rewardPoints: 150,
      },
      {
        taskId: "task_pi_video_watch",
        title: "Watch 3 Pi Day Tutorials",
        description: "Learn about Pi and its wonders by watching tutorials.",
        goal: 3,
        unit: "videos",
        status: "completed",
        rewardPoints: 60,
      },
    ],
  },
  {
    eventId: "evt_2025_new_year_blast",
    eventName: "New Year Blast",
    subtitle: "Kick off the new year with a series of brainy challenges!",
    bannerImage:
      "https://images.pexels.com/photos/35619/capri-ford-oldtimer-automotive.jpg?cs=srgb&dl=pexels-pixabay-35619.jpg&fm=jpg",
    startDate: "2026-01-10T00:00:00Z",
    endDate: "2026-01-25T23:59:59Z",
    isActive: false,
    tasks: [
      {
        taskId: "task_practice_sessions",
        title: "Complete 15 Practice Sessions",
        description: "Stay sharp! Finish 15 different practice quizzes.",
        goal: 15,
        unit: "sessions",
        status: "not_started",
        rewardPoints: 120,
      },
      {
        taskId: "task_forum_help",
        title: "Help 5 Peers in Forums",
        description:
          "Be a mentor! Answer at least 5 peer questions in the forum.",
        goal: 5,
        unit: "posts",
        status: "not_started",
        rewardPoints: 80,
      },
    ],
  },
];

// Mock data for top rankers
const mockTopRankers: TopRanker[] = [
  {
    rank: 1,
    name: "Ishara Perera",
    points: 980,
  },
  {
    rank: 2,
    name: "Tharindu Fernando",
    points: 940,
  },
  {
    rank: 3,
    name: "Dinushi Jayasuriya",
    points: 910,
  },
  {
    rank: 4,
    name: "Sahan Bandara",
    points: 880,
  },
  {
    rank: 5,
    name: "Nethmi Silva",
    points: 860,
  },
  {
    rank: 6,
    name: "Kasun Madushanka",
    points: 830,
  },
  {
    rank: 7,
    name: "Hiruni Wijesinghe",
    points: 800,
  },
  {
    rank: 8,
    name: "Chathura Ranasinghe",
    points: 780,
  },
  {
    rank: 9,
    name: "Pavithra Abeykoon",
    points: 750,
  },
  {
    rank: 10,
    name: "Ravindu Senanayake",
    points: 720,
  },
];

/**
 * Get all contests
 * @returns Promise with list of all contests
 */
export const getAllContests = async (): Promise<Contest[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockContests;
};

/**
 * Get top rankers by contest ID
 * @param contestId - The ID of the contest
 * @returns Promise with list of top rankers
 */
export const getTopRankersByContestId = async (
  contestId: string
): Promise<TopRanker[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // For future contests, return empty array
  const contest = mockContests.find((c) => c.eventId === contestId);
  if (contest) {
    const now = new Date();
    const startDate = new Date(contest.startDate);
    if (startDate > now) {
      return [];
    }
  }

  return mockTopRankers;
};

/**
 * Create a new contest
 * @param contestData - The data for the new contest
 * @returns Promise with the created contest
 */
export const createNewContest = async (
  contestData: CreateContestData
): Promise<Contest> => {
  console.log("Creating new contest with data:", contestData);

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Generate a new contest ID
  const eventId = `evt_${new Date().getTime()}_${contestData.eventName
    .toLowerCase()
    .replace(/\s+/g, "_")}`;

  // Transform tasks to include taskId and status
  const tasks: Task[] = contestData.tasks.map((task, index) => ({
    taskId: `task_${eventId}_${index}`,
    title: task.title,
    description: task.description,
    goal: task.goal,
    unit: task.unit,
    status: "not_started" as const,
    rewardPoints: task.rewardPoints,
  }));

  const newContest: Contest = {
    eventId,
    eventName: contestData.eventName,
    subtitle: contestData.subtitle,
    bannerImage: contestData.bannerImage,
    startDate: contestData.startDate,
    endDate: contestData.endDate,
    isActive: false,
    tasks,
  };

  console.log("Contest created successfully:", newContest);

  return newContest;
};

/**
 * Check if a week is available for a new contest
 * @param startDate - Start date of the new contest (should be a Monday)
 * @param endDate - End date of the new contest (should be a Sunday)
 * @returns Promise with boolean indicating if the week is available
 */
export const checkWeekAvailability = async (
  startDate: string,
  endDate: string
): Promise<boolean> => {
  const contests = await getAllContests();
  const newStart = new Date(startDate);
  const newEnd = new Date(endDate);

  // Check if any existing contest overlaps with the new contest's week
  for (const contest of contests) {
    const existingStart = new Date(contest.startDate);
    const existingEnd = new Date(contest.endDate);

    // Check for overlap
    if (
      (newStart >= existingStart && newStart <= existingEnd) ||
      (newEnd >= existingStart && newEnd <= existingEnd) ||
      (newStart <= existingStart && newEnd >= existingEnd)
    ) {
      return false; // Week is not available
    }
  }

  return true; // Week is available
};
