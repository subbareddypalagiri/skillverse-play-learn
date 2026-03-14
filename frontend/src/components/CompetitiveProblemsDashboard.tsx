import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Code,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Award,
  Zap,
  Target,
  BookOpen,
  GitBranch,
  Trophy
} from 'lucide-react';

interface UserDifficultyLevel {
  _id: string;
  userId: string;
  currentLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  recommendedDifficultyRange: {
    min: 'Easy' | 'Medium' | 'Hard';
    max: 'Easy' | 'Medium' | 'Hard';
  };
  totalProblemsAttempted: number;
  totalProblemsSolved: number;
  overallSuccessRate: number;
  easyProblems: { attempted: number; solved: number; successRate: number };
  mediumProblems: { attempted: number; solved: number; successRate: number };
  hardProblems: { attempted: number; solved: number; successRate: number };
}

interface ProblemAttempt {
  _id: string;
  problemId: { title: string; difficulty: string; source: string };
  verdict: string;
  submittedAt: string;
  runtime?: number;
  memory?: number;
  testCasesPass?: number;
  testCasesTotal?: number;
}

const CompetitiveProblemsDashboard: React.FC = () => {
  const [userLevel, setUserLevel] = useState<UserDifficultyLevel | null>(null);
  const [attempts, setAttempts] = useState<ProblemAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');

      // Fetch difficulty level
      const diffResponse = await fetch(`/api/problems/difficulty/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (diffResponse.ok) {
        const diffData = await diffResponse.json();
        setUserLevel(diffData.data.difficulty);
      }

      // Fetch problem history
      const historyResponse = await fetch(`/api/problems/history/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        setAttempts(historyData.data.attempts);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Expert':
        return 'from-purple-600 to-pink-600';
      case 'Advanced':
        return 'from-blue-600 to-cyan-600';
      case 'Intermediate':
        return 'from-yellow-600 to-orange-600';
      case 'Beginner':
        return 'from-green-600 to-blue-600';
      default:
        return 'from-gray-600 to-gray-700';
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'Accepted':
        return 'text-green-600 bg-green-50';
      case 'Wrong Answer':
        return 'text-red-600 bg-red-50';
      case 'Time Limit Exceeded':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Section */}
      <div className={`rounded-lg bg-gradient-to-r ${userLevel ? getLevelColor(userLevel.currentLevel) : 'from-gray-600 to-gray-700'} text-white p-8`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Code className="w-8 h-8" />
              <h1 className="text-4xl font-black">Competitive Problems</h1>
            </div>
            <p className="text-lg opacity-90">
              Master coding through practice and evaluation
            </p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-black mb-2">
              {userLevel?.currentLevel || 'Beginner'}
            </div>
            <Badge className="bg-white/30 text-white border-white/50">
              🔥 {userLevel?.totalProblemsSolved || 0} Problems Solved
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {userLevel && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Overall Stats */}
          <Card className="p-6 border-2 hover:border-blue-400 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <Target className="w-6 h-6 text-blue-500" />
              <Badge variant="secondary">📊</Badge>
            </div>
            <p className="text-3xl font-bold mb-1">{userLevel.totalProblemsAttempted}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Attempts</p>
            <Progress 
              value={(userLevel.totalProblemsSolved / Math.max(userLevel.totalProblemsAttempted, 1)) * 100}
              className="mt-3"
            />
          </Card>

          {/* Solved */}
          <Card className="p-6 border-2 hover:border-green-400 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              <Badge className="bg-green-100 text-green-700">✓</Badge>
            </div>
            <p className="text-3xl font-bold mb-1">{userLevel.totalProblemsSolved}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Problems Solved</p>
            <p className="text-xs text-green-600 mt-2 font-medium">
              {Math.round(userLevel.overallSuccessRate)}% Success Rate
            </p>
          </Card>

          {/* Difficulty Range */}
          <Card className="p-6 border-2 hover:border-purple-400 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <Zap className="w-6 h-6 text-purple-500" />
              <Badge variant="secondary">⚡</Badge>
            </div>
            <p className="text-lg font-bold mb-1">Recommended</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {userLevel.recommendedDifficultyRange.min} - {userLevel.recommendedDifficultyRange.max}
            </p>
            <p className="text-xs text-purple-600 mt-2 font-medium">
              Adaptive difficulty
            </p>
          </Card>

          {/* Skill Level */}
          <Card className="p-6 border-2 hover:border-yellow-400 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <Badge className="bg-yellow-100 text-yellow-700">🏆</Badge>
            </div>
            <p className="text-lg font-bold mb-1">Skill Progress</p>
            <Progress value={userLevel.totalProblemsSolved * 5} className="mt-2" />
            <p className="text-xs text-yellow-600 mt-2 font-medium">
              {Math.min(userLevel.totalProblemsSolved * 5, 100)}%
            </p>
          </Card>
        </div>
      )}

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="difficulty">Difficulty Progress</TabsTrigger>
          <TabsTrigger value="recent">Recent Attempts</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {userLevel && (
            <>
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Problem Statistics by Difficulty
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Easy */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-green-600 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        Easy
                      </h4>
                      <Badge variant="outline" className="text-green-600">
                        {userLevel.easyProblems.solved}/{userLevel.easyProblems.attempted}
                      </Badge>
                    </div>
                    <Progress value={userLevel.easyProblems.successRate} className="h-3" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {Math.round(userLevel.easyProblems.successRate)}% Success Rate
                    </p>
                  </div>

                  {/* Medium */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-yellow-600 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        Medium
                      </h4>
                      <Badge variant="outline" className="text-yellow-600">
                        {userLevel.mediumProblems.solved}/{userLevel.mediumProblems.attempted}
                      </Badge>
                    </div>
                    <Progress value={userLevel.mediumProblems.successRate} className="h-3" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {Math.round(userLevel.mediumProblems.successRate)}% Success Rate
                    </p>
                  </div>

                  {/* Hard */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-red-600 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        Hard
                      </h4>
                      <Badge variant="outline" className="text-red-600">
                        {userLevel.hardProblems.solved}/{userLevel.hardProblems.attempted}
                      </Badge>
                    </div>
                    <Progress value={userLevel.hardProblems.successRate} className="h-3" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {Math.round(userLevel.hardProblems.successRate)}% Success Rate
                    </p>
                  </div>
                </div>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Difficulty Progress Tab */}
        <TabsContent value="difficulty" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Difficulty Progression
            </h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Your difficulty range automatically adjusts based on your success rate:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-green-600">75%+ success rate</span> → Advanced Level
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                  <span className="text-yellow-600">60-75% success rate</span> → Intermediate Level
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  <span className="text-red-600">&lt;60% success rate</span> → Beginner Level
                </li>
              </ul>
            </div>
          </Card>
        </TabsContent>

        {/* Recent Attempts Tab */}
        <TabsContent value="recent" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-blue-600" />
              Recent Attempts ({attempts.length})
            </h3>
            {attempts.length > 0 ? (
              <div className="space-y-3">
                {attempts.slice(0, 10).map((attempt) => (
                  <div
                    key={attempt._id}
                    className={`p-4 rounded-lg border flex items-center justify-between ${getVerdictColor(attempt.verdict)}`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {attempt.verdict === 'Accepted' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <div>
                        <p className="font-semibold text-sm">
                          {attempt.problemId.title}
                        </p>
                        <p className="text-xs opacity-75">
                          {new Date(attempt.submittedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={`mb-1 ${getVerdictColor(attempt.verdict)}`}>
                        {attempt.verdict}
                      </Badge>
                      {attempt.testCasesPass !== undefined && (
                        <p className="text-xs opacity-75">
                          {attempt.testCasesPass}/{attempt.testCasesTotal} passed
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                No problem attempts yet. Start solving!
              </p>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompetitiveProblemsDashboard;
