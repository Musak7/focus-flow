import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Mock AI response for epic generation
app.post('/api/generate', (req, res) => {
  const { description } = req.body;

  console.log('📝 Received description:', description);

  // Generate mock epics based on the description
  const mockEpics = [
    {
      id: 1,
      title: "User Authentication System",
      description: "Implement secure user login, registration, and session management",
      priority: "High",
      estimatedStoryPoints: 13
    },
    {
      id: 2,
      title: "Dashboard UI",
      description: "Create the main dashboard interface with data visualization",
      priority: "High",
      estimatedStoryPoints: 8
    },
    {
      id: 3,
      title: "API Integration",
      description: "Integrate with third-party APIs and services",
      priority: "Medium",
      estimatedStoryPoints: 5
    },
    {
      id: 4,
      title: "Database Schema Design",
      description: "Design and implement the database architecture",
      priority: "High",
      estimatedStoryPoints: 13
    },
    {
      id: 5,
      title: "Notification System",
      description: "Implement real-time notifications for users",
      priority: "Medium",
      estimatedStoryPoints: 8
    }
  ];

  res.json({
    success: true,
    epics: mockEpics
  });
});

// Mock classification endpoint
app.post('/api/classify', (req, res) => {
  const { epic_title, epic_description } = req.body;

  // Simple classification logic
  const classification = epic_title.toLowerCase().includes('ui') || epic_title.toLowerCase().includes('dashboard')
    ? 'Frontend'
    : epic_title.toLowerCase().includes('api') || epic_title.toLowerCase().includes('database')
    ? 'Backend'
    : 'Fullstack';

  res.json({
    classification,
    confidence: 0.85
  });
});

app.listen(PORT, () => {
  console.log(`🤖 Mock AI Service running on http://localhost:${PORT}`);
});
