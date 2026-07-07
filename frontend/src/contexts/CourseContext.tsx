import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '@/lib/apiClient';

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
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>((() => {
    try {
      const saved = localStorage.getItem('enrolledCourses');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }) as any);

  useEffect(() => {
    try {
      localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
    } catch (e) {
      console.error('Error saving enrolled courses:', e);
    }
  }, [enrolledCourses]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      apiClient.get('/courses/my-enrollments')
        .then(res => {
          if (res.data?.data?.enrollments) {
            const backendCourses = res.data.data.enrollments.map((e: any) => ({
              title: e.courseId?.title || 'Enrolled Course',
              instructor: e.courseId?.ownerId?.name || 'Instructor',
              duration: e.courseId?.duration || '12 weeks',
              students: e.courseId?.students || 100,
              rating: e.courseId?.rating || 4.8,
              level: e.courseId?.level || 'Beginner',
              category: e.courseId?.category || 'Development',
              enrolledDate: e.enrolledAt || new Date().toISOString(),
              progress: e.progress || 0,
              completedLessons: e.completedLessonsCount || 0,
              totalLessons: e.totalLessons || 20,
              nextLesson: 'Course Introduction',
              lastAccessed: e.lastActivityAt || new Date().toISOString(),
            }));
            setEnrolledCourses(prev => {
              const existingTitles = new Set(prev.map(c => c.title));
              const newCourses = backendCourses.filter((c: any) => !existingTitles.has(c.title));
              if (newCourses.length === 0) return prev;
              return [...prev, ...newCourses];
            });
          }
        })
        .catch(() => {});
    }
  }, []);

  const addCourse = (courseData: Omit<Course, 'enrolledDate' | 'progress' | 'completedLessons' | 'totalLessons' | 'nextLesson' | 'lastAccessed'>) => {
    setEnrolledCourses(prev => {
      if (prev.some(c => c.title === courseData.title)) return prev;
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
      return [...prev, newCourse];
    });
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
