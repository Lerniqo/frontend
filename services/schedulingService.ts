// Types for teacher availability
export interface TeacherAvailability {
  availability_id: string;
  teacher_id: string;
  start_time: Date;
  end_time: Date;
  is_booked: boolean;
  is_paid: boolean;
  price_per_session: number | null;
  session_description: string;
  created_at: Date;
  updated_at: Date;
}

// Mock data for teacher availability
export const mockAvailabilities: TeacherAvailability[] = [
  {
    availability_id: "550e8400-e29b-41d4-a716-446655440000",
    teacher_id: "cmey4gxpx0000jt01teghjwom", // Updated to match real teacher ID
    start_time: new Date("2025-10-16T09:00:00Z"),
    end_time: new Date("2025-10-16T11:00:00Z"),
    is_booked: false,
    is_paid: false,
    price_per_session: null,
    session_description: "Free introductory session for new students",
    created_at: new Date("2025-10-15T12:00:00Z"),
    updated_at: new Date("2025-10-15T12:00:00Z"),
  },
  {
    availability_id: "550e8400-e29b-41d4-a716-446655440001",
    teacher_id: "cmey4gxpx0000jt01teghjwom",
    start_time: new Date("2025-10-17T13:00:00Z"),
    end_time: new Date("2025-10-17T15:00:00Z"),
    is_booked: true,
    is_paid: true,
    price_per_session: 75.0,
    session_description: "Advanced mathematics tutoring session",
    created_at: new Date("2025-10-15T12:30:00Z"),
    updated_at: new Date("2025-10-15T13:00:00Z"),
  },
  {
    availability_id: "550e8400-e29b-41d4-a716-446655440002",
    teacher_id: "cmey4gxpx0000jt01teghjwom",
    start_time: new Date("2025-10-18T07:30:00Z"),
    end_time: new Date("2025-10-18T10:30:00Z"),
    is_booked: false,
    is_paid: true,
    price_per_session: 50.0,
    session_description: "Exam preparation class",
    created_at: new Date("2025-10-15T12:00:00Z"),
    updated_at: new Date("2025-10-15T12:00:00Z"),
  },
  {
    availability_id: "550e8400-e29b-41d4-a716-446655440003",
    teacher_id: "cmey4gxpx0000jt01teghjwom",
    start_time: new Date("2025-10-19T15:00:00Z"),
    end_time: new Date("2025-10-19T17:00:00Z"),
    is_booked: false,
    is_paid: true,
    price_per_session: 50.0,
    session_description: "Q&A problem-solving session",
    created_at: new Date("2025-10-15T11:00:00Z"),
    updated_at: new Date("2025-10-15T11:00:00Z"),
  },
  {
    availability_id: "550e8400-e29b-41d4-a716-446655440004",
    teacher_id: "cmey4gxpx0000jt01teghjwom",
    start_time: new Date("2025-10-20T10:00:00Z"),
    end_time: new Date("2025-10-20T12:00:00Z"),
    is_booked: true,
    is_paid: true,
    price_per_session: 100.0,
    session_description: "Physics deep-dive tutoring",
    created_at: new Date("2025-10-15T10:30:00Z"),
    updated_at: new Date("2025-10-15T10:45:00Z"),
  },
];

// Types for session data
export interface Session {
  session_id: string;
  teacher_id: string;
  session_type: "ONE_ON_ONE" | "GROUP";
  title: string;
  description: string;
  start_time: Date;
  end_time: Date;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  is_paid: boolean;
  price: number | null;
  max_attendees: number;
  video_conference_link: string;
  attendees_count: number;
  zoom_meeting_id: string;
  zoom_join_url: string;
  zoom_start_url: string;
  zoom_password: string;
}

// Mock data for sessions
export const mockSessions: Session[] = [
  {
    session_id: "660e8400-e29b-41d4-a716-446655440000",
    teacher_id: "cmey4gxpx0000jt01teghjwom",
    session_type: "ONE_ON_ONE",
    title: "Free Consultation",
    description: "Discuss learning goals and exam preparation strategy.",
    start_time: new Date("2025-10-16T09:00:00Z"),
    end_time: new Date("2025-10-16T09:45:00Z"),
    status: "SCHEDULED",
    is_paid: false,
    price: null,
    max_attendees: 1,
    video_conference_link: "https://us05web.zoom.us/j/111111111?pwd=free123",
    attendees_count: 1,
    zoom_meeting_id: "111111111",
    zoom_join_url: "https://us05web.zoom.us/j/111111111?pwd=free123",
    zoom_start_url: "https://us05web.zoom.us/s/111111111?zak=startfree",
    zoom_password: "free123",
  },
  {
    session_id: "660e8400-e29b-41d4-a716-446655440001",
    teacher_id: "cmey4gxpx0000jt01teghjwom",
    session_type: "ONE_ON_ONE",
    title: "Mathematics Advanced Tutoring",
    description: "Comprehensive coverage of calculus and trigonometry.",
    start_time: new Date("2025-10-17T13:00:00Z"),
    end_time: new Date("2025-10-17T14:00:00Z"),
    status: "SCHEDULED",
    is_paid: true,
    price: 75.0,
    max_attendees: 1,
    video_conference_link: "https://us05web.zoom.us/j/222222222?pwd=math75",
    attendees_count: 1,
    zoom_meeting_id: "222222222",
    zoom_join_url: "https://us05web.zoom.us/j/222222222?pwd=math75",
    zoom_start_url: "https://us05web.zoom.us/s/222222222?zak=startmath",
    zoom_password: "math75",
  },
  {
    session_id: "660e8400-e29b-41d4-a716-446655440002",
    teacher_id: "cmey4gxpx0000jt01teghjwom",
    session_type: "GROUP",
    title: "Algebra Crash Course",
    description: "Learn key algebraic concepts with problem-solving sessions.",
    start_time: new Date("2025-10-18T10:00:00Z"),
    end_time: new Date("2025-10-18T11:30:00Z"),
    status: "SCHEDULED",
    is_paid: false,
    price: null,
    max_attendees: 25,
    video_conference_link: "https://us05web.zoom.us/j/333333333?pwd=algfree",
    attendees_count: 12,
    zoom_meeting_id: "333333333",
    zoom_join_url: "https://us05web.zoom.us/j/333333333?pwd=algfree",
    zoom_start_url: "https://us05web.zoom.us/s/333333333?zak=startalg",
    zoom_password: "algfree",
  },
  {
    session_id: "660e8400-e29b-41d4-a716-446655440003",
    teacher_id: "teacher-uuid-456",
    session_type: "GROUP",
    title: "Physics Deep Dive",
    description: "Energy, motion, and wave principles with experiments.",
    start_time: new Date("2025-10-19T14:00:00Z"),
    end_time: new Date("2025-10-19T16:00:00Z"),
    status: "SCHEDULED",
    is_paid: true,
    price: 250.0,
    max_attendees: 20,
    video_conference_link: "https://us05web.zoom.us/j/444444444?pwd=phys250",
    attendees_count: 15,
    zoom_meeting_id: "444444444",
    zoom_join_url: "https://us05web.zoom.us/j/444444444?pwd=phys250",
    zoom_start_url: "https://us05web.zoom.us/s/444444444?zak=startphys",
    zoom_password: "phys250",
  },
  {
    session_id: "660e8400-e29b-41d4-a716-446655440004",
    teacher_id: "cmey4gxpx0000jt01teghjwom",
    session_type: "ONE_ON_ONE",
    title: "Exam Revision – Geometry",
    description: "Last-minute geometry recap with past paper questions.",
    start_time: new Date("2025-10-20T07:30:00Z"),
    end_time: new Date("2025-10-20T08:30:00Z"),
    status: "COMPLETED",
    is_paid: true,
    price: 60.0,
    max_attendees: 1,
    video_conference_link: "https://us05web.zoom.us/j/555555555?pwd=geo60",
    attendees_count: 1,
    zoom_meeting_id: "555555555",
    zoom_join_url: "https://us05web.zoom.us/j/555555555?pwd=geo60",
    zoom_start_url: "https://us05web.zoom.us/s/555555555?zak=startgeo",
    zoom_password: "geo60",
  },
];

/**
 * Fetches teacher availability for a given teacher
 * @param teacherId - The unique identifier of the teacher
 * @returns Promise with array of teacher availability slots
 */
export async function getTeacherAvailability(
  teacherId: string
): Promise<TeacherAvailability[]> {
  // TODO: Replace with actual API call
  // const response = await fetch(`/api/teachers/${teacherId}/availability`);
  // const data = await response.json();
  // return data;

  console.log("getTeacherAvailability called with teacherId:", teacherId);

  // For now, return mock data with a simulated delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return all mock availabilities for any teacher (for testing)
      // In production, filter by actual teacherId
      const filteredData = mockAvailabilities.filter(
        (availability) => availability.teacher_id === teacherId
      );

      console.log("Filtered availabilities:", filteredData);

      // If no matches found but teacherId is provided, return all for demo purposes
      if (filteredData.length === 0 && teacherId) {
        console.log("No matches found, returning all mock data for demo");
        resolve(mockAvailabilities);
      } else {
        resolve(filteredData);
      }
    }, 500); // Simulate network delay
  });
}

/**
 * Fetches sessions for the current user (student)
 * @returns Promise with array of user's booked sessions
 */
export async function getMySessions(): Promise<Session[]> {
  // TODO: Replace with actual API call
  // const response = await fetch('/api/sessions/my-sessions');
  // const data = await response.json();
  // return data;

  // For now, return mock data with a simulated delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockSessions);
    }, 300); // Simulate network delay
  });
}

// Types for booking parameters
export interface BookOneOnOneSessionParams {
  teacherId: string;
  availabilityId: string;
  startTime: string;
  endTime: string;
  price: number | null;
  isPaid: boolean;
  paymentDetails?: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
  } | null;
}

/**
 * Books a one-on-one session with a teacher
 * @param params - Booking parameters including teacher, slot, and payment details
 * @returns Promise with the created session details
 */
export async function BookOneOnOneSession(
  params: BookOneOnOneSessionParams
): Promise<Session> {
  console.log("====== BookOneOnOneSession Called ======");
  console.log("Teacher ID:", params.teacherId);
  console.log("Availability ID:", params.availabilityId);
  console.log("Start Time:", params.startTime);
  console.log("End Time:", params.endTime);
  console.log("Price:", params.price);
  console.log("Is Paid:", params.isPaid);
  console.log(
    "Payment Details:",
    params.paymentDetails ? "Provided" : "Not Required"
  );

  if (params.paymentDetails) {
    console.log("Card Holder:", params.paymentDetails.cardholderName);
    console.log(
      "Card Number (masked):",
      params.paymentDetails.cardNumber.replace(/\d(?=\d{4})/g, "*")
    );
  }

  console.log("=======================================");

  // TODO: Replace with actual API call
  // const response = await fetch('/api/sessions/book', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(params),
  // });
  // const data = await response.json();
  // return data;

  // For now, simulate the booking with a delay
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate successful booking
      const newSession: Session = {
        session_id: `session-${Date.now()}`,
        teacher_id: params.teacherId,
        session_type: "ONE_ON_ONE",
        title: "Booked Tutoring Session",
        description: "One-on-one learning session",
        start_time: new Date(params.startTime),
        end_time: new Date(params.endTime),
        status: "SCHEDULED",
        is_paid: params.isPaid,
        price: params.price,
        max_attendees: 1,
        video_conference_link: `https://us05web.zoom.us/j/${Math.random()
          .toString()
          .slice(2, 11)}`,
        attendees_count: 1,
        zoom_meeting_id: Math.random().toString().slice(2, 11),
        zoom_join_url: `https://us05web.zoom.us/j/${Math.random()
          .toString()
          .slice(2, 11)}`,
        zoom_start_url: `https://us05web.zoom.us/s/${Math.random()
          .toString()
          .slice(2, 11)}`,
        zoom_password: Math.random().toString(36).substring(2, 8),
      };

      console.log("✅ Session booked successfully!");
      console.log("Session ID:", newSession.session_id);
      console.log("Zoom Join URL:", newSession.zoom_join_url);

      resolve(newSession);
    }, 1000); // Simulate network delay
  });
}
