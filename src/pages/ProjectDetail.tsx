import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, Calendar, DollarSign, Layers, Settings, Loader2 } from 'lucide-react';
import { getProjectById } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';

interface Project {
  _id: string;
  projectName: string;
  location: string;
  floorArea: number;
  numberOfFloors: number;
  materialType: string;
  additionalFeatures: string[];
  estimatedCost: number;
  costBreakdown: {
    baseCost: number;
    materialMultiplier: number;
    additionalFeaturesCost: number;
  };
  createdAt: string;
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { showNotification } = useNotification();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProject(id);
    }
  }, [id]);

  const fetchProject = async (projectId: string) => {
    try {
      const data = await getProjectById(projectId);
      setProject(data);
    } catch (error) {
      showNotification('Error fetching project details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMaterialTypeColor = (type: string) => {
    switch (type) {
      case 'Standard': return 'bg-green-100 text-green-800 border-green-200';
      case 'Premium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Luxury': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const featureIcons = {
    'Parking': '🚗',
    'Elevator': '🏢',
    'Garden': '🌱',
    'Solar Panels': '☀️'
  };

  const featureCosts = {
    'Parking': 150000,
    'Elevator': 800000,
    'Garden': 200000,
    'Solar Panels': 500000
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading project details...</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-16">
        <Building2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Project not found</h3>
        <Link to="/projects" className="text-blue-600 hover:text-blue-700">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link 
          to="/projects" 
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Link>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{project.projectName}</h1>
                <p className="text-blue-100 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {project.location}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getMaterialTypeColor(project.materialType)}`}>
                {project.materialType}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Project Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              Project Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Layers className="w-4 h-4 text-gray-600 mr-2" />
                  <span className="text-sm text-gray-600">Floor Area</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">
                  {project.floorArea.toLocaleString()} sq ft
                </span>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Building2 className="w-4 h-4 text-gray-600 mr-2" />
                  <span className="text-sm text-gray-600">Number of Floors</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">
                  {project.numberOfFloors} floor{project.numberOfFloors > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Calendar className="w-4 h-4 text-gray-600 mr-2" />
                <span className="text-sm text-gray-600">Created On</span>
              </div>
              <span className="text-gray-900 font-medium">{formatDate(project.createdAt)}</span>
            </div>
          </div>

          {/* Additional Features */}
          {project.additionalFeatures.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Additional Features
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {project.additionalFeatures.map((feature, index) => (
                  <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg">
                        {featureIcons[feature as keyof typeof featureIcons]} {feature}
                      </span>
                    </div>
                    <span className="text-blue-600 font-semibold">
                      {formatCurrency(featureCosts[feature as keyof typeof featureCosts])}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Cost Breakdown */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Cost Breakdown
            </h2>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Base Construction Cost</span>
                </div>
                <div className="text-xs text-gray-500 mb-1">
                  {project.floorArea.toLocaleString()} sq ft × {project.numberOfFloors} floors × ₹{project.costBreakdown.materialMultiplier.toLocaleString()}/sq ft
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {formatCurrency(project.costBreakdown.baseCost)}
                </span>
              </div>

              {project.costBreakdown.additionalFeaturesCost > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Additional Features</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(project.costBreakdown.additionalFeaturesCost)}
                  </span>
                </div>
              )}

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-green-800 font-medium">Total Estimated Cost</span>
                </div>
                <span className="text-3xl font-bold text-green-600">
                  {formatCurrency(project.estimatedCost)}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link
                to="/estimate"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-200 text-center block"
              >
                Create New Estimate
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;