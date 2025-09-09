import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar,
  Paper
} from '@mui/material';
import { Schedule as ScheduleIcon, Science as ScienceIcon } from '@mui/icons-material';
import SubjectForm from './components/SubjectForm';
import TimetableDisplay from './components/TimetableDisplay';
import { timetableService } from './services/api';
import {
  Subject,
  Faculty,
  Classroom,
  Batch,
  Timetable,
  TimetableGenerationRequest
} from './types';
import {
  SAMPLE_SUBJECTS,
  SAMPLE_CLASSROOMS,
  createSampleFaculties,
  createSampleBatches
} from './utils/helpers';

function App() {
  const [subjects, setSubjects] = useState<Subject[]>(SAMPLE_SUBJECTS);
  const [faculties, setFaculties] = useState<Faculty[]>(createSampleFaculties(SAMPLE_SUBJECTS));
  const [classrooms] = useState<Classroom[]>(SAMPLE_CLASSROOMS);
  const [batches, setBatches] = useState<Batch[]>(createSampleBatches(SAMPLE_SUBJECTS));
  const [timetable, setTimetable] = useState<Timetable | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateTimetable = async () => {
    if (subjects.length === 0 || faculties.length === 0 || classrooms.length === 0 || batches.length === 0) {
      setError('Please provide all required data: subjects, faculties, classrooms, and batches.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const request: TimetableGenerationRequest = {
        subjects,
        faculties,
        classrooms,
        batches,
        params: {
          populationSize: 30,
          generations: 50,
          mutationRate: 0.1,
          crossoverRate: 0.8,
          elitismCount: 3
        }
      };

      const response = await timetableService.generateTimetable(request);
      
      if (response.success && response.timetable) {
        setTimetable(response.timetable);
      } else {
        setError(response.error || 'Failed to generate timetable');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectsChange = (newSubjects: Subject[]) => {
    setSubjects(newSubjects);
    // Update faculties and batches when subjects change
    setFaculties(createSampleFaculties(newSubjects));
    setBatches(createSampleBatches(newSubjects));
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <ScheduleIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            TimeTable Scheduler - Genetic Algorithm
          </Typography>
          <ScienceIcon />
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Intelligent Timetable Scheduling System
        </Typography>
        <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
          Optimize your academic schedules using genetic algorithms for UG and PG courses
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
          {/* Input Forms */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <SubjectForm subjects={subjects} onSubjectsChange={handleSubjectsChange} />
            
            {/* Faculty Summary */}
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Faculty Overview</Typography>
              <Typography variant="body2" color="text.secondary">
                {faculties.length} faculties configured with subject assignments
              </Typography>
              {faculties.map(faculty => (
                <Typography key={faculty.id} variant="body2">
                  • {faculty.name} - {faculty.subjects.length} subjects
                </Typography>
              ))}
            </Paper>

            {/* Classroom Summary */}
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Classroom Overview</Typography>
              <Typography variant="body2" color="text.secondary">
                {classrooms.length} classrooms available
              </Typography>
              {classrooms.map(classroom => (
                <Typography key={classroom.id} variant="body2">
                  • {classroom.name} - Capacity: {classroom.capacity} ({classroom.type})
                </Typography>
              ))}
            </Paper>

            {/* Batch Summary */}
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Batch Overview</Typography>
              <Typography variant="body2" color="text.secondary">
                {batches.length} batches configured
              </Typography>
              {batches.map(batch => (
                <Typography key={batch.id} variant="body2">
                  • {batch.name} - {batch.strength} students, Semester {batch.semester} ({batch.type})
                </Typography>
              ))}
            </Paper>

            {/* Generate Button */}
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleGenerateTimetable}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <ScienceIcon />}
                sx={{ minWidth: 200 }}
              >
                {loading ? 'Generating...' : 'Generate Timetable'}
              </Button>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>

          {/* Timetable Display */}
          <Box sx={{ flex: 1 }}>
            <TimetableDisplay timetable={timetable} loading={loading} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default App;
