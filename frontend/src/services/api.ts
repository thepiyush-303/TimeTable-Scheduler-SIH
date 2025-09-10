import axios from 'axios';
import {
  TimetableGenerationRequest,
  TimetableGenerationResponse,
  Timetable
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const timetableService = {
  // Generate timetable
  generateTimetable: async (request: TimetableGenerationRequest): Promise<TimetableGenerationResponse> => {
    const response = await api.post('/timetable/generate', request);
    return response.data;
  },

  // Get all timetables
  getTimetables: async (): Promise<{ success: boolean; timetables: Timetable[] }> => {
    const response = await api.get('/timetable/timetables');
    return response.data;
  },

  // Get timetable by ID
  getTimetableById: async (id: string): Promise<{ success: boolean; timetable: Timetable }> => {
    const response = await api.get(`/timetable/timetables/${id}`);
    return response.data;
  },

  // Get timetable for specific batch
  getTimetableForBatch: async (batchId: string): Promise<{ success: boolean; timetables: Timetable[] }> => {
    const response = await api.get(`/timetable/timetables/batch/${batchId}`);
    return response.data;
  },

  // Get timetable for specific faculty
  getTimetableForFaculty: async (facultyId: string): Promise<{ success: boolean; timetables: Timetable[] }> => {
    const response = await api.get(`/timetable/timetables/faculty/${facultyId}`);
    return response.data;
  },

  // Get current data
  getData: async () => {
    const response = await api.get('/timetable/data');
    return response.data;
  },

  // Clear all data
  clearData: async () => {
    const response = await api.delete('/timetable/data');
    return response.data;
  },
};

export default timetableService;