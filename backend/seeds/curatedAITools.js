/** Curated AI tools — seeded into MongoDB, merged with live Hugging Face models */
export const curatedAITools = [
  // Conversational
  { name: "ChatGPT", description: "OpenAI's conversational AI for learning, coding, and writing", category: "Conversational", link: "https://chat.openai.com", features: ["Free tier", "GPT-4o mini", "Code help"], isFree: true },
  { name: "Claude AI", description: "Anthropic's AI for deep reasoning and document analysis", category: "Conversational", link: "https://claude.ai", features: ["Free tier", "Long context", "File upload"], isFree: true },
  { name: "Google Gemini", description: "Google's multimodal AI for text, code, images, and search", category: "Conversational", link: "https://gemini.google.com", features: ["Free tier", "Multimodal", "Google apps"], isFree: true },
  { name: "Microsoft Copilot", description: "Free AI assistant powered by GPT with web search", category: "Conversational", link: "https://copilot.microsoft.com", features: ["Free", "Web search", "Image gen"], isFree: true },
  { name: "Meta AI", description: "Meta's Llama-powered assistant across WhatsApp and web", category: "Conversational", link: "https://www.meta.ai", features: ["Free", "Image gen", "Llama models"], isFree: true },
  { name: "HuggingChat", description: "Open-source chat with Llama, Mistral, and more models", category: "Conversational", link: "https://huggingface.co/chat", features: ["Free", "Open models", "No login"], isFree: true },
  { name: "Poe", description: "Access multiple AI models in one place — GPT, Claude, Gemini", category: "Conversational", link: "https://poe.com", features: ["Free tier", "Multi-model", "Bots"], isFree: true },
  { name: "Pi AI", description: "Personal AI for friendly conversations and brainstorming", category: "Conversational", link: "https://pi.ai", features: ["Free", "Voice chat", "Personal"], isFree: true },
  { name: "Grok", description: "xAI assistant with real-time X/Twitter data access", category: "Conversational", link: "https://grok.com", features: ["Free tier", "Real-time", "Humor mode"], isFree: true },
  { name: "Le Chat (Mistral)", description: "Mistral AI's European multilingual chat assistant", category: "Conversational", link: "https://chat.mistral.ai", features: ["Free tier", "Multilingual", "Fast"], isFree: true },
  { name: "DeepSeek Chat", description: "Powerful open reasoning model with free web chat", category: "Conversational", link: "https://chat.deepseek.com", features: ["Free", "Reasoning", "Code"], isFree: true },
  { name: "Qwen Chat", description: "Alibaba's multilingual AI assistant with vision", category: "Conversational", link: "https://chat.qwen.ai", features: ["Free", "Multilingual", "Vision"], isFree: true },

  // Coding
  { name: "GitHub Copilot", description: "AI pair programmer with inline code suggestions", category: "Coding", link: "https://github.com/features/copilot", features: ["Student free", "Autocomplete", "Chat"], isFree: true },
  { name: "Replit AI", description: "Build and deploy apps in browser with AI assistance", category: "Coding", link: "https://replit.com", features: ["Free tier", "Deploy", "Collaborate"], isFree: true },
  { name: "Cursor", description: "AI-first code editor built on VS Code", category: "Coding", link: "https://cursor.com", features: ["Free tier", "Codebase chat", "Composer"], isFree: true },
  { name: "Codeium", description: "Free AI code completion for 70+ languages", category: "Coding", link: "https://codeium.com", features: ["Free forever", "Autocomplete", "Chat"], isFree: true },
  { name: "Phind", description: "AI search engine built specifically for developers", category: "Coding", link: "https://www.phind.com", features: ["Free tier", "Code answers", "Sources"], isFree: true },
  { name: "Blackbox AI", description: "AI coding assistant with repo-aware answers", category: "Coding", link: "https://www.blackbox.ai", features: ["Free tier", "Code search", "VS Code"], isFree: true },
  { name: "Continue.dev", description: "Open-source AI code assistant for VS Code & JetBrains", category: "Coding", link: "https://continue.dev", features: ["Free", "Open source", "Any model"], isFree: true },
  { name: "Tabnine", description: "AI code completions trained on open-source code", category: "Coding", link: "https://www.tabnine.com", features: ["Free tier", "Local mode", "Privacy"], isFree: true },
  { name: "Bolt.new", description: "Prompt to full-stack web app in the browser", category: "Coding", link: "https://bolt.new", features: ["Free tier", "Full-stack", "Instant deploy"], isFree: true },
  { name: "v0 by Vercel", description: "Generate React UI components from text prompts", category: "Coding", link: "https://v0.dev", features: ["Free tier", "React/Tailwind", "Shadcn UI"], isFree: true },
  { name: "Windsurf", description: "Agentic IDE with cascade flow for multi-file edits", category: "Coding", link: "https://codeium.com/windsurf", features: ["Free tier", "Agentic", "Fast"], isFree: true },
  { name: "Aider", description: "Terminal pair programmer that edits your git repo", category: "Coding", link: "https://aider.chat", features: ["Free", "Open source", "Git aware"], isFree: true },

  // Design
  { name: "Canva AI", description: "AI design tools for graphics, presentations, and social posts", category: "Design", link: "https://www.canva.com", features: ["Free tier", "Magic Design", "Templates"], isFree: true },
  { name: "Microsoft Designer", description: "Free AI image and design generator from Microsoft", category: "Design", link: "https://designer.microsoft.com", features: ["Free", "Text to image", "Social posts"], isFree: true },
  { name: "Leonardo AI", description: "AI image generation with fine-tuned models and styles", category: "Design", link: "https://leonardo.ai", features: ["Free daily", "High quality", "Models"], isFree: true },
  { name: "Ideogram", description: "AI image generator with excellent text rendering", category: "Design", link: "https://ideogram.ai", features: ["Free tier", "Text in images", "Styles"], isFree: true },
  { name: "Bing Image Creator", description: "Free DALL-E powered image generation from Microsoft", category: "Design", link: "https://www.bing.com/images/create", features: ["Free", "DALL-E 3", "No install"], isFree: true },
  { name: "Remove.bg", description: "AI background removal for photos in one click", category: "Design", link: "https://www.remove.bg", features: ["Free tier", "HD quality", "API"], isFree: true },
  { name: "Figma AI", description: "AI features inside Figma for design workflows", category: "Design", link: "https://www.figma.com/ai", features: ["Free tier", "UI design", "Prototyping"], isFree: true },
  { name: "Recraft", description: "Free AI vector and illustration generator", category: "Design", link: "https://www.recraft.ai", features: ["Free tier", "Vector art", "Icons"], isFree: true },
  { name: "Playground AI", description: "Free AI image editor with mixed models", category: "Design", link: "https://playground.com", features: ["Free tier", "Canvas", "Styles"], isFree: true },
  { name: "Krea AI", description: "Real-time AI image generation and enhancement", category: "Design", link: "https://www.krea.ai", features: ["Free tier", "Real-time", "Upscale"], isFree: true },

  // Writing
  { name: "Grammarly", description: "AI writing assistant for grammar, tone, and clarity", category: "Writing", link: "https://www.grammarly.com", features: ["Free tier", "Grammar", "Tone"], isFree: true },
  { name: "QuillBot", description: "AI paraphrasing, summarizing, and grammar checking", category: "Writing", link: "https://quillbot.com", features: ["Free tier", "Paraphrase", "Summarize"], isFree: true },
  { name: "DeepL Write", description: "AI writing improvement with multilingual support", category: "Writing", link: "https://www.deepl.com/write", features: ["Free tier", "Multilingual", "Clarity"], isFree: true },
  { name: "Hemingway Editor", description: "Make your writing bold and clear with readability tips", category: "Writing", link: "https://hemingwayapp.com", features: ["Free online", "Readability", "Concise"], isFree: true },
  { name: "Copy.ai", description: "AI copywriting for essays, emails, and social content", category: "Writing", link: "https://www.copy.ai", features: ["Free tier", "Templates", "Multi-language"], isFree: true },
  { name: "Wordtune", description: "AI rewriting tool to improve sentence flow and tone", category: "Writing", link: "https://www.wordtune.com", features: ["Free tier", "Rewrite", "Tone adjust"], isFree: true },

  // Research
  { name: "Perplexity AI", description: "AI search with cited sources and real-time answers", category: "Research", link: "https://www.perplexity.ai", features: ["Free tier", "Citations", "Pro search"], isFree: true },
  { name: "You.com", description: "AI search engine with chat, code, and image modes", category: "Research", link: "https://you.com", features: ["Free", "Multi-mode", "Sources"], isFree: true },
  { name: "Consensus", description: "AI search across 200M+ scientific research papers", category: "Research", link: "https://consensus.app", features: ["Free tier", "Academic", "Citations"], isFree: true },
  { name: "Elicit", description: "AI research assistant for literature review and papers", category: "Research", link: "https://elicit.com", features: ["Free tier", "Papers", "Summaries"], isFree: true },
  { name: "Semantic Scholar", description: "Free AI-powered academic search by Allen Institute", category: "Research", link: "https://www.semanticscholar.org", features: ["Free", "200M papers", "TLDR"], isFree: true },
  { name: "NotebookLM", description: "Google's AI notebook for your documents and notes", category: "Research", link: "https://notebooklm.google.com", features: ["Free", "Source grounded", "Audio overview"], isFree: true },
  { name: "SciSpace", description: "Understand research papers with AI explanations", category: "Research", link: "https://typeset.io", features: ["Free tier", "Paper chat", "Citations"], isFree: true },

  // Productivity
  { name: "Notion AI", description: "AI writing and organization inside your Notion workspace", category: "Productivity", link: "https://www.notion.so/product/ai", features: ["Free trial", "Summarize", "Write"], isFree: true },
  { name: "Gamma", description: "Create presentations, docs, and webpages with AI", category: "Productivity", link: "https://gamma.app", features: ["Free tier", "Presentations", "One-click"], isFree: true },
  { name: "Tome", description: "AI storytelling for presentations and narratives", category: "Productivity", link: "https://tome.app", features: ["Free tier", "AI slides", "Images"], isFree: true },
  { name: "Otter.ai", description: "AI meeting notes and transcription", category: "Productivity", link: "https://otter.ai", features: ["Free tier", "Transcription", "Summary"], isFree: true },
  { name: "Fireflies.ai", description: "AI meeting assistant that records and summarizes calls", category: "Productivity", link: "https://fireflies.ai", features: ["Free tier", "Meeting notes", "Search"], isFree: true },
  { name: "Mem.ai", description: "Self-organizing AI notes that connect your ideas", category: "Productivity", link: "https://mem.ai", features: ["Free tier", "Smart notes", "Search"], isFree: true },
  { name: "Zapier AI", description: "Automate workflows between 7000+ apps with AI", category: "Agents & Automation", link: "https://zapier.com/ai", features: ["Free tier", "Automation", "No-code"], isFree: true },
  { name: "Make.com", description: "Visual automation platform with AI integrations", category: "Agents & Automation", link: "https://www.make.com", features: ["Free tier", "Workflows", "Integrations"], isFree: true },

  // Video & Audio
  { name: "Runway ML", description: "AI video editing, text-to-video, and creative tools", category: "Video & Audio", link: "https://runwayml.com", features: ["Free credits", "Gen-3", "Editing"], isFree: true },
  { name: "Pika", description: "Text and image to video generation platform", category: "Video & Audio", link: "https://pika.art", features: ["Free tier", "Text to video", "Effects"], isFree: true },
  { name: "CapCut AI", description: "Free AI video editor with auto-captions and effects", category: "Video & Audio", link: "https://www.capcut.com", features: ["Free", "Auto captions", "Templates"], isFree: true },
  { name: "Descript", description: "Edit video and audio by editing text transcripts", category: "Video & Audio", link: "https://www.descript.com", features: ["Free tier", "Text edit", "Overdub"], isFree: true },
  { name: "ElevenLabs", description: "Realistic AI voice generation and text-to-speech", category: "Speech & Voice", link: "https://elevenlabs.io", features: ["Free tier", "Voice clone", "TTS"], isFree: true },
  { name: "Suno AI", description: "Generate full songs with lyrics from text prompts", category: "Video & Audio", link: "https://suno.com", features: ["Free tier", "Full songs", "Lyrics"], isFree: true },
  { name: "Udio", description: "AI music creation with studio-quality output", category: "Video & Audio", link: "https://www.udio.com", features: ["Free tier", "Music gen", "Styles"], isFree: true },
  { name: "Lumen5", description: "Turn blog posts and text into engaging videos", category: "Video & Audio", link: "https://lumen5.com", features: ["Free tier", "Text to video", "Templates"], isFree: true },
  { name: "Whisper (OpenAI)", description: "Open-source speech recognition — free on Hugging Face", category: "Speech & Voice", link: "https://huggingface.co/openai/whisper-large-v3", features: ["Free", "Open source", "Multilingual"], isFree: true },
  { name: "Coqui TTS", description: "Open-source text-to-speech toolkit", category: "Speech & Voice", link: "https://coqui.ai", features: ["Free", "Open source", "Voice clone"], isFree: true },

  // Education
  { name: "Khanmigo", description: "Khan Academy's AI tutor for guided learning", category: "Education", link: "https://www.khanacademy.org/khan-labs", features: ["Free for teachers", "Tutoring", "Socratic"], isFree: true },
  { name: "Wolfram Alpha", description: "Computational knowledge engine for math and science", category: "Education", link: "https://www.wolframalpha.com", features: ["Free tier", "Step-by-step", "Graphs"], isFree: true },
  { name: "Socratic by Google", description: "AI homework help with explanations for any subject", category: "Education", link: "https://socratic.org", features: ["Free", "Homework", "Visual"], isFree: true },
  { name: "Quizlet Q-Chat", description: "AI tutor built on Quizlet flashcard sets", category: "Education", link: "https://quizlet.com/qchat", features: ["Free tier", "Flashcards", "Tutor"], isFree: true },
  { name: "Brainly", description: "AI homework helper with community-verified answers", category: "Education", link: "https://brainly.com", features: ["Free tier", "All subjects", "Community"], isFree: true },
  { name: "TurboLearn AI", description: "Turn lectures and PDFs into flashcards and summaries", category: "Education", link: "https://www.turbolearn.ai", features: ["Free tier", "Flashcards", "Summaries"], isFree: true },
  { name: "Mindgrasp", description: "AI note-taking from videos, PDFs, and lectures", category: "Education", link: "https://www.mindgrasp.ai", features: ["Free trial", "Video notes", "Quizzes"], isFree: true },

  // Language Models (curated open-source)
  { name: "Llama 3.3", description: "Meta's latest open Llama model on Hugging Face", category: "Language Models", link: "https://huggingface.co/meta-llama/Llama-3.3-70B-Instruct", features: ["Free", "Open weights", "70B"], isFree: true },
  { name: "Mistral Large", description: "Mistral's flagship multilingual language model", category: "Language Models", link: "https://huggingface.co/mistralai/Mistral-Large-Instruct-2411", features: ["Free tier", "Multilingual", "Fast"], isFree: true },
  { name: "Qwen 2.5", description: "Alibaba's powerful open multilingual LLM family", category: "Language Models", link: "https://huggingface.co/Qwen/Qwen2.5-72B-Instruct", features: ["Free", "Open weights", "72B"], isFree: true },
  { name: "Gemma 2", description: "Google's lightweight open language models", category: "Language Models", link: "https://huggingface.co/google/gemma-2-9b-it", features: ["Free", "Open weights", "Efficient"], isFree: true },
  { name: "Phi-3", description: "Microsoft's small but capable SLM for edge devices", category: "Language Models", link: "https://huggingface.co/microsoft/Phi-3-mini-4k-instruct", features: ["Free", "Small model", "Fast"], isFree: true },

  // Image Generation
  { name: "Stable Diffusion XL", description: "Open-source image generation model", category: "Image Generation", link: "https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0", features: ["Free", "Open source", "High res"], isFree: true },
  { name: "FLUX.1", description: "State-of-the-art open image generation by Black Forest Labs", category: "Image Generation", link: "https://huggingface.co/black-forest-labs/FLUX.1-dev", features: ["Free", "Photorealistic", "Latest"], isFree: true },
  { name: "ComfyUI", description: "Node-based UI for Stable Diffusion workflows", category: "Image Generation", link: "https://github.com/comfyanonymous/ComfyUI", features: ["Free", "Open source", "Workflows"], isFree: true },

  // Translation
  { name: "Google Translate", description: "Free AI translation for 100+ languages", category: "Translation", link: "https://translate.google.com", features: ["Free", "100+ languages", "Camera"], isFree: true },
  { name: "DeepL Translator", description: "High-quality AI translation for documents and text", category: "Translation", link: "https://www.deepl.com/translator", features: ["Free tier", "Accurate", "Documents"], isFree: true },
  { name: "NLLB (Meta)", description: "Meta's open No Language Left Behind translation model", category: "Translation", link: "https://huggingface.co/facebook/nllb-200-3.3B", features: ["Free", "200 languages", "Open source"], isFree: true },

  // Vision & AI
  { name: "YOLOv8", description: "Ultralytics real-time object detection model", category: "Vision & AI", link: "https://huggingface.co/Ultralytics/YOLOv8", features: ["Free", "Real-time", "Open source"], isFree: true },
  { name: "Segment Anything (SAM)", description: "Meta's foundation model for image segmentation", category: "Vision & AI", link: "https://huggingface.co/facebook/sam-vit-huge", features: ["Free", "Open source", "Zero-shot"], isFree: true },
  { name: "CLIP", description: "OpenAI's vision-language model for image understanding", category: "Vision & AI", link: "https://huggingface.co/openai/clip-vit-large-patch14", features: ["Free", "Multimodal", "Embeddings"], isFree: true },

  // Open Source hubs
  { name: "Hugging Face", description: "Largest open AI model hub — 1M+ models and datasets", category: "Open Source", link: "https://huggingface.co/models", features: ["Free", "1M+ models", "Community"], isFree: true },
  { name: "Ollama", description: "Run LLMs locally on your machine — Llama, Mistral, Gemma", category: "Open Source", link: "https://ollama.com", features: ["Free", "Local", "Private"], isFree: true },
  { name: "LM Studio", description: "Desktop app to run open LLMs offline", category: "Open Source", link: "https://lmstudio.ai", features: ["Free", "Offline", "GGUF"], isFree: true },
  { name: "GPT4All", description: "Run open-source LLMs on CPU without cloud", category: "Open Source", link: "https://www.nomic.ai/gpt4all", features: ["Free", "CPU", "Private"], isFree: true },
  { name: "LangChain", description: "Framework for building LLM apps and agents", category: "Agents & Automation", link: "https://www.langchain.com", features: ["Free", "Open source", "Agents"], isFree: true },
  { name: "CrewAI", description: "Multi-agent orchestration framework for AI teams", category: "Agents & Automation", link: "https://www.crewai.com", features: ["Free", "Open source", "Multi-agent"], isFree: true },
];
