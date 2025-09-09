"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneticAlgorithm = void 0;
const uuid_1 = require("uuid");
const individual_1 = require("./individual");
class GeneticAlgorithm {
    constructor(subjects, faculties, classrooms, batches, timeSlots, constraints, params) {
        this.subjects = subjects;
        this.faculties = faculties;
        this.classrooms = classrooms;
        this.batches = batches;
        this.timeSlots = timeSlots;
        this.constraints = constraints;
        this.params = params;
    }
    // Generate initial population
    generateInitialPopulation() {
        const population = [];
        for (let i = 0; i < this.params.populationSize; i++) {
            const individual = this.createRandomIndividual();
            population.push(individual);
        }
        return population;
    }
    // Create a random timetable individual
    createRandomIndividual() {
        const entries = [];
        const requiredEntries = this.generateRequiredEntries();
        for (const requirement of requiredEntries) {
            const entry = this.createRandomEntry(requirement);
            if (entry) {
                entries.push(entry);
            }
        }
        const individual = new individual_1.TimetableIndividual(entries);
        individual.calculateFitness(this.constraints);
        return individual;
    }
    // Generate all required timetable entries based on subjects and batches
    generateRequiredEntries() {
        const requirements = [];
        for (const batch of this.batches) {
            for (const subjectId of batch.subjects) {
                const subject = this.subjects.find(s => s.id === subjectId);
                if (subject) {
                    // Calculate sessions needed per week based on hours per week
                    const sessionsNeeded = Math.ceil(subject.hoursPerWeek / 1); // Assuming 1-hour sessions
                    requirements.push({ subject, batch, sessionsNeeded });
                }
            }
        }
        return requirements;
    }
    // Create a random timetable entry for given requirement
    createRandomEntry(requirement) {
        const { subject, batch } = requirement;
        // Find suitable faculty
        const suitableFaculties = this.faculties.filter(f => f.subjects.includes(subject.id));
        if (suitableFaculties.length === 0)
            return null;
        const faculty = suitableFaculties[Math.floor(Math.random() * suitableFaculties.length)];
        // Find suitable classroom
        const suitableClassrooms = this.classrooms.filter(c => c.capacity >= batch.strength);
        if (suitableClassrooms.length === 0)
            return null;
        const classroom = suitableClassrooms[Math.floor(Math.random() * suitableClassrooms.length)];
        // Find suitable time slot
        const timeSlot = this.timeSlots[Math.floor(Math.random() * this.timeSlots.length)];
        return {
            id: (0, uuid_1.v4)(),
            subject,
            faculty,
            classroom,
            batch,
            timeSlot
        };
    }
    // Run the genetic algorithm
    evolve() {
        let population = this.generateInitialPopulation();
        let generation = 0;
        console.log(`Starting evolution with population size: ${this.params.populationSize}`);
        while (generation < this.params.generations) {
            // Calculate fitness for all individuals
            population.forEach(individual => individual.calculateFitness(this.constraints));
            // Sort by fitness (higher is better)
            population.sort((a, b) => b.fitness - a.fitness);
            const bestFitness = population[0].fitness;
            console.log(`Generation ${generation}: Best fitness = ${bestFitness}`);
            // Check for perfect solution
            if (bestFitness >= 1000 && population[0].conflicts.length === 0) {
                console.log(`Perfect solution found at generation ${generation}`);
                break;
            }
            // Create new population
            const newPopulation = [];
            // Elitism - keep best individuals
            for (let i = 0; i < this.params.elitismCount; i++) {
                newPopulation.push(population[i].clone());
            }
            // Generate offspring through crossover and mutation
            while (newPopulation.length < this.params.populationSize) {
                const parent1 = this.tournamentSelection(population);
                const parent2 = this.tournamentSelection(population);
                let offspring1;
                let offspring2;
                if (Math.random() < this.params.crossoverRate) {
                    [offspring1, offspring2] = this.crossover(parent1, parent2);
                }
                else {
                    offspring1 = parent1.clone();
                    offspring2 = parent2.clone();
                }
                if (Math.random() < this.params.mutationRate) {
                    this.mutate(offspring1);
                }
                if (Math.random() < this.params.mutationRate) {
                    this.mutate(offspring2);
                }
                newPopulation.push(offspring1);
                if (newPopulation.length < this.params.populationSize) {
                    newPopulation.push(offspring2);
                }
            }
            population = newPopulation;
            generation++;
        }
        // Return the best individual
        population.forEach(individual => individual.calculateFitness(this.constraints));
        population.sort((a, b) => b.fitness - a.fitness);
        console.log(`Evolution completed. Final best fitness: ${population[0].fitness}`);
        return population[0];
    }
    // Tournament selection
    tournamentSelection(population, tournamentSize = 3) {
        const tournament = [];
        for (let i = 0; i < tournamentSize; i++) {
            const randomIndex = Math.floor(Math.random() * population.length);
            tournament.push(population[randomIndex]);
        }
        tournament.sort((a, b) => b.fitness - a.fitness);
        return tournament[0];
    }
    // Single-point crossover
    crossover(parent1, parent2) {
        const crossoverPoint = Math.floor(Math.random() * Math.min(parent1.entries.length, parent2.entries.length));
        const offspring1Entries = [
            ...parent1.entries.slice(0, crossoverPoint),
            ...parent2.entries.slice(crossoverPoint)
        ];
        const offspring2Entries = [
            ...parent2.entries.slice(0, crossoverPoint),
            ...parent1.entries.slice(crossoverPoint)
        ];
        return [
            new individual_1.TimetableIndividual(offspring1Entries),
            new individual_1.TimetableIndividual(offspring2Entries)
        ];
    }
    // Mutation operation
    mutate(individual) {
        if (individual.entries.length === 0)
            return;
        const mutationIndex = Math.floor(Math.random() * individual.entries.length);
        const entry = individual.entries[mutationIndex];
        // Randomly choose what to mutate
        const mutationType = Math.floor(Math.random() * 3);
        switch (mutationType) {
            case 0: // Mutate faculty
                const suitableFaculties = this.faculties.filter(f => f.subjects.includes(entry.subject.id));
                if (suitableFaculties.length > 1) {
                    const newFaculty = suitableFaculties[Math.floor(Math.random() * suitableFaculties.length)];
                    entry.faculty = newFaculty;
                }
                break;
            case 1: // Mutate classroom
                const suitableClassrooms = this.classrooms.filter(c => c.capacity >= entry.batch.strength);
                if (suitableClassrooms.length > 1) {
                    const newClassroom = suitableClassrooms[Math.floor(Math.random() * suitableClassrooms.length)];
                    entry.classroom = newClassroom;
                }
                break;
            case 2: // Mutate time slot
                const newTimeSlot = this.timeSlots[Math.floor(Math.random() * this.timeSlots.length)];
                entry.timeSlot = newTimeSlot;
                break;
        }
    }
}
exports.GeneticAlgorithm = GeneticAlgorithm;
//# sourceMappingURL=algorithm.js.map