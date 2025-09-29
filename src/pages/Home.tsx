import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Building2, TrendingUp, Shield } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Calculator,
      title: 'Smart Cost Estimation',
      description: 'Get accurate building cost estimates with our advanced calculation engine'
    },
    {
      icon: Building2,
      title: 'Multiple Material Types',
      description: 'Choose from Standard, Premium, or Luxury materials with different cost structures'
    },
    {
      icon: TrendingUp,
      title: 'Real-time Calculations',
      description: 'See cost estimates update instantly as you modify your project parameters'
    },
    {
      icon: Shield,
      title: 'Save & Track Projects',
      description: 'Store your estimations and track all your building projects in one place'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="mb-8">
          <Building2 className="w-16 h-16 mx-auto text-blue-600 mb-4" />
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Building Cost Estimation Tool
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Plan your construction projects with confidence. Get accurate cost estimates, 
            compare material options, and manage all your building projects efficiently.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/estimate"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Start New Estimation
          </Link>
          <Link
            to="/projects"
            className="bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            View Saved Projects
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {features.map((feature, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <feature.icon className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Cost Structure Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Cost Structure</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 font-bold text-xl">₹</span>
            </div>
            <h3 className="font-semibold text-gray-900">Standard</h3>
            <p className="text-2xl font-bold text-green-600 mb-2">₹1,200/sq ft</p>
            <p className="text-gray-600 text-sm">Basic materials and finishes</p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold text-xl">₹</span>
            </div>
            <h3 className="font-semibold text-gray-900">Premium</h3>
            <p className="text-2xl font-bold text-blue-600 mb-2">₹1,800/sq ft</p>
            <p className="text-gray-600 text-sm">High-quality materials and finishes</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-purple-600 font-bold text-xl">₹</span>
            </div>
            <h3 className="font-semibold text-gray-900">Luxury</h3>
            <p className="text-2xl font-bold text-purple-600 mb-2">₹2,500/sq ft</p>
            <p className="text-gray-600 text-sm">Premium materials and luxury finishes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;