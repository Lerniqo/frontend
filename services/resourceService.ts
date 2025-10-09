import { Resource, SearchFilters } from '@/types/resource.types';

// Mock API service for resources
export class ResourceService {
  private static mockResources: Resource[] = [
    {
      id: '1',
      title: 'Introduction to Classical Mechanics',
      description: 'A comprehensive guide to understanding the fundamentals of classical mechanics, including Newton\'s laws and applications.',
      type: 'Video',
      subject: 'Physics',
      category: {
        particle: 'Physics',
        atom: 'Mechanics',
        molecule: 'Classical Mechanics',
        matter: 'Kinematics'
      },
      difficulty: 'Beginner',
      duration: 45,
      url: 'https://example.com/classical-mechanics-intro',
      thumbnailUrl: 'https://example.com/thumbnails/classical-mechanics.jpg',
      tags: ['physics', 'mechanics', 'newton', 'motion'],
      uploadedAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      downloads: 1250,
      rating: 4.8,
      totalRatings: 234,
      isPremium: false,
      teacherId: 'teacher-1',
      teacherName: 'Dr. Sarah Johnson'
    },
    {
      id: '2',
      title: 'Quantum Mechanics Fundamentals',
      description: 'Explore the mysterious world of quantum mechanics with interactive visualizations and comprehensive explanations.',
      type: 'Interactive',
      subject: 'Physics',
      category: {
        particle: 'Physics',
        atom: 'Mechanics',
        molecule: 'Quantum Mechanics',
        matter: 'Wave Function'
      },
      difficulty: 'Advanced',
      duration: 90,
      url: 'https://example.com/quantum-mechanics',
      thumbnailUrl: 'https://example.com/thumbnails/quantum.jpg',
      tags: ['quantum', 'physics', 'wave function', 'probability'],
      uploadedAt: '2024-02-01T14:30:00Z',
      updatedAt: '2024-02-01T14:30:00Z',
      downloads: 856,
      rating: 4.9,
      totalRatings: 142,
      isPremium: true,
      teacherId: 'teacher-2',
      teacherName: 'Prof. Michael Chen'
    },
    {
      id: '3',
      title: 'Organic Chemistry: Hydrocarbons Study Guide',
      description: 'Master the structure and properties of hydrocarbons with detailed notes and practice problems.',
      type: 'Note',
      subject: 'Chemistry',
      category: {
        particle: 'Chemistry',
        atom: 'Organic Chemistry',
        molecule: 'Hydrocarbons',
        matter: 'Alkanes'
      },
      difficulty: 'Intermediate',
      duration: 30,
      url: 'https://example.com/hydrocarbons-guide.pdf',
      thumbnailUrl: 'https://example.com/thumbnails/hydrocarbons.jpg',
      tags: ['chemistry', 'organic', 'hydrocarbons', 'alkanes'],
      uploadedAt: '2024-01-20T09:15:00Z',
      updatedAt: '2024-01-20T09:15:00Z',
      downloads: 2103,
      rating: 4.6,
      totalRatings: 387,
      isPremium: false,
      teacherId: 'teacher-3',
      teacherName: 'Dr. Emily Rodriguez'
    },
    {
      id: '4',
      title: 'Linear Algebra Quiz: Matrices and Vectors',
      description: 'Test your understanding of matrices and vector operations with this comprehensive quiz.',
      type: 'Quiz',
      subject: 'Mathematics',
      category: {
        particle: 'Mathematics',
        atom: 'Algebra',
        molecule: 'Linear Algebra',
        matter: 'Matrices'
      },
      difficulty: 'Intermediate',
      duration: 25,
      url: 'https://example.com/linear-algebra-quiz',
      thumbnailUrl: 'https://example.com/thumbnails/linear-algebra.jpg',
      tags: ['mathematics', 'linear algebra', 'matrices', 'vectors'],
      uploadedAt: '2024-01-28T16:45:00Z',
      updatedAt: '2024-01-28T16:45:00Z',
      downloads: 1432,
      rating: 4.7,
      totalRatings: 298,
      isPremium: false,
      teacherId: 'teacher-4',
      teacherName: 'Prof. David Kim'
    },
    {
      id: '5',
      title: 'Cell Biology: Structure and Function',
      description: 'Comprehensive video series covering cell organelles, their structure, and biological functions.',
      type: 'Video',
      subject: 'Biology',
      category: {
        particle: 'Biology',
        atom: 'Cell Biology',
        molecule: 'Cell Structure',
        matter: 'Nucleus'
      },
      difficulty: 'Beginner',
      duration: 60,
      url: 'https://example.com/cell-biology-series',
      thumbnailUrl: 'https://example.com/thumbnails/cell-biology.jpg',
      tags: ['biology', 'cell', 'organelles', 'nucleus'],
      uploadedAt: '2024-02-05T11:20:00Z',
      updatedAt: '2024-02-05T11:20:00Z',
      downloads: 1876,
      rating: 4.8,
      totalRatings: 456,
      isPremium: true,
      teacherId: 'teacher-5',
      teacherName: 'Dr. Lisa Thompson'
    },
    {
      id: '6',
      title: 'Thermodynamics Assignment: Heat Transfer',
      description: 'Practical assignment covering heat conduction, convection, and radiation with real-world examples.',
      type: 'Assignment',
      subject: 'Physics',
      category: {
        particle: 'Physics',
        atom: 'Thermodynamics',
        molecule: 'Heat Transfer',
        matter: 'Conduction'
      },
      difficulty: 'Advanced',
      duration: 120,
      url: 'https://example.com/thermodynamics-assignment',
      thumbnailUrl: 'https://example.com/thumbnails/thermodynamics.jpg',
      tags: ['physics', 'thermodynamics', 'heat transfer', 'assignment'],
      uploadedAt: '2024-02-10T13:00:00Z',
      updatedAt: '2024-02-10T13:00:00Z',
      downloads: 634,
      rating: 4.5,
      totalRatings: 156,
      isPremium: true,
      teacherId: 'teacher-6',
      teacherName: 'Prof. Robert Anderson'
    }
  ];

  static async getAllResources(): Promise<Resource[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...this.mockResources];
  }

  static async searchResources(filters: SearchFilters): Promise<Resource[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filteredResources = [...this.mockResources];

    // Apply search term filter
    if (filters.searchTerm && filters.searchTerm.trim()) {
      const searchLower = filters.searchTerm.toLowerCase();
      filteredResources = filteredResources.filter(resource =>
        resource.title.toLowerCase().includes(searchLower) ||
        resource.description.toLowerCase().includes(searchLower) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        resource.subject.toLowerCase().includes(searchLower)
      );
    }

    // Apply hierarchical filters
    if (filters.filters.particle) {
      filteredResources = filteredResources.filter(resource =>
        resource.category.particle === filters.filters.particle
      );
    }

    if (filters.filters.atom) {
      filteredResources = filteredResources.filter(resource =>
        resource.category.atom === filters.filters.atom
      );
    }

    if (filters.filters.molecule) {
      filteredResources = filteredResources.filter(resource =>
        resource.category.molecule === filters.filters.molecule
      );
    }

    if (filters.filters.matter) {
      filteredResources = filteredResources.filter(resource =>
        resource.category.matter === filters.filters.matter
      );
    }

    // Apply type filter
    if (filters.type) {
      filteredResources = filteredResources.filter(resource =>
        resource.type === filters.type
      );
    }

    // Apply difficulty filter
    if (filters.difficulty) {
      filteredResources = filteredResources.filter(resource =>
        resource.difficulty === filters.difficulty
      );
    }

    // Apply premium filter
    if (filters.isPremium !== undefined) {
      filteredResources = filteredResources.filter(resource =>
        resource.isPremium === filters.isPremium
      );
    }

    // Apply subject filter
    if (filters.subject) {
      filteredResources = filteredResources.filter(resource =>
        resource.subject === filters.subject
      );
    }

    return filteredResources;
  }

  static async getResourceById(id: string): Promise<Resource | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.mockResources.find(resource => resource.id === id) || null;
  }

  static async getResourcesByCategory(category: Partial<Resource['category']>): Promise<Resource[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return this.mockResources.filter(resource => {
      if (category.particle && resource.category.particle !== category.particle) return false;
      if (category.atom && resource.category.atom !== category.atom) return false;
      if (category.molecule && resource.category.molecule !== category.molecule) return false;
      if (category.matter && resource.category.matter !== category.matter) return false;
      return true;
    });
  }

  static async getPopularResources(limit: number = 10): Promise<Resource[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [...this.mockResources]
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, limit);
  }

  static async getFeaturedResources(limit: number = 6): Promise<Resource[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [...this.mockResources]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }
}
