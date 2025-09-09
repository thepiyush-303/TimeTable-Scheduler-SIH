import { TimetableIndividual } from './individual';
import { Subject, Faculty, Classroom, Batch, TimeSlot, GenerationParams, TimetableConstraints } from '../models';
export declare class GeneticAlgorithm {
    private subjects;
    private faculties;
    private classrooms;
    private batches;
    private timeSlots;
    private constraints;
    private params;
    constructor(subjects: Subject[], faculties: Faculty[], classrooms: Classroom[], batches: Batch[], timeSlots: TimeSlot[], constraints: TimetableConstraints, params: GenerationParams);
    generateInitialPopulation(): TimetableIndividual[];
    private createRandomIndividual;
    private generateRequiredEntries;
    private createRandomEntry;
    evolve(): TimetableIndividual;
    private tournamentSelection;
    private crossover;
    private mutate;
}
//# sourceMappingURL=algorithm.d.ts.map