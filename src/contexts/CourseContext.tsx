import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Course {
  title: string;
  instructor: string;
  duration: string;
  students: number;
  rating: number;
  level: string;
  category: string;
  enrolledDate: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  nextLesson: string;
  lastAccessed: string;
}

interface CourseContextType {
  enrolledCourses: Course[];
  addCourse: (course: Omit<Course, 'enrolledDate' | 'progress' | 'completedLessons' | 'totalLessons' | 'nextLesson' | 'lastAccessed'>) => void;
  updateProgress: (courseTitle: string, progress: number, completedLessons: number) => void;
  getCourseProgress: (courseTitle: string) => Course | undefined;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const useCourseContext = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourseContext must be used within a CourseProvider');
  }
  return context;
};

interface CourseProviderProps {
  children: ReactNode;
}

export const CourseProvider: React.FC<CourseProviderProps> = ({ children }) => {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);

  const addCourse = (courseData: Omit<Course, 'enrolledDate' | 'progress' | 'completedLessons' | 'totalLessons' | 'nextLesson' | 'lastAccessed'>) => {
    const now = new Date().toISOString();
    const newCourse: Course = {
      ...courseData,
      enrolledDate: now,
      progress: 0,
      completedLessons: 0,
      totalLessons: getTotalLessons(courseData.category),
      nextLesson: getFirstLesson(courseData.category),
      lastAccessed: now,
    };
    
    setEnrolledCourses(prev => [...prev, newCourse]);
  };

  const updateProgress = (courseTitle: string, progress: number, completedLessons: number) => {
    setEnrolledCourses(prev => 
      prev.map(course => 
        course.title === courseTitle 
          ? { 
              ...course, 
              progress, 
              completedLessons,
              lastAccessed: new Date().toISOString(),
              nextLesson: getNextLesson(course.category, completedLessons)
            }
          : course
      )
    );
  };

  const getCourseProgress = (courseTitle: string) => {
    return enrolledCourses.find(course => course.title === courseTitle);
  };

  // Helper functions to determine course structure based on category
  const getTotalLessons = (category: string): number => {
    switch (category) {
      case 'Development': return 24;
      case 'Computer Science': return 20;
      case 'Design': return 16;
      case 'AI & ML': return 28;
      case 'Marketing': return 12;
      default: return 20;
    }
  };

  const getFirstLesson = (category: string): string => {
    switch (category) {
      case 'Development': return 'Introduction to Web Development';
      case 'Computer Science': return 'Algorithm Basics';
      case 'Design': return 'Design Principles';
      case 'AI & ML': return 'Machine Learning Fundamentals';
      case 'Marketing': return 'Digital Marketing Overview';
      default: return 'Course Introduction';
    }
  };

  const getNextLesson = (category: string, completedLessons: number): string => {
    const lessons = {
      'Development': [
        'Introduction to Web Development',
        'HTML & CSS Basics',
        'JavaScript Fundamentals',
        'DOM Manipulation',
        'React Components',
        'React Hooks',
        'State Management',
        'API Integration',
        'Project Setup',
        'Advanced React Patterns',
        'Testing & Debugging',
        'Deployment Strategies'
      ],
      'Computer Science': [
        'Algorithm Basics',
        'Data Structures Overview',
        'Arrays & Linked Lists',
        'Stacks & Queues',
        'Trees & Binary Trees',
        'Graphs',
        'Sorting Algorithms',
        'Search Algorithms',
        'Dynamic Programming',
        'Complexity Analysis'
      ],
      'Design': [
        'Design Principles',
        'Color Theory',
        'Typography',
        'Layout Design',
        'User Experience',
        'Wireframing',
        'Prototyping',
        'Design Tools'
      ],
      'AI & ML': [
        'Machine Learning Fundamentals',
        'Data Preprocessing',
        'Supervised Learning',
        'Unsupervised Learning',
        'Neural Networks',
        'Deep Learning',
        'Model Evaluation',
        'Natural Language Processing'
      ],
      'Marketing': [
        'Digital Marketing Overview',
        'SEO Fundamentals',
        'Social Media Marketing',
        'Content Marketing',
        'Email Marketing',
        'Analytics & Metrics'
      ]
    };

    const categoryLessons = lessons[category as keyof typeof lessons] || lessons['Development'];
    const nextIndex = completedLessons;
    
    if (nextIndex >= categoryLessons.length) {
      return 'Course Completed';
    }
    
    return categoryLessons[nextIndex];
  };

  return (
    <CourseContext.Provider value={{
      enrolledCourses,
      addCourse,
      updateProgress,
      getCourseProgress
    }}>
      {children}
    </CourseContext.Provider>
  );
};
