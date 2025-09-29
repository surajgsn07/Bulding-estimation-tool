const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/building-cost-estimation', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Project Schema
const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  floorArea: {
    type: Number,
    required: true,
    min: 1
  },
  numberOfFloors: {
    type: Number,
    required: true,
    min: 1
  },
  materialType: {
    type: String,
    required: true,
    enum: ['Standard', 'Premium', 'Luxury']
  },
  additionalFeatures: [{
    type: String,
    enum: ['Parking', 'Elevator', 'Garden', 'Solar Panels']
  }],
  estimatedCost: {
    type: Number,
    required: true
  },
  costBreakdown: {
    baseCost: Number,
    materialMultiplier: Number,
    additionalFeaturesCost: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Project = mongoose.model('Project', projectSchema);

// Cost calculation function
const calculateCost = (floorArea, numberOfFloors, materialType, additionalFeatures) => {
  const materialMultipliers = {
    'Standard': 1200,
    'Premium': 1800,
    'Luxury': 2500
  };

  const featureCosts = {
    'Parking': 150000,
    'Elevator': 800000,
    'Garden': 200000,
    'Solar Panels': 500000
  };

  const baseCost = floorArea * numberOfFloors * materialMultipliers[materialType];
  const additionalFeaturesCost = additionalFeatures.reduce((total, feature) => {
    return total + (featureCosts[feature] || 0);
  }, 0);

  const totalCost = baseCost + additionalFeaturesCost;

  return {
    baseCost,
    materialMultiplier: materialMultipliers[materialType],
    additionalFeaturesCost,
    totalCost
  };
};

// Routes

// Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
});

// Get project by ID
app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project', error: error.message });
  }
});

// Create new project
app.post('/api/projects', async (req, res) => {
  try {
    const { projectName, location, floorArea, numberOfFloors, materialType, additionalFeatures } = req.body;

    // Validate required fields
    if (!projectName || !location || !floorArea || !numberOfFloors || !materialType) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const costData = calculateCost(floorArea, numberOfFloors, materialType, additionalFeatures || []);

    const project = new Project({
      projectName,
      location,
      floorArea,
      numberOfFloors,
      materialType,
      additionalFeatures: additionalFeatures || [],
      estimatedCost: costData.totalCost,
      costBreakdown: {
        baseCost: costData.baseCost,
        materialMultiplier: costData.materialMultiplier,
        additionalFeaturesCost: costData.additionalFeaturesCost
      }
    });

    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({ message: 'Error creating project', error: error.message });
  }
});

// Calculate cost endpoint (for real-time estimation)
app.post('/api/calculate-cost', (req, res) => {
  try {
    const { floorArea, numberOfFloors, materialType, additionalFeatures } = req.body;

    if (!floorArea || !numberOfFloors || !materialType) {
      return res.status(400).json({ message: 'Floor area, number of floors, and material type are required' });
    }

    const costData = calculateCost(floorArea, numberOfFloors, materialType, additionalFeatures || []);
    res.json(costData);
  } catch (error) {
    res.status(500).json({ message: 'Error calculating cost', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});