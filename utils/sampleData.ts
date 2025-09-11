import { MediaResource } from '@/types/mediaViewer.types';

export const sampleResources: MediaResource[] = [
  {
    id: '1',
    title: 'Introduction to Algebra - Linear Equations',
    type: 'pdf',
    url: 'https://www.africau.edu/images/default/sample.pdf',
    description: 'A comprehensive guide to understanding linear equations and their applications in mathematics.',
    size: 2048576, // 2MB
    createdAt: '2025-01-10T10:00:00Z',
    metadata: {
      subject: 'Mathematics',
      grade: 'Grade 10',
      difficulty: 'Intermediate'
    }
  },
  {
    id: '2',
    title: 'Quadratic Functions Explained',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    description: 'Learn about quadratic functions, their graphs, and real-world applications.',
    duration: 1200, // 20 minutes
    size: 52428800, // 50MB
    createdAt: '2025-01-09T14:30:00Z',
    metadata: {
      subject: 'Mathematics',
      grade: 'Grade 11',
      difficulty: 'Advanced'
    }
  },
  {
    id: '3',
    title: 'Geometry Concepts Diagram',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
    description: 'Visual representation of key geometry concepts including angles, triangles, and circles.',
    size: 1048576, // 1MB
    createdAt: '2025-01-08T09:15:00Z',
    metadata: {
      subject: 'Mathematics',
      grade: 'Grade 9',
      difficulty: 'Beginner'
    }
  },
  {
    id: '4',
    title: 'Physics Fundamentals - Motion and Forces',
    type: 'pdf',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    description: 'Understanding the basics of motion, velocity, acceleration, and forces in physics.',
    size: 3145728, // 3MB
    createdAt: '2025-01-07T16:45:00Z',
    metadata: {
      subject: 'Physics',
      grade: 'Grade 11',
      difficulty: 'Intermediate'
    }
  },
  {
    id: '5',
    title: 'Chemistry Lab Experiment Demo',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    description: 'A step-by-step demonstration of a chemical reaction experiment.',
    duration: 900, // 15 minutes
    size: 41943040, // 40MB
    createdAt: '2025-01-06T11:20:00Z',
    metadata: {
      subject: 'Chemistry',
      grade: 'Grade 12',
      difficulty: 'Advanced'
    }
  },
  {
    id: '6',
    title: 'Historical Timeline Infographic',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    description: 'A detailed timeline showing major historical events and their connections.',
    size: 2097152, // 2MB
    createdAt: '2025-01-05T13:10:00Z',
    metadata: {
      subject: 'History',
      grade: 'Grade 10',
      difficulty: 'Intermediate'
    }
  }
];

export const getResourceById = (id: string): MediaResource | undefined => {
  return sampleResources.find(resource => resource.id === id);
};

export const getResourcesByType = (type: MediaResource['type']): MediaResource[] => {
  return sampleResources.filter(resource => resource.type === type);
};

export const getResourcesBySubject = (subject: string): MediaResource[] => {
  return sampleResources.filter(resource => 
    resource.metadata?.subject?.toLowerCase() === subject.toLowerCase()
  );
};
