"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimetableIndividual = void 0;
const uuid_1 = require("uuid");
class TimetableIndividual {
    constructor(entries = []) {
        this.fitness = 0;
        this.conflicts = [];
        this.id = (0, uuid_1.v4)();
        this.entries = entries;
    }
    // Calculate fitness based on constraints satisfaction
    calculateFitness(constraints) {
        this.conflicts = [];
        let fitnessScore = 1000; // Start with perfect score
        // Check for conflicts and reduce fitness
        this.checkFacultyConflicts();
        this.checkClassroomConflicts();
        this.checkBatchConflicts();
        this.checkTimeSlotValidation(constraints);
        // Reduce fitness for each conflict
        fitnessScore -= this.conflicts.length * 10;
        // Bonus for optimal distribution
        fitnessScore += this.calculateDistributionBonus(constraints);
        this.fitness = Math.max(0, fitnessScore);
        return this.fitness;
    }
    checkFacultyConflicts() {
        const facultySlots = new Map();
        for (const entry of this.entries) {
            const facultyId = entry.faculty.id;
            const slotKey = `${entry.timeSlot.day}-${entry.timeSlot.startTime}`;
            if (!facultySlots.has(facultyId)) {
                facultySlots.set(facultyId, new Set());
            }
            if (facultySlots.get(facultyId).has(slotKey)) {
                this.conflicts.push({
                    type: 'faculty_clash',
                    description: `Faculty ${entry.faculty.name} has multiple classes at ${slotKey}`,
                    entries: [entry.id]
                });
            }
            else {
                facultySlots.get(facultyId).add(slotKey);
            }
        }
    }
    checkClassroomConflicts() {
        const classroomSlots = new Map();
        for (const entry of this.entries) {
            const classroomId = entry.classroom.id;
            const slotKey = `${entry.timeSlot.day}-${entry.timeSlot.startTime}`;
            if (!classroomSlots.has(classroomId)) {
                classroomSlots.set(classroomId, new Set());
            }
            if (classroomSlots.get(classroomId).has(slotKey)) {
                this.conflicts.push({
                    type: 'classroom_clash',
                    description: `Classroom ${entry.classroom.name} has multiple classes at ${slotKey}`,
                    entries: [entry.id]
                });
            }
            else {
                classroomSlots.get(classroomId).add(slotKey);
            }
        }
    }
    checkBatchConflicts() {
        const batchSlots = new Map();
        for (const entry of this.entries) {
            const batchId = entry.batch.id;
            const slotKey = `${entry.timeSlot.day}-${entry.timeSlot.startTime}`;
            if (!batchSlots.has(batchId)) {
                batchSlots.set(batchId, new Set());
            }
            if (batchSlots.get(batchId).has(slotKey)) {
                this.conflicts.push({
                    type: 'batch_clash',
                    description: `Batch ${entry.batch.name} has multiple classes at ${slotKey}`,
                    entries: [entry.id]
                });
            }
            else {
                batchSlots.get(batchId).add(slotKey);
            }
        }
    }
    checkTimeSlotValidation(constraints) {
        // Check if faculty is available for assigned slots
        for (const entry of this.entries) {
            const facultyAvailable = entry.faculty.availableSlots.some(slot => slot.day === entry.timeSlot.day &&
                slot.startTime <= entry.timeSlot.startTime &&
                slot.endTime >= entry.timeSlot.endTime);
            if (!facultyAvailable) {
                this.conflicts.push({
                    type: 'invalid_slot',
                    description: `Faculty ${entry.faculty.name} not available at ${entry.timeSlot.day} ${entry.timeSlot.startTime}`,
                    entries: [entry.id]
                });
            }
        }
        // Check classroom capacity
        for (const entry of this.entries) {
            if (entry.classroom.capacity < entry.batch.strength) {
                this.conflicts.push({
                    type: 'invalid_slot',
                    description: `Classroom ${entry.classroom.name} capacity insufficient for batch ${entry.batch.name}`,
                    entries: [entry.id]
                });
            }
        }
    }
    calculateDistributionBonus(constraints) {
        let bonus = 0;
        // Bonus for even distribution of classes across days
        const classesByDay = new Map();
        for (const entry of this.entries) {
            const day = entry.timeSlot.day;
            classesByDay.set(day, (classesByDay.get(day) || 0) + 1);
        }
        const avgClassesPerDay = this.entries.length / 6; // 6 working days
        for (const [day, count] of classesByDay) {
            const deviation = Math.abs(count - avgClassesPerDay);
            bonus += Math.max(0, 10 - deviation); // Lower deviation = higher bonus
        }
        return bonus;
    }
    // Create a deep copy of the individual
    clone() {
        const clonedEntries = this.entries.map(entry => ({ ...entry }));
        const clone = new TimetableIndividual(clonedEntries);
        clone.fitness = this.fitness;
        return clone;
    }
    // Convert to Timetable format
    toTimetable() {
        return {
            id: this.id,
            entries: this.entries,
            fitness: this.fitness,
            conflicts: this.conflicts
        };
    }
}
exports.TimetableIndividual = TimetableIndividual;
//# sourceMappingURL=individual.js.map