import { useState } from "react";
import PageLayout from "@/components/PageLayout";
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
  Star,
  Palette,
  FileText,
  Video,
  Search,
  Presentation,
  ArrowRight,
} from "lucide-react";

interface AITool {
  name: string;
  description: string;
  category: string;
  icon: any;
  link: string;
  features: string[];
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
      description: "Conversational AI for questions, code, and problem-solving",
      category: "Conversational",
      icon: MessageSquare,
      link: "https://chat.openai.com",
      features: ["Natural conversations", "Code assistance", "Content generation"],
    },
    {
      name: "GitHub Copilot",
      description: "AI pair programmer with intelligent code suggestions",
      category: "Coding",
      icon: Code,
      link: "https://github.com/features/copilot",
      features: ["Code completions", "Context-aware", "Multi-language support"],
    },
    {
      name: "Claude AI",
      description: "Advanced AI for complex reasoning and detailed analysis",
      category: "Conversational",
      icon: Brain,
      link: "https://claude.ai",
      features: ["Long context", "Document analysis", "Nuanced responses"],
    },
    {
      name: "Midjourney",
      description: "AI image generation from text descriptions",
      category: "Design",
      icon: Image,
      link: "https://www.midjourney.com",
      features: ["Text to image", "High quality", "Creative styles"],
    },
    {
      name: "Perplexity AI",
      description: "AI search with accurate answers and citations",
      category: "Search",
      icon: Zap,
      link: "https://www.perplexity.ai",
      features: ["Source verification", "Real-time data", "Deep research"],
    },
    {
      name: "Google Gemini",
      description: "Multimodal AI for text, code, and images",
      category: "Conversational",
      icon: Sparkles,
      link: "https://gemini.google.com",
      features: ["Multimodal", "Google integration", "Long context"],
    },
    {
      name: "Canva AI",
      description: "AI-powered design for professional graphics",
      category: "Design",
      icon: Palette,
      link: "https://www.canva.com",
      features: ["Magic Design", "Templates", "Background removal"],
    },
    {
      name: "Notion AI",
      description: "AI workspace for writing and organizing",
      category: "Productivity",
      icon: FileText,
      link: "https://www.notion.so/product/ai",
      features: ["Summarization", "Content generation", "Writing improvement"],
    },
    {
      name: "Runway ML",
      description: "AI creative suite for video and multimedia",
      category: "Design",
      icon: Video,
      link: "https://runwayml.com",
      features: ["Video editing", "Text to video", "AI effects"],
    },
    {
      name: "Grammarly",
      description: "AI writing assistant for clear, mistake-free content",
      category: "Productivity",
      icon: FileText,
      link: "https://www.grammarly.com",
      features: ["Grammar check", "Tone detection", "Clarity suggestions"],
    },
    {
      name: "Replit AI",
      description: "Collaborative coding with AI assistance",
      category: "Coding",
      icon: Code,
      link: "https://replit.com",
      features: ["Browser coding", "AI completions", "One-click deploy"],
    },
    {
      name: "Beautiful.ai",
      description: "AI-powered presentations with auto-design",
      category: "Design",
      icon: Presentation,
      link: "https://www.beautiful.ai",
      features: ["Smart layouts", "Auto-formatting", "Professional templates"],
    },
  ];

  const filteredTools =
    selectedCategory === "All"
      ? tools
      : tools.filter((tool) => tool.category === selectedCategory);

  return (
    <PageLayout>
          
          {/* Clean Header Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm font-medium text-primary">Resources</p>
            </div>
            <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-2">
              AI Tools
            </h1>
            <p className="text-muted-foreground max-w-xl">
              Discover powerful AI tools to enhance your learning and productivity
            </p>
          </div>

          {/* Filter Section - Minimal Pills */}
          <div className="mb-10">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = selectedCategory === category.name;
                return (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`
                      inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                      transition-all duration-300
                      ${isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                      }
                    `}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tools Grid - Uniform Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-card rounded-2xl border border-border/50 overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    opacity: 0,
                    animation: `fadeInUp 0.5s ease-out ${index * 50}ms forwards`
                  }}
                >
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="p-5 h-full flex flex-col">
                    {/* Icon and Category Row */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2.5 bg-primary/10 rounded-xl group-hover:bg-primary/15 transition-colors duration-300">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <Badge variant="secondary" className="text-xs bg-muted/50">
                        {tool.category}
                      </Badge>
                    </div>
                    
                    {/* Tool Name */}
                    <h3 className="text-base font-semibold mb-1.5 group-hover:text-primary transition-colors duration-300">
                      {tool.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
                      {tool.description}
                    </p>
                    
                    {/* Features */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {tool.features.map((feature, idx) => (
                        <span 
                          key={idx}
                          className="text-xs px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    {/* Visit Button */}
                    <Button
                      onClick={() => window.open(tool.link, "_blank")}
                      variant="outline"
                      size="sm"
                      className="w-full border-border/50 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 group/btn"
                    >
                      <span>Visit</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredTools.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center p-4 bg-muted/50 rounded-2xl mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No tools found</h3>
              <p className="text-muted-foreground text-sm">
                Try selecting a different category
              </p>
            </div>
          )}
      {/* CSS Animation */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </PageLayout>
  );
};

export default AITools;
