# TimeTable Scheduler - SIH

An intelligent time-table scheduler for UG and PG courses that utilizes genetic algorithms for optimized scheduling. This application considers multiple parameters to create conflict-free, optimized timetables for academic institutions.

## Features

### Genetic Algorithm Optimization
- **Population-based Evolution**: Uses genetic algorithms to evolve optimal timetable solutions
- **Fitness Function**: Evaluates timetables based on constraint satisfaction and optimization criteria
- **Constraint Handling**: Handles faculty availability, classroom capacity, batch requirements, and scheduling conflicts
- **Configurable Parameters**: Customizable population size, generations, mutation rate, and crossover rate

### Supported Parameters
- **Number of classes per day**: Configurable maximum classes per day
- **Classrooms**: Multiple classroom types (lecture halls, labs, tutorial rooms) with capacity constraints
- **Student Batches**: Support for both UG and PG batches with varying strengths
- **Subjects**: Comprehensive subject management with credits, hours per week, and semester mapping
- **Faculty Availability**: Flexible faculty scheduling with availability slots and subject assignments
- **Time Slots**: Customizable time slots across weekdays

### Technologies Used
- **Backend**: TypeScript, Node.js, Express.js
- **Frontend**: React with TypeScript, Material-UI
- **Algorithm**: Custom Genetic Algorithm implementation
- **API**: RESTful API design with CORS support

## Project Structure

```
TimeTable-Scheduler-SIH/
├── backend/                 # TypeScript Backend
│   ├── src/
│   │   ├── genetic/        # Genetic Algorithm Implementation
│   │   ├── models/         # Data Models
│   │   ├── routes/         # API Routes
│   │   └── utils/          # Utility Functions
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # React TypeScript Frontend
│   ├── src/
│   │   ├── components/     # React Components
│   │   ├── services/       # API Services
│   │   ├── types/          # TypeScript Types
│   │   └── utils/          # Helper Functions
│   ├── package.json
│   └── tsconfig.json
├── package.json            # Root package.json for dev scripts
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/thepiyush-303/TimeTable-Scheduler-SIH.git
   cd TimeTable-Scheduler-SIH
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Start both backend and frontend**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend API on `http://localhost:3001`
   - Frontend React app on `http://localhost:3000`

### Manual Setup

#### Backend Setup
```bash
cd backend
npm install
npm run build
npm run dev
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## API Endpoints

### Timetable Management
- `POST /api/timetable/generate` - Generate optimized timetable
- `GET /api/timetable/timetables` - Get all generated timetables
- `GET /api/timetable/timetables/:id` - Get specific timetable
- `GET /api/timetable/timetables/batch/:batchId` - Get timetable for specific batch
- `GET /api/timetable/timetables/faculty/:facultyId` - Get timetable for specific faculty
- `GET /api/timetable/data` - Get current stored data
- `DELETE /api/timetable/data` - Clear all data

### Health Check
- `GET /health` - API health status

## Usage

### 1. Configure Input Data
- **Subjects**: Add subjects with course codes, credits, hours per week, and semester
- **Faculty**: The system automatically configures faculty with subject assignments
- **Classrooms**: Pre-configured with various capacity and types
- **Batches**: Pre-configured student batches for different semesters

### 2. Generate Timetable
- Click "Generate Timetable" to start the genetic algorithm optimization
- The algorithm will evolve through multiple generations to find the optimal solution
- Monitor the fitness score and conflict count in real-time

### 3. View Results
- **Fitness Score**: Higher scores indicate better optimization (max 1000)
- **Conflicts**: View any scheduling conflicts that need resolution
- **Timetable Grid**: Visual representation of the weekly schedule
- **Statistics**: Summary of total classes and optimization metrics

## Genetic Algorithm Details

### Algorithm Components
1. **Individual Representation**: Each timetable is represented as a collection of time-slot assignments
2. **Population**: Set of candidate timetable solutions
3. **Fitness Function**: Evaluates based on:
   - Conflict avoidance (faculty, classroom, batch clashes)
   - Constraint satisfaction (availability, capacity)
   - Distribution optimization (even spread across days)
4. **Selection**: Tournament selection for parent individuals
5. **Crossover**: Single-point crossover to combine parent solutions
6. **Mutation**: Random modification of assignments to maintain diversity

### Configurable Parameters
- **Population Size**: Number of candidate solutions (default: 30)
- **Generations**: Number of evolution cycles (default: 50)
- **Mutation Rate**: Probability of random changes (default: 0.1)
- **Crossover Rate**: Probability of combining solutions (default: 0.8)
- **Elitism Count**: Number of best solutions preserved (default: 3)

## Development

### Building for Production

#### Backend
```bash
cd backend
npm run build
npm start
```

#### Frontend
```bash
cd frontend
npm run build
```

### Testing
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please open an issue on GitHub.

---

**Note**: This application is designed for academic institutions to optimize their timetable scheduling using advanced genetic algorithms. The system handles complex constraints and provides near-optimal solutions for scheduling challenges.