export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  hoursPerWeek: number;
  semester: number;
  type: 'UG' | 'PG';
}

export interface Faculty {
  id: string;
  name: string;
  department: string;
  availableSlots: TimeSlot[];
  subjects: string[]; // Subject IDs
  maxHoursPerDay: number;
  maxHoursPerWeek: number;
}

export interface Classroom {
  id: string;
  name: string;
  capacity: number;
  type: 'lecture' | 'lab' | 'tutorial';
  equipment: string[];
}

export interface Batch {
  id: string;
  name: string;
  semester: number;
  strength: number;
  subjects: string[]; // Subject IDs
  type: 'UG' | 'PG';
}

export interface TimeSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  duration: number; // minutes
}

export interface TimetableEntry {
  id: string;
  subject: Subject;
  faculty: Faculty;
  classroom: Classroom;
  batch: Batch;
  timeSlot: TimeSlot;
}

export interface Timetable {
  id: string;
  entries: TimetableEntry[];
  fitness: number;
  conflicts: Conflict[];
}

export interface Conflict {
  type: 'faculty_clash' | 'classroom_clash' | 'batch_clash' | 'invalid_slot';
  description: string;
  entries: string[]; // TimetableEntry IDs
}

export interface GenerationParams {
  populationSize: number;
  generations: number;
  mutationRate: number;
  crossoverRate: number;
  elitismCount: number;
}

export interface TimetableConstraints {
  maxClassesPerDay: number;
  minBreakBetweenClasses: number; // minutes
  preferredTimeSlots: TimeSlot[];
  blackoutSlots: TimeSlot[];
}