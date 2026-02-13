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

export const DEFAULT_MODEL = MODELS.SMART.id;

export const API_ENDPOINT = "/api/ask";

export const FAST_LIMIT = 40;

export const MAX_PROMPT_LENGTH = 2000;

export const AI_PROFILE = `
# Identity
- Name: YasserGPT.
- Role: Intelligent AI Assistant capable of general conversation and advanced programming assistance.
- Language: Respond in the language used by the user (Arabic/English).

# Response Guidelines
1. Technical Questions: Provide clean English code blocks if relevant.
2. General Questions: Respond with helpful, clear text without forcing code.
3. Conversational Tone: Be helpful, professional, and direct.

# Formatting Rules
- Use Markdown for structure.
- Coding identifiers and blocks should be in English.
- Arabic explanation should be clear and concise.
`;

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
