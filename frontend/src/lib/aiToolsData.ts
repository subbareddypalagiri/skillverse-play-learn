import {
  MessageSquare, Code, Brain, Image, Zap, Palette, FileText, Video,
  Search, Mic, Music, GraduationCap, BookOpen, Bot,
  Globe, Wand2, Layers, Database, PenLine, Sparkles, Type, Camera,
  Languages, Eye, Cpu, Boxes, Play, RefreshCw
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface AITool {
  name: string;
  description: string;
  category: string;
  icon: LucideIcon;
  link: string;
  features: string[];
  isFree: boolean;
  source?: string;
  isLatest?: boolean;
}

export const categoryIconMap: Record<string, LucideIcon> = {
  All: Sparkles,
  Conversational: MessageSquare,
  Coding: Code,
  Design: Palette,
  Writing: PenLine,
  Research: Search,
  Productivity: FileText,
  "Video & Audio": Video,
  Education: GraduationCap,
  "Language Models": Brain,
  "Image Generation": Image,
  "Speech & Voice": Mic,
  "Vision & AI": Eye,
  Translation: Languages,
  "Writing & NLP": PenLine,
  "Research & QA": BookOpen,
  "Data & Embeddings": Database,
  "Agents & Automation": Bot,
  "Video & Animation": Video,
  "AI Demos & Spaces": Play,
  "Open Source": Globe,
};

export const getCategoryIcon = (category: string): LucideIcon =>
  categoryIconMap[category] || Sparkles;

export const aiToolCategories = [
  { name: "All", icon: Sparkles },
  { name: "Conversational", icon: MessageSquare },
  { name: "Coding", icon: Code },
  { name: "Design", icon: Palette },
  { name: "Writing", icon: PenLine },
  { name: "Research", icon: Search },
  { name: "Productivity", icon: FileText },
  { name: "Video & Audio", icon: Video },
  { name: "Education", icon: GraduationCap },
  { name: "Language Models", icon: Brain },
  { name: "Image Generation", icon: Image },
  { name: "Speech & Voice", icon: Mic },
  { name: "Vision & AI", icon: Eye },
  { name: "Translation", icon: Languages },
  { name: "Agents & Automation", icon: Bot },
  { name: "AI Demos & Spaces", icon: Play },
  { name: "Open Source", icon: Globe },
];

/** Static fallback when API is unavailable */
export const aiTools: AITool[] = [
  { name: "ChatGPT", description: "OpenAI's conversational AI for learning, coding, and writing", category: "Conversational", icon: MessageSquare, link: "https://chat.openai.com", features: ["Free tier", "GPT-4o mini", "Code help"], isFree: true },
  { name: "Claude AI", description: "Anthropic's AI for deep reasoning and document analysis", category: "Conversational", icon: Brain, link: "https://claude.ai", features: ["Free tier", "Long context", "File upload"], isFree: true },
  { name: "Google Gemini", description: "Google's multimodal AI for text, code, images, and search", category: "Conversational", icon: Sparkles, link: "https://gemini.google.com", features: ["Free tier", "Multimodal", "Google apps"], isFree: true },
  { name: "GitHub Copilot", description: "AI pair programmer with inline code suggestions", category: "Coding", icon: Code, link: "https://github.com/features/copilot", features: ["Student free", "Autocomplete", "Chat"], isFree: true },
  { name: "Cursor", description: "AI-first code editor built on VS Code", category: "Coding", icon: Code, link: "https://cursor.com", features: ["Free tier", "Codebase chat", "Composer"], isFree: true },
  { name: "Perplexity AI", description: "AI search with cited sources and real-time answers", category: "Research", icon: Zap, link: "https://www.perplexity.ai", features: ["Free tier", "Citations", "Pro search"], isFree: true },
  { name: "Leonardo AI", description: "AI image generation with fine-tuned models and styles", category: "Design", icon: Image, link: "https://leonardo.ai", features: ["Free daily", "High quality", "Models"], isFree: true },
  { name: "ElevenLabs", description: "Realistic AI voice generation and text-to-speech", category: "Speech & Voice", icon: Mic, link: "https://elevenlabs.io", features: ["Free tier", "Voice clone", "TTS"], isFree: true },
  { name: "Hugging Face", description: "Largest open AI model hub — 1M+ models and datasets", category: "Open Source", icon: Globe, link: "https://huggingface.co/models", features: ["Free", "1M+ models", "Community"], isFree: true },
  { name: "Ollama", description: "Run LLMs locally on your machine — Llama, Mistral, Gemma", category: "Open Source", icon: Cpu, link: "https://ollama.com", features: ["Free", "Local", "Private"], isFree: true },
];

export { RefreshCw, Boxes, Wand2, Layers, Type, Camera, Music };
