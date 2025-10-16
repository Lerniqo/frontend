/**
 * Utility functions for detecting conflicts between availability slots and sessions
 */

import { AvailabilitySlot } from "@/services/teacherDashboardService";
import { TeacherSession } from "@/services/teacherDashboardService";

/**
 * Represents a time range for conflict detection
 */
interface TimeRange {
  startTime: Date;
  endTime: Date;
}

/**
 * Parses an availability slot into a TimeRange for comparison
 * @param slot - The availability slot
 * @returns TimeRange object with Date objects
 */
const parseSlotToTimeRange = (slot: AvailabilitySlot): TimeRange => {
  const [year, month, day] = slot.date.split("-");
  const [startHour, startMin] = slot.startTime.split(":");
  const [endHour, endMin] = slot.endTime.split(":");

  const startTime = new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    parseInt(startHour),
    parseInt(startMin),
    0,
    0
  );

  const endTime = new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    parseInt(endHour),
    parseInt(endMin),
    0,
    0
  );

  return { startTime, endTime };
};

/**
 * Checks if two time ranges overlap
 * @param range1 - First time range
 * @param range2 - Second time range
 * @returns True if ranges overlap, false otherwise
 */
const doTimeRangesOverlap = (range1: TimeRange, range2: TimeRange): boolean => {
  return range1.startTime < range2.endTime && range1.endTime > range2.startTime;
};

/**
 * Detects conflicts between a new availability slot and existing availability slots
 * @param newSlot - The new slot being added
 * @param existingSlots - Array of existing availability slots
 * @returns Array of conflicting slot information or empty if no conflicts
 */
export const detectAvailabilityConflicts = (
  newSlot: AvailabilitySlot,
  existingSlots: AvailabilitySlot[]
): { conflict: boolean; message: string } => {
  const newRange = parseSlotToTimeRange(newSlot);

  for (const existingSlot of existingSlots) {
    // Skip the slot itself if it has the same ID (when editing)
    if (existingSlot.id === newSlot.id) {
      continue;
    }

    const existingRange = parseSlotToTimeRange(existingSlot);

    if (doTimeRangesOverlap(newRange, existingRange)) {
      return {
        conflict: true,
        message: `This slot overlaps with existing availability on ${existingSlot.day} from ${existingSlot.startTime} to ${existingSlot.endTime}`,
      };
    }
  }

  return { conflict: false, message: "" };
};

/**
 * Detects conflicts between a new availability slot and existing sessions
 * @param newSlot - The new slot being added
 * @param sessions - Array of existing sessions (one-on-one and group)
 * @returns Conflict status and message
 */
export const detectSessionConflicts = (
  newSlot: AvailabilitySlot,
  sessions: TeacherSession[]
): { conflict: boolean; message: string } => {
  const newRange = parseSlotToTimeRange(newSlot);

  // Filter only scheduled or ongoing sessions (not cancelled or completed)
  const activeOrScheduledSessions = sessions.filter(
    (session) =>
      session.status === "SCHEDULED" || session.status === "COMPLETED"
  );

  for (const session of activeOrScheduledSessions) {
    const sessionStartTime = new Date(session.start_time);
    const sessionEndTime = new Date(session.end_time);

    if (
      newRange.startTime < sessionEndTime &&
      newRange.endTime > sessionStartTime
    ) {
      const sessionType =
        session.session_type === "ONE_ON_ONE" ? "1-on-1" : "Group";
      return {
        conflict: true,
        message: `This slot overlaps with your ${sessionType} session "${
          session.title
        }" scheduled from ${sessionStartTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })} to ${sessionEndTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}`,
      };
    }
  }

  return { conflict: false, message: "" };
};

/**
 * Comprehensive conflict detection for adding a new availability slot
 * Checks for conflicts with existing availability and sessions
 * @param newSlot - The new slot being added
 * @param existingSlots - Array of existing availability slots
 * @param sessions - Array of existing sessions
 * @returns Conflict status and message
 */
export const detectAllConflicts = (
  newSlot: AvailabilitySlot,
  existingSlots: AvailabilitySlot[],
  sessions: TeacherSession[]
): { conflict: boolean; message: string } => {
  // Check availability conflicts first
  const availabilityConflict = detectAvailabilityConflicts(
    newSlot,
    existingSlots
  );
  if (availabilityConflict.conflict) {
    return availabilityConflict;
  }

  // Check session conflicts
  const sessionConflict = detectSessionConflicts(newSlot, sessions);
  if (sessionConflict.conflict) {
    return sessionConflict;
  }

  return { conflict: false, message: "" };
};
