import { useState, useEffect } from 'react';

// This is a mock hook that would be replaced with actual API calls in a real application
export const useProblems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProblems([
        {
          id: 1,
          title: "Advanced Calculus Problem Set",
          description: "Solve the following problems related to multivariable calculus and optimization.",
          subject: "Mathematics",
          status: "active",
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          color: "#4285F4",
          submissionCount: 12,
          totalStudents: 30
        },
        {
          id: 2,
          title: "Literary Analysis: Shakespeare's Macbeth",
          description: "Analyze the themes of ambition and moral corruption in Shakespeare's Macbeth.",
          subject: "Literature",
          status: "active",
          deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
          color: "#EA4335",
          submissionCount: 8,
          totalStudents: 25
        },
        {
          id: 3,
          title: "Physics: Quantum Mechanics Principles",
          description: "Explain the fundamental principles of quantum mechanics and their applications.",
          subject: "Physics",
          status: "active",
          deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          color: "#FBBC05",
          submissionCount: 22,
          totalStudents: 28
        },
        {
          id: 4,
          title: "Introduction to Python Programming",
          description: "Create a simple program that demonstrates basic Python concepts including variables, loops, and functions.",
          subject: "Computer Science",
          status: "graded",
          deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
          color: "#34A853",
          submissionCount: 27,
          totalStudents: 30,
          averageScore: "85%",
          highestScore: "98%"
        },
        {
          id: 5,
          title: "Historical Analysis: World War II",
          description: "Analyze the causes and consequences of World War II with a focus on diplomatic relations.",
          subject: "History",
          status: "graded",
          deadline: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
          color: "#673AB7",
          submissionCount: 24,
          /* totalStudents: 28,
          averageScore: "78%",
          highestScore: "95%" */
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return { problems, loading, setProblems };
};
