const API_BASE_URL = 'http://localhost:5000/api';

export interface ProjectData {
  projectName: string;
  location: string;
  floorArea: number;
  numberOfFloors: number;
  materialType: string;
  additionalFeatures: string[];
}

export interface CostCalculationData {
  floorArea: number;
  numberOfFloors: number;
  materialType: string;
  additionalFeatures: string[];
}

// Mock API functions for development (replace with actual API calls when backend is ready)
export const calculateCost = async (data: CostCalculationData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
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

  const baseCost = data.floorArea * data.numberOfFloors * materialMultipliers[data.materialType as keyof typeof materialMultipliers];
  const additionalFeaturesCost = data.additionalFeatures.reduce((total, feature) => {
    return total + (featureCosts[feature as keyof typeof featureCosts] || 0);
  }, 0);

  const totalCost = baseCost + additionalFeaturesCost;

  return {
    baseCost,
    materialMultiplier: materialMultipliers[data.materialType as keyof typeof materialMultipliers],
    additionalFeaturesCost,
    totalCost
  };
};

export const saveProject = async (data: ProjectData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const costData = await calculateCost(data);
  
  const project = {
    _id: Math.random().toString(36).substr(2, 9),
    ...data,
    estimatedCost: costData.totalCost,
    costBreakdown: {
      baseCost: costData.baseCost,
      materialMultiplier: costData.materialMultiplier,
      additionalFeaturesCost: costData.additionalFeaturesCost
    },
    createdAt: new Date().toISOString()
  };

  // Store in localStorage for demo purposes
  const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]');
  existingProjects.push(project);
  localStorage.setItem('projects', JSON.stringify(existingProjects));

  return project;
};

export const getAllProjects = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const projects = JSON.parse(localStorage.getItem('projects') || '[]');
  return projects.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getProjectById = async (id: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const projects = JSON.parse(localStorage.getItem('projects') || '[]');
  const project = projects.find((p: any) => p._id === id);
  
  if (!project) {
    throw new Error('Project not found');
  }
  
  return project;
};