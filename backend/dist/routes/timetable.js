"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const algorithm_1 = require("../genetic/algorithm");
const constants_1 = require("../utils/constants");
const router = express_1.default.Router();
// In-memory storage (in production, use a database)
let subjects = [];
let faculties = [];
let classrooms = [];
let batches = [];
let generatedTimetables = [];
// Generate timetable using genetic algorithm
router.post('/generate', async (req, res) => {
    try {
        const { subjects: reqSubjects, faculties: reqFaculties, classrooms: reqClassrooms, batches: reqBatches, constraints = constants_1.DEFAULT_CONSTRAINTS, params = constants_1.DEFAULT_GENERATION_PARAMS } = req.body;
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
        const ga = new algorithm_1.GeneticAlgorithm(subjects, faculties, classrooms, batches, constants_1.DEFAULT_TIME_SLOTS, constraints, params);
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
    }
    catch (error) {
        console.error('Error generating timetable:', error);
        res.status(500).json({
            error: 'Failed to generate timetable',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Get all generated timetables
router.get('/timetables', (req, res) => {
    res.json({
        success: true,
        timetables: generatedTimetables
    });
});
// Get specific timetable by ID
router.get('/timetables/:id', (req, res) => {
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
router.get('/timetables/batch/:batchId', (req, res) => {
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
router.get('/timetables/faculty/:facultyId', (req, res) => {
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
router.get('/data', (req, res) => {
    res.json({
        success: true,
        data: {
            subjects,
            faculties,
            classrooms,
            batches,
            timeSlots: constants_1.DEFAULT_TIME_SLOTS
        }
    });
});
// Clear all data
router.delete('/data', (req, res) => {
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
exports.default = router;
//# sourceMappingURL=timetable.js.map