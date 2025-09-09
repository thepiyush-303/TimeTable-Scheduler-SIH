import { Timetable, TimetableEntry, Conflict, TimetableConstraints } from '../models';
export declare class TimetableIndividual {
    id: string;
    entries: TimetableEntry[];
    fitness: number;
    conflicts: Conflict[];
    constructor(entries?: TimetableEntry[]);
    calculateFitness(constraints: TimetableConstraints): number;
    private checkFacultyConflicts;
    private checkClassroomConflicts;
    private checkBatchConflicts;
    private checkTimeSlotValidation;
    private calculateDistributionBonus;
    clone(): TimetableIndividual;
    toTimetable(): Timetable;
}
//# sourceMappingURL=individual.d.ts.map