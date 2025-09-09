import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { Subject } from '../../types';
import { generateId } from '../../utils/helpers';

interface SubjectFormProps {
  subjects: Subject[];
  onSubjectsChange: (subjects: Subject[]) => void;
}

const SubjectForm: React.FC<SubjectFormProps> = ({ subjects, onSubjectsChange }) => {
  const [newSubject, setNewSubject] = useState<Partial<Subject>>({
    name: '',
    code: '',
    credits: 3,
    hoursPerWeek: 3,
    semester: 1,
    type: 'UG'
  });

  const handleInputChange = (field: keyof Subject, value: string | number) => {
    setNewSubject(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddSubject = () => {
    if (newSubject.name && newSubject.code) {
      const subject: Subject = {
        id: generateId(),
        name: newSubject.name,
        code: newSubject.code,
        credits: newSubject.credits || 3,
        hoursPerWeek: newSubject.hoursPerWeek || 3,
        semester: newSubject.semester || 1,
        type: newSubject.type || 'UG'
      };

      onSubjectsChange([...subjects, subject]);
      setNewSubject({
        name: '',
        code: '',
        credits: 3,
        hoursPerWeek: 3,
        semester: 1,
        type: 'UG'
      });
    }
  };

  const handleDeleteSubject = (id: string) => {
    onSubjectsChange(subjects.filter(s => s.id !== id));
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Subjects
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 2, 
          mb: 2,
          '& > *': { minWidth: '120px', flex: '1 1 auto' }
        }}>
          <TextField
            label="Subject Name"
            value={newSubject.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            size="small"
            sx={{ minWidth: '200px' }}
          />
          <TextField
            label="Subject Code"
            value={newSubject.code || ''}
            onChange={(e) => handleInputChange('code', e.target.value)}
            size="small"
          />
          <TextField
            label="Credits"
            type="number"
            value={newSubject.credits || 3}
            onChange={(e) => handleInputChange('credits', parseInt(e.target.value))}
            size="small"
          />
          <TextField
            label="Hours/Week"
            type="number"
            value={newSubject.hoursPerWeek || 3}
            onChange={(e) => handleInputChange('hoursPerWeek', parseInt(e.target.value))}
            size="small"
          />
          <TextField
            label="Semester"
            type="number"
            value={newSubject.semester || 1}
            onChange={(e) => handleInputChange('semester', parseInt(e.target.value))}
            size="small"
          />
          <FormControl size="small" sx={{ minWidth: '120px' }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={newSubject.type || 'UG'}
              label="Type"
              onChange={(e: SelectChangeEvent) => handleInputChange('type', e.target.value)}
            >
              <MenuItem value="UG">UG</MenuItem>
              <MenuItem value="PG">PG</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddSubject}
            size="small"
            sx={{ minWidth: '140px' }}
          >
            Add Subject
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          {subjects.map((subject) => (
            <Chip
              key={subject.id}
              label={`${subject.code} - ${subject.name} (${subject.credits} credits, ${subject.hoursPerWeek}h/week)`}
              variant="outlined"
              deleteIcon={<DeleteIcon />}
              onDelete={() => handleDeleteSubject(subject.id)}
              color={subject.type === 'UG' ? 'primary' : 'secondary'}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default SubjectForm;