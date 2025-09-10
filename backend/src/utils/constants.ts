import { TimeSlot } from '../models';

export const DEFAULT_TIME_SLOTS: TimeSlot[] = [
  { id: '1', day: 'Monday', startTime: '09:00', endTime: '10:00', duration: 60 },
  { id: '2', day: 'Monday', startTime: '10:00', endTime: '11:00', duration: 60 },
  { id: '3', day: 'Monday', startTime: '11:30', endTime: '12:30', duration: 60 },
  { id: '4', day: 'Monday', startTime: '12:30', endTime: '13:30', duration: 60 },
  { id: '5', day: 'Monday', startTime: '14:30', endTime: '15:30', duration: 60 },
  { id: '6', day: 'Monday', startTime: '15:30', endTime: '16:30', duration: 60 },

  { id: '7', day: 'Tuesday', startTime: '09:00', endTime: '10:00', duration: 60 },
  { id: '8', day: 'Tuesday', startTime: '10:00', endTime: '11:00', duration: 60 },
  { id: '9', day: 'Tuesday', startTime: '11:30', endTime: '12:30', duration: 60 },
  { id: '10', day: 'Tuesday', startTime: '12:30', endTime: '13:30', duration: 60 },
  { id: '11', day: 'Tuesday', startTime: '14:30', endTime: '15:30', duration: 60 },
  { id: '12', day: 'Tuesday', startTime: '15:30', endTime: '16:30', duration: 60 },

  { id: '13', day: 'Wednesday', startTime: '09:00', endTime: '10:00', duration: 60 },
  { id: '14', day: 'Wednesday', startTime: '10:00', endTime: '11:00', duration: 60 },
  { id: '15', day: 'Wednesday', startTime: '11:30', endTime: '12:30', duration: 60 },
  { id: '16', day: 'Wednesday', startTime: '12:30', endTime: '13:30', duration: 60 },
  { id: '17', day: 'Wednesday', startTime: '14:30', endTime: '15:30', duration: 60 },
  { id: '18', day: 'Wednesday', startTime: '15:30', endTime: '16:30', duration: 60 },

  { id: '19', day: 'Thursday', startTime: '09:00', endTime: '10:00', duration: 60 },
  { id: '20', day: 'Thursday', startTime: '10:00', endTime: '11:00', duration: 60 },
  { id: '21', day: 'Thursday', startTime: '11:30', endTime: '12:30', duration: 60 },
  { id: '22', day: 'Thursday', startTime: '12:30', endTime: '13:30', duration: 60 },
  { id: '23', day: 'Thursday', startTime: '14:30', endTime: '15:30', duration: 60 },
  { id: '24', day: 'Thursday', startTime: '15:30', endTime: '16:30', duration: 60 },

  { id: '25', day: 'Friday', startTime: '09:00', endTime: '10:00', duration: 60 },
  { id: '26', day: 'Friday', startTime: '10:00', endTime: '11:00', duration: 60 },
  { id: '27', day: 'Friday', startTime: '11:30', endTime: '12:30', duration: 60 },
  { id: '28', day: 'Friday', startTime: '12:30', endTime: '13:30', duration: 60 },
  { id: '29', day: 'Friday', startTime: '14:30', endTime: '15:30', duration: 60 },
  { id: '30', day: 'Friday', startTime: '15:30', endTime: '16:30', duration: 60 },

  { id: '31', day: 'Saturday', startTime: '09:00', endTime: '10:00', duration: 60 },
  { id: '32', day: 'Saturday', startTime: '10:00', endTime: '11:00', duration: 60 },
  { id: '33', day: 'Saturday', startTime: '11:30', endTime: '12:30', duration: 60 },
  { id: '34', day: 'Saturday', startTime: '12:30', endTime: '13:30', duration: 60 }
];

export const DEFAULT_GENERATION_PARAMS = {
  populationSize: 50,
  generations: 100,
  mutationRate: 0.1,
  crossoverRate: 0.8,
  elitismCount: 5
};

export const DEFAULT_CONSTRAINTS = {
  maxClassesPerDay: 6,
  minBreakBetweenClasses: 30,
  preferredTimeSlots: [],
  blackoutSlots: []
};

export function validateTimeSlot(timeSlot: TimeSlot): boolean {
  const startHour = parseInt(timeSlot.startTime.split(':')[0]);
  const endHour = parseInt(timeSlot.endTime.split(':')[0]);
  
  // Classes should be between 9 AM and 5 PM
  return startHour >= 9 && endHour <= 17 && startHour < endHour;
}

export function isTimeSlotConflict(slot1: TimeSlot, slot2: TimeSlot): boolean {
  if (slot1.day !== slot2.day) return false;
  
  const start1 = timeToMinutes(slot1.startTime);
  const end1 = timeToMinutes(slot1.endTime);
  const start2 = timeToMinutes(slot2.startTime);
  const end2 = timeToMinutes(slot2.endTime);
  
  return !(end1 <= start2 || end2 <= start1);
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}