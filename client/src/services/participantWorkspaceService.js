import axios from 'axios';
import { getRootApiUrl } from './apiConfig';

const API_BASE_URL = getRootApiUrl();

/**
 * Participant Virtual Round Workspace Service
 */
export const participantWorkspaceService = {
 // Fetch assigned problem statement for participant team
 async getAssignedProblem() {
 try {
 const response = await axios.get(`${API_BASE_URL}/participant/problem`);
 return response.data;
 } catch (error) {
 console.warn('API unavailable, using initial workspace state:', error);
 return null;
 }
 },

 // Save submission draft
 async saveDraft(submissionData) {
 const response = await axios.post(`${API_BASE_URL}/participant/submission/draft`, submissionData);
 return response.data;
 },

 // Submit final project
 async submitFinal(submissionData) {
 const response = await axios.post(`${API_BASE_URL}/participant/submission/final`, submissionData);
 return response.data;
 },

 // Fetch team notes
 async saveQuickNotes(notesText) {
 const response = await axios.post(`${API_BASE_URL}/participant/notes`, { notes: notesText });
 return response.data;
 },
};
