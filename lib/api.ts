// lib/api.ts

export interface Project {
  id: string;
  name: string;
  currentSprint: string;
  healthScore: number;
}

// Make sure this is exactly "MOCK_PROJECTS"
export const MOCK_PROJECTS: Project[] = [
  { id: '1', name: 'Project 1: App Development', currentSprint: 'Sprint 1/4', healthScore: 85 },
  { id: '2', name: 'Project 2: AI Integration', currentSprint: 'Sprint 2/3', healthScore: 45 },
];

export const MOCK_BURNDOWN_DATA = [
  { day: 'Day 1', ideal: 100, actual: 100 },
  { day: 'Day 2', ideal: 80, actual: 85 },
  { day: 'Day 3', ideal: 60, actual: 70 },
  { day: 'Day 4', ideal: 40, actual: 42 },
  { day: 'Day 5', ideal: 20, actual: 25 },
  { day: 'Day 6', ideal: 0, actual: 5 },
];

// Added this back so your other code doesn't break
export const fetchTasks = async () => {
  return [];
};