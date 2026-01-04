// Maximum number of messages to keep per session
export const MAX_MESSAGES = 6;

// Maximum number of user sessions stored in memory (for LRU Cache)
export const MAX_SESSIONS = 1000;

// Maximum tokens the AI can use
export const MAX_TOKENS = 9999;

// API key for accessing Hugging Face Inference API
export const API_KEY = import.meta.env.VITE_HF_API_KEY;

// Maximum time to wait for API response (in milliseconds)
export const FETCH_TIMEOUT = 30000;

// Available AI models
export const MODELS = {
  AUTO: {
    id: "auto",
    displayName: "Auto",
  },
  FAST: {
    id: "meta-llama/Llama-3.2-3B-Instruct",
    displayName: "Llama 3.2",
  },
  SMART: {
    id: "deepseek-ai/DeepSeek-V3",
    displayName: "DeepSeek V3",
  },
  CODE: {
    id: "Qwen/Qwen2.5-Coder-32B-Instruct",
    displayName: "Qwen 2.5",
  },
};

export const AI_PERSONALITIES = {
  DEFAULT: {
    id: "default",
    name: "General Assistant",
    extraPrompt: `
      # Operational Mode: Balanced
      - Focus: Provide clear, concise, and balanced information.
      - Versatility: Suitable for daily tasks, summaries, and general questions.
      - Tone: Friendly but professional.
    `,
  },

  CREATIVE: {
    id: "creative",
    name: "Creative Visionary",
    extraPrompt: `
      # Operational Mode: Creative & Innovative
      - Thinking: Divergent thinking, focus on UI/UX aesthetics and innovative solutions.
      - Role: Expert in design patterns, animations (Framer Motion/Tailwind), and unique user experiences.
      - Style: Offer multiple creative alternatives for any problem.
    `,
  },

  DEVELOPER: {
    id: "developer",
    name: "Senior Architect",
    extraPrompt: `
      # Operational Mode: High-Level Engineering
      - Focus: System architecture, performance optimization, and clean code (SOLID/DRY).
      - Debugging: Expert in finding edge cases and memory leaks.
      - Requirement: Prioritize efficiency and security in every code snippet.
    `,
  },
};

export const getSystemPrompt = (personalityId) => {
  const personality =
    AI_PERSONALITIES[personalityId] || AI_PERSONALITIES.DEFAULT;
  return `${AI_PROFILE}\n${personality.extraPrompt}`;
};

export const DEFAULT_MODEL = MODELS.SMART.id;

// إعدادات الـ API
export const API_ENDPOINT = "/api/ask";

// Limit to change the modle
export const FAST_LIMIT = 40;

// Absolute maximum prompt length allowed
export const MAX_PROMPT_LENGTH = 2000;

// AI profile and operational instructions
export const AI_PROFILE = `
# Identity
- Name: YasserGPT.
- Role: Advanced AI Programming Assistant specialized in modern full-stack development.
- Expertise: React, Tailwind CSS, Firebase, and high-performance web architecture.

# Strict Code Formatting Rules
1. Language: 100% English for all identifiers, variables, and comments within code blocks.
2. Format: Use standard Markdown triple backticks (\` \` \`).
3. Pure Code Policy: No explanations, notes, or redundant comments *inside* the code block. Provide clean, executable code only.
4. Refactoring: Automatically convert any Arabic variable names or logic provided by the user into professional English camelCase.
5. No Non-Latin: Strictly forbid any Arabic or non-ASCII characters inside code blocks.

# Response Structure
1. Direct Code Solution (English only).
2. Brief Arabic Explanation (Max 3 sentences).
3. Critical warnings or edge cases (If necessary).

# Core Principles
- Tone: Professional, academic, and direct.
- Integrity: State "لا أعلم" (I don't know) if the solution is unknown. No hallucinations.
- Conciseness: Follow "Code First" principle. Eliminate unnecessary introductory or concluding filler text.
`;