import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FolderOpen, Eye, Calendar, MapPin, Building, Loader2 } from 'lucide-react';
import { getAllProjects } from '../services/api';
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
  createdAt: string;
}

const ProjectList = () => {
  const { showNotification } = useNotification();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await getAllProjects();
      setProjects(data);
    } catch (error) {
      showNotification('Error fetching projects', 'error');
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
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getMaterialTypeColor = (type: string) => {
    switch (type) {
      case 'Standard': return 'bg-green-100 text-green-800';
      case 'Premium': return 'bg-blue-100 text-blue-800';
      case 'Luxury': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading projects...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FolderOpen className="w-8 h-8 mr-3 text-blue-600" />
            Saved Projects
          </h1>
          <p className="text-gray-600 mt-2">Manage and review all your building cost estimations</p>
        </div>
        
        <Link
          to="/estimate"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          New Estimation
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <FolderOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No projects found</h3>
          <p className="text-gray-500 mb-6">Start by creating your first building cost estimation</p>
          <Link
            to="/estimate"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
          >
            Create First Project
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-blue-200">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 truncate flex-1">
                    {project.projectName}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getMaterialTypeColor(project.materialType)}`}>
                    {project.materialType}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{project.location}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 text-sm">
                    <Building className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{project.floorArea.toLocaleString()} sq ft × {project.numberOfFloors} floor{project.numberOfFloors > 1 ? 's' : ''}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 text-sm">
                    <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{formatDate(project.createdAt)}</span>
                  </div>
                </div>

                {project.additionalFeatures.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Additional Features:</p>
                    <div className="flex flex-wrap gap-1">
                      {project.additionalFeatures.slice(0, 3).map((feature, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {feature}
                        </span>
                      ))}
                      {project.additionalFeatures.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          +{project.additionalFeatures.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">Estimated Cost</span>
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(project.estimatedCost)}
                    </span>
                  </div>
                  
                  <Link
                    to={`/projects/${project._id}`}
                    className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;