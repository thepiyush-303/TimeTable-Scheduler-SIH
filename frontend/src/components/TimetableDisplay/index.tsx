import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  Alert,
  Divider
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { Timetable, TimetableEntry } from '../../types';
import { formatTime, DAYS } from '../../utils/helpers';

interface TimetableDisplayProps {
  timetable: Timetable | null;
  loading?: boolean;
}

const TimetableDisplay: React.FC<TimetableDisplayProps> = ({ timetable, loading = false }) => {

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Generating Timetable...
          </Typography>
          <Typography>Please wait while the genetic algorithm optimizes your timetable.</Typography>
        </CardContent>
      </Card>
    );
  }

  if (!timetable) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            No Timetable Generated
          </Typography>
          <Typography color="text.secondary">
            Fill in the required data and click "Generate Timetable" to create an optimized schedule.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const timeSlots = ['09:00', '10:00', '11:30', '12:30', '14:30', '15:30'];

  const getTimetableGrid = () => {
    const grid: { [key: string]: { [key: string]: TimetableEntry[] } } = {};
    
    DAYS.forEach(day => {
      grid[day] = {};
      timeSlots.forEach(time => {
        grid[day][time] = [];
      });
    });

    timetable.entries.forEach(entry => {
      const day = entry.timeSlot.day;
      const time = entry.timeSlot.startTime;
      if (grid[day] && grid[day][time]) {
        grid[day][time].push(entry);
      }
    });

    return grid;
  };

  const grid = getTimetableGrid();

  const getConflictColor = (entries: TimetableEntry[]) => {
    if (entries.length > 1) return 'error';
    return 'default';
  };

  const renderTimetableCell = (entries: TimetableEntry[]) => {
    if (entries.length === 0) {
      return <Typography variant="body2" color="text.secondary">-</Typography>;
    }

    return (
      <Box>
        {entries.map((entry, index) => (
          <Chip
            key={entry.id}
            size="small"
            label={
              <Box>
                <Typography variant="caption" display="block">
                  {entry.subject.code}
                </Typography>
                <Typography variant="caption" display="block">
                  {entry.batch.name}
                </Typography>
                <Typography variant="caption" display="block">
                  {entry.classroom.name}
                </Typography>
                <Typography variant="caption" display="block">
                  {entry.faculty.name}
                </Typography>
              </Box>
            }
            color={getConflictColor(entries)}
            sx={{ 
              m: 0.25, 
              height: 'auto',
              '& .MuiChip-label': { 
                padding: '4px',
                whiteSpace: 'normal',
                textAlign: 'left'
              }
            }}
          />
        ))}
      </Box>
    );
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ScheduleIcon sx={{ mr: 1 }} />
          <Typography variant="h6">
            Generated Timetable
          </Typography>
        </Box>

        {/* Statistics */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <Alert 
            severity={timetable.fitness > 800 ? 'success' : timetable.fitness > 500 ? 'warning' : 'error'}
            icon={timetable.fitness > 800 ? <CheckCircleIcon /> : <ErrorIcon />}
            sx={{ flex: '1 1 300px' }}
          >
            <Typography variant="body2">
              <strong>Fitness Score:</strong> {timetable.fitness}/1000
            </Typography>
          </Alert>
          <Alert severity={timetable.conflicts.length === 0 ? 'success' : 'warning'} sx={{ flex: '1 1 200px' }}>
            <Typography variant="body2">
              <strong>Conflicts:</strong> {timetable.conflicts.length}
            </Typography>
          </Alert>
          <Alert severity="info" sx={{ flex: '1 1 200px' }}>
            <Typography variant="body2">
              <strong>Total Classes:</strong> {timetable.entries.length}
            </Typography>
          </Alert>
        </Box>

        {/* Conflicts */}
        {timetable.conflicts.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" color="error" gutterBottom>
              Conflicts Found:
            </Typography>
            {timetable.conflicts.map((conflict, index) => (
              <Alert key={index} severity="error" sx={{ mb: 1 }}>
                <Typography variant="body2">
                  <strong>{conflict.type.replace('_', ' ').toUpperCase()}:</strong> {conflict.description}
                </Typography>
              </Alert>
            ))}
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Timetable Grid */}
        <TableContainer component={Paper} sx={{ maxHeight: 800, overflow: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 100 }}>
                  <Typography variant="subtitle2">Time / Day</Typography>
                </TableCell>
                {DAYS.map(day => (
                  <TableCell key={day} sx={{ minWidth: 200 }}>
                    <Typography variant="subtitle2">{day}</Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {timeSlots.map(time => (
                <TableRow key={time}>
                  <TableCell sx={{ backgroundColor: 'grey.50' }}>
                    <Typography variant="body2" fontWeight="bold">
                      {formatTime(time)}
                    </Typography>
                  </TableCell>
                  {DAYS.map(day => (
                    <TableCell key={`${day}-${time}`} sx={{ verticalAlign: 'top', p: 1 }}>
                      {renderTimetableCell(grid[day][time])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default TimetableDisplay;