// Resource Library Types
export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'Video' | 'Note' | 'Quiz' | 'Interactive' | 'Assignment';
  subject: string;
  category: {
    particle: string;
    atom?: string;
    molecule?: string;
    matter?: string;
  };
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration?: number; // in minutes
  url: string;
  thumbnailUrl?: string;
  tags: string[];
  uploadedAt: string;
  updatedAt: string;
  downloads: number;
  rating: number;
  totalRatings: number;
  isPremium: boolean;
  teacherId?: string;
  teacherName?: string;
}

export interface FilterOptions {
  particle: string;
  atom: string;
  molecule: string;
  matter: string;
}

export interface SearchFilters {
  searchTerm: string;
  filters: Partial<FilterOptions>;
  type?: Resource['type'];
  difficulty?: Resource['difficulty'];
  isPremium?: boolean;
  subject?: string;
}

// Hierarchical category structure for filtering
export interface CategoryHierarchy {
  particles: {
    [key: string]: {
      atoms: {
        [key: string]: {
          molecules: {
            [key: string]: {
              matters: string[];
            };
          };
        };
      };
    };
  };
}

// Mock data structure for the hierarchical categories
export const CATEGORY_HIERARCHY: CategoryHierarchy = {
  particles: {
    'Physics': {
      atoms: {
        'Mechanics': {
          molecules: {
            'Classical Mechanics': {
              matters: ['Kinematics', 'Dynamics', 'Statics', 'Fluid Mechanics']
            },
            'Quantum Mechanics': {
              matters: ['Wave Function', 'Operators', 'Entanglement', 'Measurement']
            }
          }
        },
        'Thermodynamics': {
          molecules: {
            'Statistical Mechanics': {
              matters: ['Entropy', 'Phase Transitions', 'Kinetic Theory']
            },
            'Heat Transfer': {
              matters: ['Conduction', 'Convection', 'Radiation']
            }
          }
        }
      }
    },
    'Chemistry': {
      atoms: {
        'Organic Chemistry': {
          molecules: {
            'Hydrocarbons': {
              matters: ['Alkanes', 'Alkenes', 'Alkynes', 'Aromatics']
            },
            'Functional Groups': {
              matters: ['Alcohols', 'Aldehydes', 'Ketones', 'Carboxylic Acids']
            }
          }
        },
        'Inorganic Chemistry': {
          molecules: {
            'Metals': {
              matters: ['Transition Metals', 'Alkali Metals', 'Noble Metals']
            },
            'Non-metals': {
              matters: ['Halogens', 'Noble Gases', 'Metalloids']
            }
          }
        }
      }
    },
    'Mathematics': {
      atoms: {
        'Algebra': {
          molecules: {
            'Linear Algebra': {
              matters: ['Matrices', 'Vectors', 'Eigenvalues', 'Linear Transformations']
            },
            'Abstract Algebra': {
              matters: ['Groups', 'Rings', 'Fields', 'Galois Theory']
            }
          }
        },
        'Calculus': {
          molecules: {
            'Differential Calculus': {
              matters: ['Limits', 'Derivatives', 'Chain Rule', 'Optimization']
            },
            'Integral Calculus': {
              matters: ['Integrals', 'Integration Techniques', 'Applications']
            }
          }
        }
      }
    },
    'Biology': {
      atoms: {
        'Cell Biology': {
          molecules: {
            'Cell Structure': {
              matters: ['Nucleus', 'Mitochondria', 'Ribosomes', 'Cell Membrane']
            },
            'Cell Processes': {
              matters: ['Mitosis', 'Meiosis', 'Metabolism', 'Photosynthesis']
            }
          }
        },
        'Genetics': {
          molecules: {
            'Classical Genetics': {
              matters: ['Mendel\'s Laws', 'Inheritance Patterns', 'Linkage']
            },
            'Molecular Genetics': {
              matters: ['DNA Structure', 'Gene Expression', 'Mutations', 'Cloning']
            }
          }
        }
      }
    }
  }
};
