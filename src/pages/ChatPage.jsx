import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { askAI } from "../api/ai";
import { useAuth } from "../context/AuthContext";
import ChatContainer from "../components/ChatContainer";
import InputArea from "../components/InputArea";
import {
  saveMessage,
  getMessages,
  createNewChat,
  updateChatTitle,
  getUserChatCount,
} from "../services/chatService";

const MAX_MESSAGES_PER_CHAT = 50;

const ChatPage = () => {
  const { chatId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [globalChatLimitError, setGlobalChatLimitError] = useState(false);

  const isServiceActive = true;

  useEffect(() => {
    const loadMessages = async () => {
      if (chatId && user) {
        try {
          const history = await getMessages(user.uid, chatId);
          if (history.length > 0) {
            setMessages(history);
            if (history.length >= MAX_MESSAGES_PER_CHAT) setLimitReached(true);
            else setLimitReached(false);
          } else {
            setMessages([
              {
                role: "ai",
                content: "مرحباً! أنا YasserGPT، ابدأ محادثة جديدة الآن.",
              },
            ]);
          }
        } catch (error) {
          console.error("Failed to load history:", error);
          setMessages([
            {
              role: "ai",
              content: "مرحباً! أنا YasserGPT، ابدأ محادثة جديدة الآن.",
            },
          ]);
        }
      } else {
        setMessages([
          {
            role: "ai",
            content: "مرحباً! أنا YasserGPT، ابدأ محادثة جديدة الآن.",
          },
        ]);
        setLimitReached(false);
      }
    };
    loadMessages();
  }, [chatId, user]);

  const generateTitle = async (text, chatId) => {
    try {
      const prompt = `لخص هذا النص في 3 إلى 4 كلمات فقط لتكون عنوان المحادثة:\n${text}`;
      const title = await askAI(`title_gen_${chatId}`, prompt, {
        model: "auto",
      });
      const cleanTitle = title.replace(/['"]/g, "").trim().substring(0, 40);
      if (cleanTitle) {
        await updateChatTitle(user.uid, chatId, cleanTitle);
      }
    } catch (e) {
      console.error("Failed to generate title", e);
    }
  };

  const handleSendMessage = async (text, selectedModel) => {
    if (
      !isServiceActive ||
      !text.trim() ||
      !user ||
      limitReached ||
      globalChatLimitError
    )
      return;

    if (!chatId) {
      const count = await getUserChatCount(user.uid);
      if (count >= 10) {
        setGlobalChatLimitError(true);
        setTimeout(() => setGlobalChatLimitError(false), 5000);
        return;
      }
    }

    // Check message limits dynamically
    if (messages.length >= MAX_MESSAGES_PER_CHAT) {
      setLimitReached(true);
      return;
    }

    let currentChatId = chatId;
    let isFirstMessageInNewChat = false;
    if (!currentChatId) {
      currentChatId = await createNewChat(user.uid, text.substring(0, 30));
      isFirstMessageInNewChat = true;
      navigate(`/chat/${currentChatId}`);
    } else if (messages.length <= 1) {
      // It might be a new chat created from Sidebar (where it only has default greeting)
      isFirstMessageInNewChat = true;
    }

    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      if (currentChatId) {
        await saveMessage(user.uid, currentChatId, userMsg);
      }

      if (isFirstMessageInNewChat) {
        // Trigger title generation in the background
        generateTitle(text, currentChatId);
      }

      const personality = localStorage.getItem("ai_personality") || "default";
      const response = await askAI(currentChatId, text, {
        model: selectedModel,
        personality: personality,
      });

      const aiMsg = { role: "ai", content: response };
      setMessages((prev) => {
        const newMsgs = [...prev, aiMsg];
        if (newMsgs.length >= MAX_MESSAGES_PER_CHAT) setLimitReached(true);
        return newMsgs;
      });

      if (currentChatId) {
        await saveMessage(user.uid, currentChatId, aiMsg);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "حدث خطأ في الاتصال." },
      ]);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full relative">
      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 sm:px-4">
        <ChatContainer messages={messages} isLoading={isLoading} />
        {limitReached && (
          <div className="text-center my-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm transition-all duration-300">
            تم الوصول إلى الحد الأقصى للرسائل في هذه المحادثة. يرجى بدء محادثة
            جديدة.
          </div>
        )}
        {globalChatLimitError && (
          <div className="text-center my-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm transition-all duration-300">
            لقد وصلت إلى الحد الأقصى للمحادثات (10) في حسابك. يرجى حذف محادثة
            قديمة لتبدأ من جديد.
          </div>
        )}
      </div>
      <div className="w-full bg-gradient-to-t from-light-200 dark:from-dark-100 via-light-200 dark:via-dark-100 to-transparent">
        <InputArea
          onSend={handleSendMessage}
          disabled={isLoading || !isServiceActive || limitReached}
        />
      </div>
    </div>
  );
};

export default ChatPage;
