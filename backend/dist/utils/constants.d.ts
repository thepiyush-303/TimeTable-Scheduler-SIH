import { TimeSlot } from '../models';
export declare const DEFAULT_TIME_SLOTS: TimeSlot[];
export declare const DEFAULT_GENERATION_PARAMS: {
    populationSize: number;
    generations: number;
    mutationRate: number;
    crossoverRate: number;
    elitismCount: number;
};
export declare const DEFAULT_CONSTRAINTS: {
    maxClassesPerDay: number;
    minBreakBetweenClasses: number;
    preferredTimeSlots: never[];
    blackoutSlots: never[];
};
export declare function validateTimeSlot(timeSlot: TimeSlot): boolean;
export declare function isTimeSlotConflict(slot1: TimeSlot, slot2: TimeSlot): boolean;
//# sourceMappingURL=constants.d.ts.map