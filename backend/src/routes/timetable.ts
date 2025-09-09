import express, { Request, Response } from 'express';
import { GeneticAlgorithm } from '../genetic/algorithm';
import {
  Subject,
  Faculty,
  Classroom,
  Batch,
  GenerationParams,
  TimetableConstraints,
  Timetable
} from '../models';
import { DEFAULT_TIME_SLOTS, DEFAULT_GENERATION_PARAMS, DEFAULT_CONSTRAINTS } from '../utils/constants';

const router = express.Router();

// In-memory storage (in production, use a database)
let subjects: Subject[] = [];
let faculties: Faculty[] = [];
let classrooms: Classroom[] = [];
let batches: Batch[] = [];
let generatedTimetables: Timetable[] = [];

// Generate timetable using genetic algorithm
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const {
      subjects: reqSubjects,
      faculties: reqFaculties,
      classrooms: reqClassrooms,
      batches: reqBatches,
      constraints = DEFAULT_CONSTRAINTS,
      params = DEFAULT_GENERATION_PARAMS
    } = req.body;

    // Validate required data
    if (!reqSubjects || !reqFaculties || !reqClassrooms || !reqBatches) {
      return res.status(400).json({
        error: 'Missing required data: subjects, faculties, classrooms, and batches are required'
      });
    }

    // Store data
    subjects = reqSubjects;
    faculties = reqFaculties;
    classrooms = reqClassrooms;
    batches = reqBatches;

    // Initialize genetic algorithm
    const ga = new GeneticAlgorithm(
      subjects,
      faculties,
      classrooms,
      batches,
      DEFAULT_TIME_SLOTS,
      constraints,
      params
    );

    // Generate timetable
    console.log('Starting timetable generation...');
    const bestIndividual = ga.evolve();
    const timetable = bestIndividual.toTimetable();

    // Store generated timetable
    generatedTimetables.push(timetable);

    res.json({
      success: true,
      timetable,
      statistics: {
        fitness: timetable.fitness,
        conflicts: timetable.conflicts.length,
        totalEntries: timetable.entries.length
      }
    });
  } catch (error) {
    console.error('Error generating timetable:', error);
    res.status(500).json({
      error: 'Failed to generate timetable',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get all generated timetables
router.get('/timetables', (req: Request, res: Response) => {
  res.json({
    success: true,
    timetables: generatedTimetables
  });
});

// Get specific timetable by ID
router.get('/timetables/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const timetable = generatedTimetables.find(t => t.id === id);

  if (!timetable) {
    return res.status(404).json({
      error: 'Timetable not found'
    });
  }

  res.json({
    success: true,
    timetable
  });
});

// Get timetable for specific batch
router.get('/timetables/batch/:batchId', (req: Request, res: Response) => {
  const { batchId } = req.params;
  
  const batchTimetables = generatedTimetables.map(timetable => ({
    ...timetable,
    entries: timetable.entries.filter(entry => entry.batch.id === batchId)
  })).filter(timetable => timetable.entries.length > 0);

  res.json({
    success: true,
    timetables: batchTimetables
  });
});

// Get timetable for specific faculty
router.get('/timetables/faculty/:facultyId', (req: Request, res: Response) => {
  const { facultyId } = req.params;
  
  const facultyTimetables = generatedTimetables.map(timetable => ({
    ...timetable,
    entries: timetable.entries.filter(entry => entry.faculty.id === facultyId)
  })).filter(timetable => timetable.entries.length > 0);

  res.json({
    success: true,
    timetables: facultyTimetables
  });
});

// Get current stored data
router.get('/data', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      subjects,
      faculties,
      classrooms,
      batches,
      timeSlots: DEFAULT_TIME_SLOTS
    }
  });
});

// Clear all data
router.delete('/data', (req: Request, res: Response) => {
  subjects = [];
  faculties = [];
  classrooms = [];
  batches = [];
  generatedTimetables = [];

  res.json({
    success: true,
    message: 'All data cleared successfully'
  });
});

export default router;