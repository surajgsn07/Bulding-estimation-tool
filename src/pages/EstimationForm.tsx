import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, Save, Loader2 } from 'lucide-react';
import { calculateCost, saveProject } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';

interface FormData {
  projectName: string;
  location: string;
  floorArea: string;
  numberOfFloors: string;
  materialType: string;
  additionalFeatures: string[];
}

interface CostData {
  baseCost: number;
  materialMultiplier: number;
  additionalFeaturesCost: number;
  totalCost: number;
}

const EstimationForm = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  
  const [formData, setFormData] = useState<FormData>({
    projectName: '',
    location: '',
    floorArea: '',
    numberOfFloors: '',
    materialType: 'Standard',
    additionalFeatures: []
  });

  const [costData, setCostData] = useState<CostData | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const materialTypes = ['Standard', 'Premium', 'Luxury'];
  const additionalFeatureOptions = ['Parking', 'Elevator', 'Garden', 'Solar Panels'];

  const featureDescriptions = {
    'Parking': '₹1,50,000',
    'Elevator': '₹8,00,000',
    'Garden': '₹2,00,000',
    'Solar Panels': '₹5,00,000'
  };

  useEffect(() => {
    const { floorArea, numberOfFloors, materialType } = formData;
    if (floorArea && numberOfFloors && materialType) {
      handleCostCalculation();
    }
  }, [formData.floorArea, formData.numberOfFloors, formData.materialType, formData.additionalFeatures]);

  const handleCostCalculation = async () => {
    const { floorArea, numberOfFloors, materialType, additionalFeatures } = formData;
    
    if (!floorArea || !numberOfFloors || !materialType) return;

    setIsCalculating(true);
    try {
      const data = await calculateCost({
        floorArea: parseInt(floorArea),
        numberOfFloors: parseInt(numberOfFloors),
        materialType,
        additionalFeatures
      });
      setCostData(data);
    } catch (error) {
      showNotification('Error calculating cost', 'error');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureChange = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      additionalFeatures: prev.additionalFeatures.includes(feature)
        ? prev.additionalFeatures.filter(f => f !== feature)
        : [...prev.additionalFeatures, feature]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!costData) {
      showNotification('Please wait for cost calculation to complete', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const projectData = {
        ...formData,
        floorArea: parseInt(formData.floorArea),
        numberOfFloors: parseInt(formData.numberOfFloors)
      };
      
      const savedProject = await saveProject(projectData);
      showNotification('Project saved successfully!', 'success');
      navigate(`/projects/${savedProject._id}`);
    } catch (error) {
      showNotification('Error saving project', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Calculator className="w-8 h-8 mr-3" />
            Building Cost Estimation
          </h1>
          <p className="text-blue-100 mt-2">Fill in the details to get an accurate cost estimate for your building project</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column - Form Inputs */}
            <div className="space-y-6">
              <div>
                <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  id="projectName"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter project name"
                  required
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter location"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="floorArea" className="block text-sm font-medium text-gray-700 mb-2">
                    Floor Area (sq ft) *
                  </label>
                  <input
                    type="number"
                    id="floorArea"
                    name="floorArea"
                    value={formData.floorArea}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g., 2000"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="numberOfFloors" className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Floors *
                  </label>
                  <input
                    type="number"
                    id="numberOfFloors"
                    name="numberOfFloors"
                    value={formData.numberOfFloors}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g., 2"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="materialType" className="block text-sm font-medium text-gray-700 mb-2">
                  Material Type *
                </label>
                <select
                  id="materialType"
                  name="materialType"
                  value={formData.materialType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                >
                  {materialTypes.map(type => (
                    <option key={type} value={type}>
                      {type} - ₹{type === 'Standard' ? '1,200' : type === 'Premium' ? '1,800' : '2,500'}/sq ft
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Additional Features
                </label>
                <div className="space-y-2">
                  {additionalFeatureOptions.map(feature => (
                    <label key={feature} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.additionalFeatures.includes(feature)}
                        onChange={() => handleFeatureChange(feature)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-3 text-gray-700 flex-1">{feature}</span>
                      <span className="text-sm text-gray-500 font-medium">
                        {featureDescriptions[feature as keyof typeof featureDescriptions]}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Cost Preview */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Calculator className="w-5 h-5 mr-2" />
                  Cost Estimate
                </h3>
                
                {isCalculating ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">Calculating...</span>
                  </div>
                ) : costData ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Base Cost ({formData.floorArea} × {formData.numberOfFloors} × ₹{costData.materialMultiplier})</span>
                      <span className="font-semibold">{formatCurrency(costData.baseCost)}</span>
                    </div>
                    
                    {costData.additionalFeaturesCost > 0 && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-600">Additional Features</span>
                        <span className="font-semibold">{formatCurrency(costData.additionalFeaturesCost)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center py-3 bg-blue-50 px-4 rounded-lg">
                      <span className="text-lg font-bold text-blue-900">Total Estimated Cost</span>
                      <span className="text-2xl font-bold text-blue-600">{formatCurrency(costData.totalCost)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Enter project details to see cost estimate
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={!costData || isSaving}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-4 rounded-lg text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none disabled:shadow-none flex items-center justify-center"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Saving Project...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Save Project
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EstimationForm;