// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import InputArea from "../components/InputArea";
// import ChatContainer from "../components/ChatContainer";
// import { askAI } from "../api/ai";
// import { useAuth } from "../context/AuthContext";
// // import { saveMessage, getMessages, createNewChat } from "../services/chatService";

// const ChatPage = () => {
//   const { chatId } = useParams();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [messages, setMessages] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     if (chatId && user) {
//       const loadMessages = async () => {
//         const history = await getMessages(user.uid, chatId);
//         setMessages(history.length > 0 ? history : [{ role: "ai", content: "مرحباً! كيف يمكنني مساعدتك؟" }]);
//       };
//       loadMessages();
//     } else {
//       setMessages([{ role: "ai", content: "مرحباً! أنا YasserGPT، ابدأ محادثة جديدة الآن." }]);
//     }
//   }, [chatId, user]);

//   const handleSendMessage = async (text, selectedModel) => {
//     if (!text.trim() || !user) return;

//     let currentChatId = chatId;
//     if (!currentChatId) {
//       currentChatId = await createNewChat(user.uid, text);
//       navigate(`/chat/${currentChatId}`);
//     }

//     const userMsg = { role: "user", content: text };
//     setMessages((prev) => [...prev, userMsg]);
//     await saveMessage(user.uid, currentChatId, userMsg);

//     setIsLoading(true);

//     try {
//       const response = await askAI(currentChatId, text, { model: selectedModel });
//       const aiMsg = { role: "ai", content: response };
//       setMessages((prev) => [...prev, aiMsg]);
//       await saveMessage(user.uid, currentChatId, aiMsg);
//     } catch (error) {
//       setMessages((prev) => [...prev, { role: "ai", content: "حدث خطأ في الاتصال." }]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col h-full w-full relative">
//       <div className="flex-1 overflow-y-auto custom-scrollbar px-2 sm:px-4">
//         <ChatContainer messages={messages} isLoading={isLoading} />
//       </div>
//       <div className="w-full bg-gradient-to-t from-light-200 dark:from-dark-100 via-light-200 dark:via-dark-100 to-transparent">
//         <InputArea onSend={handleSendMessage} disabled={isLoading} />
//       </div>
//     </div>
//   );
// };

// export default ChatPage;

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { askAI } from "../api/ai";
import { useAuth } from "../context/AuthContext";
import ChatContainer from "../components/ChatContainer";
import InputArea from "../components/InputArea";

const ChatPage = () => {
  const { chatId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const isServiceActive = true;

  useEffect(() => {
    setMessages([
      { role: "ai", content: "مرحباً! أنا YasserGPT، ابدأ محادثة جديدة الآن." },
    ]);
  }, [chatId, user]);

  const handleSendMessage = async (text, selectedModel) => {
    if (!isServiceActive || !text.trim() || !user) return;

    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);

    setIsLoading(true);

    try {
      const response = await askAI(null, text, { model: selectedModel });
      const aiMsg = { role: "ai", content: response };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "حدث خطأ في الاتصال." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full relative">
      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 sm:px-4">
        <ChatContainer messages={messages} isLoading={isLoading} />
      </div>
      <div className="w-full bg-gradient-to-t from-light-200 dark:from-dark-100 via-light-200 dark:via-dark-100 to-transparent">
        <InputArea
          onSend={handleSendMessage}
          disabled={isLoading || !isServiceActive}
        />
      </div>
    </div>
  );
};

export default ChatPage;
