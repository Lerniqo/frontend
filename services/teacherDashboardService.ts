import { ApiResponse } from "@/types/auth.types";
import apiClient from "@/services/apiClient";

// Mock data types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  read: boolean;
  createdAt: string;
}

export interface Contest {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  participants: number;
  status: "draft" | "active" | "completed";
}

export interface Question {
  id: string;
  subject: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: "easy" | "medium" | "hard";
}

export interface Resource {
  id: string;
  title: string;
  type: "video" | "note" | "audio" | "document";
  url: string;
  uploadedAt: string;
  downloads: number;
}

export interface Webinar {
  id: string;
  title: string;
  description: string;
  scheduledDate: string;
  duration: number; // in minutes
  attendees: number;
  status: "scheduled" | "ongoing" | "completed";
}

// Mock data
const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Student Enrollment",
    message: "John Doe has enrolled in your Math class",
    type: "success",
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Contest Reminder",
    message: "Your Science contest ends in 2 days",
    type: "warning",
    read: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    title: "Webinar Scheduled",
    message: 'Your webinar "Advanced Physics" is scheduled for tomorrow',
    type: "info",
    read: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

const mockContests: Contest[] = [
  {
    id: "1",
    title: "Mathematics Challenge",
    description: "Test your math skills with this exciting contest",
    startDate: "2025-09-01",
    endDate: "2025-09-15",
    participants: 45,
    status: "active",
  },
  {
    id: "2",
    title: "Science Quiz",
    description: "Explore the wonders of science",
    startDate: "2025-09-10",
    endDate: "2025-09-20",
    participants: 32,
    status: "draft",
  },
];

const mockQuestions: Question[] = [
  {
    id: "1",
    subject: "Mathematics",
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: 1,
    difficulty: "easy",
  },
  {
    id: "2",
    subject: "Science",
    question: "What is the chemical symbol for water?",
    options: ["H2O", "CO2", "O2", "N2"],
    correctAnswer: 0,
    difficulty: "easy",
  },
];

const mockResources: Resource[] = [
  {
    id: "1",
    title: "Introduction to Algebra",
    type: "video",
    url: "/resources/algebra-intro.mp4",
    uploadedAt: "2025-08-25",
    downloads: 120,
  },
  {
    id: "2",
    title: "Periodic Table Notes",
    type: "note",
    url: "/resources/periodic-table.pdf",
    uploadedAt: "2025-08-20",
    downloads: 89,
  },
];

const mockWebinars: Webinar[] = [
  {
    id: "1",
    title: "Advanced Physics Concepts",
    description: "Deep dive into quantum mechanics",
    scheduledDate: "2025-09-05T14:00:00Z",
    duration: 90,
    attendees: 25,
    status: "scheduled",
  },
  {
    id: "2",
    title: "Chemistry Lab Safety",
    description: "Essential safety protocols for chemistry labs",
    scheduledDate: "2025-08-28T10:00:00Z",
    duration: 60,
    attendees: 18,
    status: "completed",
  },
];

// Mock API functions
export const getNotifications = async (): Promise<
  ApiResponse<Notification[]>
> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    success: true,
    message: "Notifications retrieved successfully",
    data: mockNotifications,
  };
};

export const markNotificationAsRead = async (
  id: string
): Promise<ApiResponse<boolean>> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const notification = mockNotifications.find((n) => n.id === id);
  if (notification) {
    notification.read = true;
  }
  return {
    success: true,
    message: "Notification marked as read",
    data: true,
  };
};

export const getContests = async (): Promise<ApiResponse<Contest[]>> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    success: true,
    message: "Contests retrieved successfully",
    data: mockContests,
  };
};

export const createContest = async (
  contest: Omit<Contest, "id" | "participants" | "status">
): Promise<ApiResponse<Contest>> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const newContest: Contest = {
    ...contest,
    id: Date.now().toString(),
    participants: 0,
    status: "draft",
  };
  mockContests.push(newContest);
  return {
    success: true,
    message: "Contest created successfully",
    data: newContest,
  };
};

export const getQuestions = async (): Promise<ApiResponse<Question[]>> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    success: true,
    message: "Questions retrieved successfully",
    data: mockQuestions,
  };
};

export const addQuestion = async (
  question: Omit<Question, "id">
): Promise<ApiResponse<Question>> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const newQuestion: Question = {
    ...question,
    id: Date.now().toString(),
  };
  mockQuestions.push(newQuestion);
  return {
    success: true,
    message: "Question added successfully",
    data: newQuestion,
  };
};

export const getResources = async (): Promise<ApiResponse<Resource[]>> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    success: true,
    message: "Resources retrieved successfully",
    data: mockResources,
  };
};

export const uploadResource = async (
  resource: Omit<Resource, "id" | "uploadedAt" | "downloads">
): Promise<ApiResponse<Resource>> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const newResource: Resource = {
    ...resource,
    id: Date.now().toString(),
    uploadedAt: new Date().toISOString().split("T")[0],
    downloads: 0,
  };
  mockResources.push(newResource);
  return {
    success: true,
    message: "Resource uploaded successfully",
    data: newResource,
  };
};

export const getWebinars = async (): Promise<ApiResponse<Webinar[]>> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    success: true,
    message: "Webinars retrieved successfully",
    data: mockWebinars,
  };
};

export const scheduleWebinar = async (
  webinar: Omit<Webinar, "id" | "attendees" | "status">
): Promise<ApiResponse<Webinar>> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const newWebinar: Webinar = {
    ...webinar,
    id: Date.now().toString(),
    attendees: 0,
    status: "scheduled",
  };
  mockWebinars.push(newWebinar);
  return {
    success: true,
    message: "Webinar scheduled successfully",
    data: newWebinar,
  };
};

// Mock availability data
export interface AvailabilitySlot {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  day: string; // Day name for display
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

const mockAvailability: AvailabilitySlot[] = [
  {
    id: "1",
    date: "2025-09-02",
    day: "Monday",
    startTime: "09:00",
    endTime: "11:00",
    isAvailable: true,
  },
  {
    id: "2",
    date: "2025-09-02",
    day: "Monday",
    startTime: "14:00",
    endTime: "16:00",
    isAvailable: true,
  },
  {
    id: "3",
    date: "2025-09-03",
    day: "Tuesday",
    startTime: "10:00",
    endTime: "12:00",
    isAvailable: false,
  },
  {
    id: "4",
    date: "2025-09-04",
    day: "Wednesday",
    startTime: "09:00",
    endTime: "11:00",
    isAvailable: true,
  },
  {
    id: "5",
    date: "2025-09-05",
    day: "Thursday",
    startTime: "15:00",
    endTime: "17:00",
    isAvailable: true,
  },
  {
    id: "6",
    date: "2025-09-06",
    day: "Friday",
    startTime: "13:00",
    endTime: "15:00",
    isAvailable: false,
  },
];

export const getAvailability = async (): Promise<
  ApiResponse<AvailabilitySlot[]>
> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    success: true,
    message: "Availability retrieved successfully",
    data: mockAvailability,
  };
};

export const updateAvailability = async (
  slots: AvailabilitySlot[]
): Promise<ApiResponse<boolean>> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  // In a real app, this would update the backend
  return {
    success: true,
    message: "Availability updated successfully",
    data: true,
  };
};

// Teacher Sessions Interface
export interface TeacherSession {
  session_id: string;
  teacher_id: string;
  session_type: "ONE_ON_ONE" | "GROUP";
  title: string;
  description: string;
  start_time: string; // ISO datetime string
  end_time: string; // ISO datetime string
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  is_paid: boolean;
  price: string | null; // String from API
  max_attendees: number;
  video_conference_link: string;
  attendees_count: number;
  zoom_meeting_id: string;
  zoom_join_url: string;
  zoom_start_url: string;
  zoom_password: string;
}

/**
 * Fetches all teacher sessions for the current teacher (both GROUP and ONE_ON_ONE)
 * @returns Promise with array of teacher sessions
 */
export const getAllTeachersSessions = async (): Promise<
  ApiResponse<TeacherSession[]>
> => {
  try {
    const response = await apiClient.get<TeacherSession[]>(
      "/scheduling-service/scheduling/me/sessions"
    );

    // The API returns the array directly (based on the backend response format)
    return {
      success: true,
      message: "Teacher sessions retrieved successfully",
      data: response.data || [],
    };
  } catch (error: any) {
    console.error("Error fetching teacher sessions:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch teacher sessions",
      error: error.response?.data?.error || error.message || "Unknown error",
    };
  }
};
