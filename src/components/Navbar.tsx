import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, Home, Calculator, FolderOpen } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
            <Building2 className="w-8 h-8" />
            <span>BuildCost Pro</span>
          </Link>
          
          <div className="flex space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                isActive('/') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            
            <Link
              to="/estimate"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                isActive('/estimate') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>New Estimate</span>
            </Link>
            
            <Link
              to="/projects"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                isActive('/projects') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              <span>Projects</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;