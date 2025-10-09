"use client";

import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { CATEGORY_HIERARCHY } from '@/types/resource.types';

interface FilterDropdownProps {
  level: 'particle' | 'atom' | 'molecule' | 'matter';
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  disabled?: boolean;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  level,
  value,
  onChange,
  options,
  placeholder,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  const levelColors = {
    particle: 'from-blue-500 to-purple-600',
    atom: 'from-purple-500 to-indigo-600',
    molecule: 'from-indigo-500 to-blue-600',
    matter: 'from-blue-500 to-teal-600'
  };

  const levelBorders = {
    particle: 'border-blue-500/30',
    atom: 'border-purple-500/30',
    molecule: 'border-indigo-500/30',
    matter: 'border-blue-500/30'
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full min-w-[200px] px-4 py-3 text-left bg-white/10 backdrop-blur-xl 
          border ${levelBorders[level]} rounded-xl shadow-lg
          transition-all duration-300 hover:bg-white/20
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:scale-[1.02]'}
          ${isOpen ? 'ring-2 ring-white/30' : ''}
        `}
      >
        <div className="flex items-center justify-between">
          <span className={`
            font-medium ${value ? 'text-white' : 'text-slate-300'}
            ${value ? `bg-gradient-to-r ${levelColors[level]} bg-clip-text text-transparent` : ''}
          `}>
            {value || placeholder}
          </span>
          <ChevronDown 
            className={`w-5 h-5 text-slate-300 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </div>
      </button>

      {isOpen && !disabled && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute top-full left-0 right-0 mt-2 z-20">
            <div className="bg-white/95 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl max-h-60 overflow-y-auto">
              {options.length === 0 ? (
                <div className="px-4 py-3 text-slate-500 text-sm">
                  No options available
                </div>
              ) : (
                <>
                  {value && (
                    <button
                      onClick={() => handleSelect('')}
                      className="w-full px-4 py-3 text-left hover:bg-slate-100/50 transition-colors duration-200 text-slate-600 border-b border-slate-200/50"
                    >
                      Clear selection
                    </button>
                  )}
                  {options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleSelect(option)}
                      className={`
                        w-full px-4 py-3 text-left transition-all duration-200
                        ${value === option 
                          ? `bg-gradient-to-r ${levelColors[level]} text-white shadow-md` 
                          : 'hover:bg-slate-100/50 text-slate-700'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{option}</span>
                        {value === option && (
                          <Check className="w-4 h-4" />
                        )}
                      </div>
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

interface HierarchicalFiltersProps {
  filters: {
    particle: string;
    atom: string;
    molecule: string;
    matter: string;
  };
  onFilterChange: (level: string, value: string) => void;
}

const HierarchicalFilters: React.FC<HierarchicalFiltersProps> = ({
  filters,
  onFilterChange
}) => {
  // Get available options for each level based on current selection
  const getParticleOptions = () => Object.keys(CATEGORY_HIERARCHY.particles);
  
  const getAtomOptions = () => {
    if (!filters.particle) return [];
    return Object.keys(CATEGORY_HIERARCHY.particles[filters.particle]?.atoms || {});
  };
  
  const getMoleculeOptions = () => {
    if (!filters.particle || !filters.atom) return [];
    return Object.keys(
      CATEGORY_HIERARCHY.particles[filters.particle]?.atoms[filters.atom]?.molecules || {}
    );
  };
  
  const getMatterOptions = () => {
    if (!filters.particle || !filters.atom || !filters.molecule) return [];
    return CATEGORY_HIERARCHY.particles[filters.particle]?.atoms[filters.atom]?.molecules[filters.molecule]?.matters || [];
  };

  const handleFilterChange = (level: string, value: string) => {
    onFilterChange(level, value);
    
    // Clear dependent filters when parent changes
    if (level === 'particle') {
      onFilterChange('atom', '');
      onFilterChange('molecule', '');
      onFilterChange('matter', '');
    } else if (level === 'atom') {
      onFilterChange('molecule', '');
      onFilterChange('matter', '');
    } else if (level === 'molecule') {
      onFilterChange('matter', '');
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">Filter by Category</h3>
        <p className="text-slate-300 text-sm">Select from the hierarchical structure to narrow down your search</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FilterDropdown
          level="particle"
          value={filters.particle}
          onChange={(value) => handleFilterChange('particle', value)}
          options={getParticleOptions()}
          placeholder="Select Particle"
        />
        
        <FilterDropdown
          level="atom"
          value={filters.atom}
          onChange={(value) => handleFilterChange('atom', value)}
          options={getAtomOptions()}
          placeholder="Select Atom"
          disabled={!filters.particle}
        />
        
        <FilterDropdown
          level="molecule"
          value={filters.molecule}
          onChange={(value) => handleFilterChange('molecule', value)}
          options={getMoleculeOptions()}
          placeholder="Select Molecule"
          disabled={!filters.atom}
        />
        
        <FilterDropdown
          level="matter"
          value={filters.matter}
          onChange={(value) => handleFilterChange('matter', value)}
          options={getMatterOptions()}
          placeholder="Select Matter"
          disabled={!filters.molecule}
        />
      </div>
      
      {/* Clear All Filters */}
      {(filters.particle || filters.atom || filters.molecule || filters.matter) && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => {
              onFilterChange('particle', '');
              onFilterChange('atom', '');
              onFilterChange('molecule', '');
              onFilterChange('matter', '');
            }}
            className="px-6 py-2 bg-slate-600/50 hover:bg-slate-600 text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default HierarchicalFilters;
