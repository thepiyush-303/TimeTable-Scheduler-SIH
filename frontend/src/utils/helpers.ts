import { v4 as uuidv4 } from 'uuid';
import { Subject, Faculty, Classroom, Batch, TimeSlot } from '../types';

export const generateId = () => uuidv4();

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

export const TIME_SLOTS = [
  '09:00', '10:00', '11:30', '12:30', '14:30', '15:30'
];

export const DEFAULT_TIME_SLOTS: TimeSlot[] = DAYS.flatMap((day, dayIndex) =>
  TIME_SLOTS.map((startTime, slotIndex) => {
    const startHour = parseInt(startTime.split(':')[0]);
    const endTime = `${(startHour + 1).toString().padStart(2, '0')}:${startTime.split(':')[1]}`;
    
    return {
      id: `${dayIndex * TIME_SLOTS.length + slotIndex + 1}`,
      day,
      startTime,
      endTime,
      duration: 60
    };
  })
);

export const SAMPLE_SUBJECTS: Subject[] = [
  {
    id: generateId(),
    name: 'Data Structures and Algorithms',
    code: 'CS201',
    credits: 4,
    hoursPerWeek: 4,
    semester: 3,
    type: 'UG'
  },
  {
    id: generateId(),
    name: 'Database Management Systems',
    code: 'CS301',
    credits: 3,
    hoursPerWeek: 3,
    semester: 5,
    type: 'UG'
  },
  {
    id: generateId(),
    name: 'Machine Learning',
    code: 'CS401',
    credits: 4,
    hoursPerWeek: 4,
    semester: 7,
    type: 'UG'
  },
  {
    id: generateId(),
    name: 'Advanced Algorithms',
    code: 'PG501',
    credits: 3,
    hoursPerWeek: 3,
    semester: 1,
    type: 'PG'
  }
];

export const SAMPLE_CLASSROOMS: Classroom[] = [
  {
    id: generateId(),
    name: 'Room A101',
    capacity: 60,
    type: 'lecture',
    equipment: ['Projector', 'Whiteboard', 'AC']
  },
  {
    id: generateId(),
    name: 'Lab B201',
    capacity: 30,
    type: 'lab',
    equipment: ['Computers', 'Projector', 'AC']
  },
  {
    id: generateId(),
    name: 'Room C301',
    capacity: 80,
    type: 'lecture',
    equipment: ['Smart Board', 'AC', 'Sound System']
  },
  {
    id: generateId(),
    name: 'Tutorial Room D401',
    capacity: 25,
    type: 'tutorial',
    equipment: ['Whiteboard', 'AC']
  }
];

export const createSampleFaculties = (subjects: Subject[]): Faculty[] => [
  {
    id: generateId(),
    name: 'Dr. John Smith',
    department: 'Computer Science',
    availableSlots: DEFAULT_TIME_SLOTS.filter(slot => 
      ['Monday', 'Tuesday', 'Wednesday'].includes(slot.day)
    ),
    subjects: subjects.filter(s => ['CS201', 'CS301'].includes(s.code)).map(s => s.id),
    maxHoursPerDay: 6,
    maxHoursPerWeek: 20
  },
  {
    id: generateId(),
    name: 'Prof. Alice Johnson',
    department: 'Computer Science',
    availableSlots: DEFAULT_TIME_SLOTS.filter(slot => 
      ['Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(slot.day)
    ),
    subjects: subjects.filter(s => ['CS401', 'PG501'].includes(s.code)).map(s => s.id),
    maxHoursPerDay: 5,
    maxHoursPerWeek: 18
  },
  {
    id: generateId(),
    name: 'Dr. Robert Brown',
    department: 'Computer Science',
    availableSlots: DEFAULT_TIME_SLOTS,
    subjects: subjects.map(s => s.id), // Can teach all subjects
    maxHoursPerDay: 6,
    maxHoursPerWeek: 25
  }
];

export const createSampleBatches = (subjects: Subject[]): Batch[] => [
  {
    id: generateId(),
    name: 'CS-3A',
    semester: 3,
    strength: 50,
    subjects: subjects.filter(s => s.semester === 3).map(s => s.id),
    type: 'UG'
  },
  {
    id: generateId(),
    name: 'CS-5B',
    semester: 5,
    strength: 45,
    subjects: subjects.filter(s => s.semester === 5).map(s => s.id),
    type: 'UG'
  },
  {
    id: generateId(),
    name: 'CS-7A',
    semester: 7,
    strength: 40,
    subjects: subjects.filter(s => s.semester === 7).map(s => s.id),
    type: 'UG'
  },
  {
    id: generateId(),
    name: 'PG-M1',
    semester: 1,
    strength: 25,
    subjects: subjects.filter(s => s.type === 'PG').map(s => s.id),
    type: 'PG'
  }
];

export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${minutes} ${period}`;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};