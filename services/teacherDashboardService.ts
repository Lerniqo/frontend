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
  tags?: string[]; // Array of concept IDs (particle and topic IDs)
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

// Availability API response types
export interface AvailabilityAPIResponse {
  availability_id: string;
  teacher_id: string;
  start_time: string; // ISO datetime string (e.g., "2025-10-17T09:00:00.000Z")
  end_time: string; // ISO datetime string
  is_booked: boolean;
  is_paid: boolean;
  price_per_session: string | null;
  session_description: string | null;
  created_at: string;
  updated_at: string;
}

// Local availability slot for frontend display
export interface AvailabilitySlot {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  day: string; // Day name for display
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  isAvailable: boolean;
  isPaid?: boolean;
  price?: number | null;
  sessionDescription?: string | null;
}

/**
 * Transforms API availability response to frontend AvailabilitySlot format
 * @param apiResponse - Raw API response
 * @returns Formatted AvailabilitySlot
 */
const transformAvailabilityResponse = (
  apiResponse: AvailabilityAPIResponse
): AvailabilitySlot => {
  const startDate = new Date(apiResponse.start_time);
  const endDate = new Date(apiResponse.end_time);

  // Extract date in YYYY-MM-DD format
  const date = startDate.toISOString().split("T")[0];

  // Extract day name
  const dayName = startDate.toLocaleDateString("en-US", { weekday: "long" });

  // Extract time in HH:mm format
  const startTime = startDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const endTime = endDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return {
    id: apiResponse.availability_id,
    date,
    day: dayName,
    startTime,
    endTime,
    isAvailable: !apiResponse.is_booked,
  };
};

/**
 * Fetches teacher availability from the scheduling service
 * @param teacherId - The teacher's ID (optional, uses current user if not provided)
 * @returns Promise with array of availability slots
 */
export const getAvailability = async (
  teacherId?: string
): Promise<ApiResponse<AvailabilitySlot[]>> => {
  try {
    // If teacherId is not provided, we need to get current user
    let finalTeacherId = teacherId;

    if (!finalTeacherId) {
      // Get current user from userService
      const { userService } = await import("@/services/userService");
      const currentUserResponse = await userService.getCurrentUser();

      if (!currentUserResponse.success || !currentUserResponse.data?.userId) {
        return {
          success: false,
          message: "Failed to get current user information",
          error: "Unable to retrieve current teacher ID",
        };
      }

      finalTeacherId = currentUserResponse.data.userId;
    }

    // Fetch availability from scheduling service
    const response = await apiClient.get<AvailabilityAPIResponse[]>(
      `/scheduling-service/scheduling/teachers/${finalTeacherId}/availability`
    );

    // Check if we have valid data
    if (!Array.isArray(response.data)) {
      return {
        success: false,
        message: "Invalid availability data format",
        error: "API returned non-array data",
      };
    }

    // Transform API responses to frontend format
    const transformedData: AvailabilitySlot[] = response.data.map((slot) =>
      transformAvailabilityResponse(slot)
    );

    return {
      success: true,
      message: "Availability retrieved successfully",
      data: transformedData,
    };
  } catch (error: any) {
    console.error("Error fetching availability:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch availability",
      error: error.response?.data?.error || error.message || "Unknown error",
    };
  }
};

// Interface for availability slot with optional paid info
export interface AvailabilityUpdateRequest {
  startTime: string; // ISO datetime string
  endTime: string; // ISO datetime string
  isPaid: boolean;
  price: number | null;
  sessionDescription: string | null;
}

/**
 * Transforms frontend availability slots to API request format
 * @param slots - Array of availability slots with optional paid info
 * @returns Array of availability update requests in API format
 */
const transformSlotsToApiFormat = (
  slots: AvailabilitySlot[]
): AvailabilityUpdateRequest[] => {
  return slots.map((slot) => {
    // Parse date and time components
    const [year, month, day] = slot.date.split("-");
    const [startHour, startMin] = slot.startTime.split(":");
    const [endHour, endMin] = slot.endTime.split(":");

    // Create ISO datetime strings
    const startDateTime = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(startHour),
      parseInt(startMin),
      0,
      0
    );

    const endDateTime = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(endHour),
      parseInt(endMin),
      0,
      0
    );

    return {
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      isPaid: slot.isPaid || false,
      price: slot.price || null,
      sessionDescription: slot.sessionDescription || null,
    };
  });
};

/**
 * Updates teacher availability by sending all availability slots to backend
 * Backend will delete all existing slots and save new ones
 * @param slots - Array of availability slots with optional paid info
 * @returns Promise with success status
 */
export const updateAvailability = async (
  slots: AvailabilitySlot[]
): Promise<ApiResponse<boolean>> => {
  try {
    // Transform slots to API format
    const requestData = transformSlotsToApiFormat(slots);
    console.log("Request data for availability update:", requestData);

    // Send to backend - backend handles delete all and insert new
    // Request should be an array of availability slots
    const response = await apiClient.post<{ message: string }>(
      "/scheduling-service/scheduling/availability",
      {
        availabilities: requestData,
      }
    );

    // Backend returns status 201 with { message: "Availability updated." }
    // If we reach here without error, it means success (status 2xx)
    return {
      success: true,
      message: response.data.message || "Availability updated successfully",
      data: true,
    };
  } catch (error: any) {
    console.error("Error updating availability:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to update availability",
      error: error.response?.data?.error || error.message || "Unknown error",
    };
  }
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

// Create Group Session Request Interface
export interface CreateGroupSessionRequest {
  title: string;
  description: string;
  startTime: string; // ISO datetime string (e.g., "2025-10-20T14:00:00Z")
  endTime: string; // ISO datetime string (e.g., "2025-10-20T16:00:00Z")
  isPaid: boolean;
  price: number; // Price in USD
  maxAttendees: number;
}

// Create Group Session Response Interface
export interface CreateGroupSessionResponse {
  session_id: string;
  teacher_id: string;
  session_type: "GROUP";
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  status: "SCHEDULED";
  is_paid: boolean;
  price: string;
  max_attendees: number;
  video_conference_link: string;
  attendees_count: number;
  zoom_meeting_id: string;
  zoom_join_url: string;
  zoom_start_url: string;
  zoom_password: string;
}

/**
 * Creates a new group session for the teacher
 * @param sessionData - Group session data including title, description, timing, pricing, and max attendees
 * @returns Promise with created group session details
 */
export const createNewGroupSession = async (
  sessionData: CreateGroupSessionRequest
): Promise<ApiResponse<CreateGroupSessionResponse>> => {
  try {
    const response = await apiClient.post<CreateGroupSessionResponse>(
      "/scheduling-service/scheduling/group-sessions",
      sessionData
    );

    return {
      success: true,
      message: "Group session created successfully",
      data: response.data,
    };
  } catch (error: any) {
    console.error("Error creating group session:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to create group session",
      error: error.response?.data?.error || error.message || "Unknown error",
    };
  }
};
