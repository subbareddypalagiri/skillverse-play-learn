import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  MessageSquare,
  Code,
  Brain,
  Image,
  Zap,
  ExternalLink,
  Filter,
  Star,
  Quote,
  Palette,
  FileText,
  Video,
  Music,
  Search,
  Presentation,
} from "lucide-react";

interface AITool {
  name: string;
  description: string;
  category: string;
  icon: any;
  color: string;
  bgColor: string;
  darkBgColor: string;
  link: string;
  howToUse: string[];
  testimonial: {
    text: string;
    author: string;
    role: string;
    rating: number;
  };
}

const AITools = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    { name: "All", icon: Sparkles },
    { name: "Conversational", icon: MessageSquare },
    { name: "Coding", icon: Code },
    { name: "Design", icon: Palette },
    { name: "Productivity", icon: FileText },
    { name: "Search", icon: Search },
  ];

  const tools: AITool[] = [
    {
      name: "ChatGPT",
      description:
        "Conversational AI assistant for answering questions, writing code, and problem-solving.",
      category: "Conversational",
      icon: MessageSquare,
      color: "text-green-600",
      bgColor: "bg-green-100",
      darkBgColor: "dark:bg-green-900/30",
      link: "https://chat.openai.com",
      howToUse: [
        "Ask questions about any topic",
        "Get help with coding and debugging",
        "Generate ideas and outlines",
        "Translate and summarize content",
      ],
      testimonial: {
        text: "ChatGPT has revolutionized how I approach learning. It's like having a tutor available 24/7!",
        author: "Sarah Johnson",
        role: "Computer Science Student",
        rating: 5,
      },
    },
    {
      name: "GitHub Copilot",
      description:
        "AI pair programmer that helps you write code faster with intelligent suggestions.",
      category: "Coding",
      icon: Code,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      darkBgColor: "dark:bg-blue-900/30",
      link: "https://github.com/features/copilot",
      howToUse: [
        "Install the extension in VS Code or IDE",
        "Start typing and get code completions",
        "Write comments to generate code",
        "Use chat for complex queries",
      ],
      testimonial: {
        text: "Copilot increased my coding speed by 40%. It's an absolute game-changer for developers.",
        author: "Michael Chen",
        role: "Full Stack Developer",
        rating: 5,
      },
    },
    {
      name: "Claude AI",
      description:
        "Advanced AI assistant by Anthropic for complex reasoning and detailed analysis.",
      category: "Conversational",
      icon: Brain,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      darkBgColor: "dark:bg-orange-900/30",
      link: "https://claude.ai",
      howToUse: [
        "Analyze long documents and code",
        "Get detailed explanations",
        "Work on complex projects",
        "Research and summarize information",
      ],
      testimonial: {
        text: "Claude's ability to understand context and provide nuanced responses is unmatched.",
        author: "Dr. Emily Rodriguez",
        role: "Research Scientist",
        rating: 5,
      },
    },
    {
      name: "Midjourney",
      description:
        "AI-powered image generation tool for creating stunning visuals from text descriptions.",
      category: "Design",
      icon: Image,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      darkBgColor: "dark:bg-purple-900/30",
      link: "https://www.midjourney.com",
      howToUse: [
        "Join Discord server and subscribe",
        "Use /imagine command with description",
        "Refine results with parameters",
        "Upscale and download images",
      ],
      testimonial: {
        text: "Midjourney brings my creative visions to life. The quality is mind-blowing!",
        author: "Alex Thompson",
        role: "Digital Artist",
        rating: 5,
      },
    },
    {
      name: "Perplexity AI",
      description:
        "AI-powered search engine that provides accurate answers with sources and citations.",
      category: "Search",
      icon: Zap,
      color: "text-teal-600",
      bgColor: "bg-teal-100",
      darkBgColor: "dark:bg-teal-900/30",
      link: "https://www.perplexity.ai",
      howToUse: [
        "Ask questions in natural language",
        "Get answers with verified sources",
        "Follow-up for deeper understanding",
        "Research topics comprehensively",
      ],
      testimonial: {
        text: "Perfect for research! Perplexity provides accurate answers with reliable sources.",
        author: "David Martinez",
        role: "Graduate Student",
        rating: 5,
      },
    },
    {
      name: "Google Gemini",
      description:
        "Google's multimodal AI for text, code, images, and more with deep integration.",
      category: "Conversational",
      icon: Sparkles,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      darkBgColor: "dark:bg-indigo-900/30",
      link: "https://gemini.google.com",
      howToUse: [
        "Process images, videos, and text",
        "Code generation and debugging",
        "Integrate with Google Workspace",
        "Long context conversations",
      ],
      testimonial: {
        text: "Gemini's multimodal capabilities are impressive. It seamlessly handles all my tasks.",
        author: "Priya Patel",
        role: "Product Manager",
        rating: 5,
      },
    },
    {
      name: "Canva AI",
      description:
        "Design platform with AI-powered tools for creating professional graphics effortlessly.",
      category: "Design",
      icon: Palette,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
      darkBgColor: "dark:bg-pink-900/30",
      link: "https://www.canva.com",
      howToUse: [
        "Choose from thousands of templates",
        "Use Magic Design for instant layouts",
        "Generate images with Text to Image",
        "Remove backgrounds automatically",
      ],
      testimonial: {
        text: "Canva makes professional design accessible to everyone. The AI features are incredible!",
        author: "Jessica Lee",
        role: "Social Media Manager",
        rating: 5,
      },
    },
    {
      name: "Notion AI",
      description:
        "AI-powered workspace that helps you write, plan, and organize better and faster.",
      category: "Productivity",
      icon: FileText,
      color: "text-gray-700",
      bgColor: "bg-gray-100",
      darkBgColor: "dark:bg-gray-800/30",
      link: "https://www.notion.so/product/ai",
      howToUse: [
        "Summarize long documents instantly",
        "Generate content and ideas",
        "Improve writing and fix grammar",
        "Translate and change tone",
      ],
      testimonial: {
        text: "Notion AI streamlines my workflow. Writing and organizing has never been easier!",
        author: "Mark Williams",
        role: "Project Manager",
        rating: 5,
      },
    },
    {
      name: "Runway ML",
      description:
        "AI-powered creative suite for video editing, image generation, and multimedia creation.",
      category: "Design",
      icon: Video,
      color: "text-red-600",
      bgColor: "bg-red-100",
      darkBgColor: "dark:bg-red-900/30",
      link: "https://runwayml.com",
      howToUse: [
        "Edit videos with AI assistance",
        "Generate videos from text",
        "Remove objects from footage",
        "Apply AI effects and filters",
      ],
      testimonial: {
        text: "Runway ML makes professional video editing accessible. The AI tools are revolutionary!",
        author: "Chris Anderson",
        role: "Content Creator",
        rating: 5,
      },
    },
    {
      name: "Grammarly",
      description:
        "AI writing assistant that helps you write clear, mistake-free content with confidence.",
      category: "Productivity",
      icon: FileText,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      darkBgColor: "dark:bg-emerald-900/30",
      link: "https://www.grammarly.com",
      howToUse: [
        "Install browser extension or app",
        "Get real-time writing suggestions",
        "Check grammar, spelling, and tone",
        "Improve clarity and engagement",
      ],
      testimonial: {
        text: "Grammarly has improved my writing significantly. It's like having an editor on demand!",
        author: "Rachel Green",
        role: "Content Writer",
        rating: 5,
      },
    },
    {
      name: "Replit AI",
      description:
        "Collaborative coding platform with AI assistance for building and deploying software.",
      category: "Coding",
      icon: Code,
      color: "text-violet-600",
      bgColor: "bg-violet-100",
      darkBgColor: "dark:bg-violet-900/30",
      link: "https://replit.com",
      howToUse: [
        "Start coding in browser instantly",
        "Get AI code completions",
        "Deploy projects with one click",
        "Collaborate in real-time",
      ],
      testimonial: {
        text: "Replit makes coding accessible anywhere. The AI features help me learn faster!",
        author: "Tom Harris",
        role: "Aspiring Developer",
        rating: 4,
      },
    },
    {
      name: "Beautiful.ai",
      description:
        "AI-powered presentation software that creates stunning slides automatically.",
      category: "Design",
      icon: Presentation,
      color: "text-cyan-600",
      bgColor: "bg-cyan-100",
      darkBgColor: "dark:bg-cyan-900/30",
      link: "https://www.beautiful.ai",
      howToUse: [
        "Choose a template to start",
        "AI suggests layouts automatically",
        "Add content and let AI design",
        "Export and present professionally",
      ],
      testimonial: {
        text: "Beautiful.ai takes the pain out of presentations. My slides look professional every time!",
        author: "Lisa Brown",
        role: "Business Analyst",
        rating: 5,
      },
    },
  ];

  const filteredTools =
    selectedCategory === "All"
      ? tools
      : tools.filter((tool) => tool.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI Tools & Resources
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover and explore powerful AI tools to enhance your learning
              journey and boost productivity
            </p>
          </div>

          {/* Filter Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <span className="font-semibold">Filter by Category:</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    variant={
                      selectedCategory === category.name ? "default" : "outline"
                    }
                    className={`transition-all duration-300 ${
                      selectedCategory === category.name
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 scale-105"
                        : "hover:scale-105"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {category.name}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Card
                  key={index}
                  className="overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-2 group"
                >
                  {/* Card Header with Icon */}
                  <div className="relative h-32 bg-gradient-to-br from-purple-600/10 to-blue-600/10 flex items-center justify-center">
                    <div
                      className={`p-4 ${tool.bgColor} ${tool.darkBgColor} rounded-2xl group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className={`w-10 h-10 ${tool.color}`} />
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Category Badge */}
                    <Badge
                      variant="secondary"
                      className="mb-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20"
                    >
                      {tool.category}
                    </Badge>

                    {/* Tool Name */}
                    <h3 className="text-2xl font-bold mb-2">{tool.name}</h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4">
                      {tool.description}
                    </p>

                    {/* How to Use */}
                    <div className="mb-4">
                      <p className="text-sm font-semibold mb-2 flex items-center gap-1">
                        <Code className="w-4 h-4" />
                        How to use:
                      </p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {tool.howToUse.slice(0, 3).map((step, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-purple-600 mt-0.5">•</span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Testimonial */}
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 mb-4">
                      <Quote className="w-4 h-4 text-purple-600 mb-2" />
                      <p className="text-xs italic text-muted-foreground mb-2">
                        "{tool.testimonial.text}"
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold">
                            {tool.testimonial.author}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {tool.testimonial.role}
                          </p>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(tool.testimonial.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-3 h-3 fill-amber-400 text-amber-400"
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Visit Button */}
                    <Button
                      onClick={() => window.open(tool.link, "_blank")}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-all duration-300 hover:scale-105"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit {tool.name}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredTools.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center p-4 bg-muted rounded-full mb-4">
                <Search className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No tools found</h3>
              <p className="text-muted-foreground">
                Try selecting a different category
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AITools;
