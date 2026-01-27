import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Code,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  BookOpen,
  Zap,
  Target,
  Award
} from 'lucide-react';

interface Problem {
  _id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  source: 'LeetCode' | 'GeeksforGeeks' | 'HackerRank' | 'CodeForces' | 'AtCoder' | 'CodeChef';
  externalUrl: string;
  category: string;
  topic?: string;
  successRate: number;
  attempts: number;
  tags?: string[];
  description?: string;
}

interface ProblemRecommendationsProps {
  courseId: string;
  topicIndex: number;
  topicName: string;
  onProblemAttempt?: (problemId: string) => void;
}

const ProblemRecommendations: React.FC<ProblemRecommendationsProps> = ({
  courseId,
  topicIndex,
  topicName,
  onProblemAttempt
}) => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [userLevel, setUserLevel] = useState('Beginner');
  const [difficulty, setDifficulty] = useState({ min: 'Easy', max: 'Medium' });
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    loadRecommendedProblems();
  }, [courseId, topicIndex]);

  const loadRecommendedProblems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');

      const response = await fetch(
        `/api/problems/recommended/${courseId}/${topicIndex}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProblems(data.data.problems);
        setUserLevel(data.userLevel);
        setDifficulty(data.difficulty);
      }
    } catch (error) {
      console.error('Error loading problems:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Hard':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceIcon = (source: string) => {
    const icons: Record<string, string> = {
      'LeetCode': '🔵',
      'GeeksforGeeks': '🟢',
      'HackerRank': '🟣',
      'CodeForces': '⚙️',
      'AtCoder': '🎯',
      'CodeChef': '👨‍🍳'
    };
    return icons[source] || '📝';
  };

  const handleSolveClick = (problem: Problem) => {
    setSelectedProblem(problem);
    setShowDialog(true);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 border border-blue-200 dark:border-blue-700">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-2xl font-bold flex items-center gap-2 mb-2">
              <Code className="w-6 h-6 text-blue-600" />
              Practice Problems
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Topic: <span className="font-semibold">{topicName}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Your Level</p>
            <p className="text-lg font-bold text-blue-600">{userLevel}</p>
            <p className="text-xs text-gray-500 mt-1">
              {difficulty.min} - {difficulty.max}
            </p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Problems Grid */}
      {!loading && problems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {problems.map((problem) => (
            <Card key={problem._id} className="hover:shadow-lg transition-all overflow-hidden">
              <div className="p-4 space-y-3">
                {/* Problem Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{getSourceIcon(problem.source)}</span>
                      <span className="text-xs font-medium text-gray-500">{problem.source}</span>
                    </div>
                    <h4 className="font-semibold text-sm line-clamp-2 hover:text-blue-600">
                      {problem.title}
                    </h4>
                  </div>
                  <Badge className={`${getDifficultyColor(problem.difficulty)} border`}>
                    {problem.difficulty}
                  </Badge>
                </div>

                {/* Category & Tags */}
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">
                    {problem.category}
                  </Badge>
                  {problem.tags?.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 gap-2 text-sm bg-gray-50 dark:bg-gray-900/30 p-2 rounded">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {Math.round(problem.successRate)}% solved
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {problem.attempts} attempts
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => handleSolveClick(problem)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2"
                    size="sm"
                  >
                    <Zap className="w-4 h-4" />
                    Solve
                  </Button>
                  <Button
                    onClick={() => window.open(problem.externalUrl, '_blank')}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* No Problems State */}
      {!loading && problems.length === 0 && (
        <Card className="p-12 text-center bg-gray-50 dark:bg-gray-900/30">
          <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            No problems available for this topic yet.
          </p>
          <p className="text-sm text-gray-500">
            Check back soon for curated problems!
          </p>
        </Card>
      )}

      {/* Problem Detail Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              {selectedProblem?.title}
            </DialogTitle>
          </DialogHeader>

          {selectedProblem && (
            <div className="space-y-4">
              {/* Problem Metadata */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-900/30 rounded">
                  <p className="text-xs text-gray-500 mb-1">Difficulty</p>
                  <Badge className={getDifficultyColor(selectedProblem.difficulty)}>
                    {selectedProblem.difficulty}
                  </Badge>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-900/30 rounded">
                  <p className="text-xs text-gray-500 mb-1">Source</p>
                  <p className="font-semibold text-sm flex items-center gap-1">
                    <span>{getSourceIcon(selectedProblem.source)}</span>
                    {selectedProblem.source}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-900/30 rounded">
                  <p className="text-xs text-gray-500 mb-1">Success Rate</p>
                  <p className="font-semibold text-sm text-green-600">
                    {Math.round(selectedProblem.successRate)}%
                  </p>
                </div>
              </div>

              {/* Description */}
              {selectedProblem.description && (
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {selectedProblem.description}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  onClick={() => {
                    if (onProblemAttempt) onProblemAttempt(selectedProblem._id);
                    window.open(selectedProblem.externalUrl, '_blank');
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2"
                >
                  <Code className="w-4 h-4" />
                  Solve on {selectedProblem.source}
                </Button>
                <Button
                  onClick={() => setShowDialog(false)}
                  variant="outline"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProblemRecommendations;
