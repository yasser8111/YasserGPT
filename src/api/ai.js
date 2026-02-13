// import "dotenv/config";
import { LRUCache } from "lru-cache";
import {
  MAX_MESSAGES,
  MAX_SESSIONS,
  MAX_TOKENS,
  API_KEY,
  FETCH_TIMEOUT,
  MODELS,
  FAST_LIMIT,
  AI_PROFILE,
} from "../constants/config.js";

// ==========================================
// 1. Session Cache Management
// ==========================================

/**
 * Cleaning AI output of Asian characters or foreign symbols
 */
function cleanAIResponse(text) {
  return text
    .replace(
      /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f\u0900-\u097f]/g,
      ""
    )
    .trim();
}

/**
 * Clean the text of injection attempts or strange symbols
 */
function sanitizePrompt(prompt) {
  return prompt
    .replace(/<\|.*?\|>/g, "")
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
    .trim();
}

/**
 * In-memory cache using LRU (Least Recently Used) policy
 * to store chat histories for a set number of sessions (MAX_SESSIONS).
 * Each session is kept for 1 hours .
 */
const memoryCache = new LRUCache({
  max: MAX_SESSIONS,
  ttl: 1000 * 60 * 60, // 1 hours
});

/**
 * Retrieves the chat history (memory) for a specific session ID.
 * Initializes a new memory with the system profile if the session is new.
 * @param {string} sessionId - The unique identifier for the user's session.
 * @returns {Array<Object>} The chat history array, including the system message.
 */
function getMemory(sessionId) {
  if (!memoryCache.has(sessionId)) {
    memoryCache.set(sessionId, [{ role: "system", content: AI_PROFILE }]);
  }
  return memoryCache.get(sessionId);
}

/**
 * Adds a new message (user or assistant) to the session memory.
 * Implements a rotating buffer (FIFO) to keep memory size within MAX_MESSAGES.
 * The system message (index 0) is always preserved.
 * @param {Array<Object>} memory - The current chat history array.
 * @param {string} role - The sender's role ('user' or 'assistant').
 * @param {string} content - The text content of the message.
 */
function addMessage(memory, role, content) {
  memory.push({ role, content });
  if (memory.length > MAX_MESSAGES + 1) {
    const systemMessage = memory[0];
    const recentMessages = memory.slice(-MAX_MESSAGES);
    const newMemory = [systemMessage, ...recentMessages];
    return newMemory;
  }
  return memory;
}

/**
 * Dynamically selects the appropriate AI model based on the prompt length.
 * This strategy aims to optimize cost/speed by using smaller models for short inputs.
 * @param {string} prompt - The user's input string.
 * @returns {string} The name of the selected model.
 */
function getSmartConfigs(prompt) {
  const codeKeywords =
    /({|}|\[|\]|=>|function|const|let|var|import|export|def |if |class |async|await|select |from |where |script|coding|program|develop|softw|api|كود|برمج|دال|خوارزم|تطوير|موقع|تطبيق|سيكويل|قواعد|بناء|برمج[ةه]|دال[ةه])/i;
  const creativeKeywords =
    /(writ|imag|stor|poem|creat|blog|essay|artic|paint|draw|design|اكتب|قص[ةه]|شعر|تخيل|ابداع|مقال|افكار|سيناريو|وصف|تأليف|رواية|مدون[ةه])/i;

  if (codeKeywords.test(prompt)) {
    return { model: MODELS.CODE, temperature: 0.1 };
  }
  if (creativeKeywords.test(prompt)) {
    return { model: MODELS.SMART, temperature: 0.9 };
  }
  if (prompt.length > FAST_LIMIT) {
    return { model: MODELS.SMART, temperature: 0.7 };
  }
  return { model: MODELS.FAST, temperature: 0.5 };
}

// ==========================================
// 2. Main AI Interaction Function
// ==========================================

/**
 * Main function to communicate with the AI model.
 * Handles memory retrieval, message logging, model selection, and API calling.
 * @param {string} sessionId - The unique identifier for the chat session.
 * @param {string} prompt - The user's message/query.
 * @param {Object} [options={}] - Optional parameters (e.g., custom model or temperature).
 * @param {string} [options.model] - Overrides the dynamic model selection.
 * @param {number} [options.temperature] - Overrides the default temperature.
 * @returns {Promise<string>} The AI's response text.
 * @throws {Error} If API key is missing or prompt is invalid.
 */
export async function askAI(sessionId, prompt, options = {}) {
  if (!API_KEY) throw new Error("HF_API_KEY is missing");

  const trimmedPrompt = prompt?.trim();
  if (!trimmedPrompt) throw new Error("Invalid prompt");

  const cleanPrompt = sanitizePrompt(trimmedPrompt);
  if (!cleanPrompt) throw new Error("Prompt is empty after sanitization");

  let memory = getMemory(sessionId);
  memory = addMessage(memory, "user", cleanPrompt);
  memoryCache.set(sessionId, memory);

  const config = getSmartConfigs(cleanPrompt);

  let selectedModelId;
  if (options.model && options.model !== "auto") {
    selectedModelId = options.model;
  } else {
    selectedModelId = config.model.id || config.model;
  }

  const temperature = options.temperature ?? config.temperature;

  try {
    const rawResponse = await requestHFRouter(
      memory,
      selectedModelId,
      temperature
    );
    const finalResponse = cleanAIResponse(rawResponse);

    memory = addMessage(memory, "assistant", finalResponse);
    memoryCache.set(sessionId, memory);

    return finalResponse;
  } catch (error) {
    memory.pop();
    throw error;
  }
}

// ==========================================
// 3. API Request Handler
// ==========================================

/**
 * Handles the actual API call to the Hugging Face Inference API Router.
 * Includes timeout logic using AbortController.
 * @param {Array<Object>} memory - The full chat history to send.
 * @param {string} model - The model name to use for the request.
 * @param {number} temperature - The generation temperature/creativity setting.
 * @returns {Promise<string>} The AI's response text.
 * @throws {Error} If the request fails, times out, or returns a non-200 status.
 */
async function requestHFRouter(messages, model, temperature, retries = 2) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  console.log(model, temperature);

  try {
    const res = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: MAX_TOKENS,
          temperature,
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timer);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      if (res.status >= 500 && retries > 0) {
        return requestHFRouter(messages, model, temperature, retries - 1);
      }
      throw new Error(errorData.error?.message || `API Error: ${res.status}`);
    }

    const data = await res.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    clearTimeout(timer);
    if (error.name === "AbortError") throw new Error("Request timed out");
    throw error;
  }
}
