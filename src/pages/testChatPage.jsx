import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import InputArea from "../components/InputArea";
import ChatContainer from "../components/ChatContainer";
import { askAI } from "../api/ai"; 
import { useAuth } from "../context/AuthContext";

const TestChatPage = () => {
  const { chatId } = useParams(); // يستخدم كـ sessionId
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // تعريف الجلسة الحالية (إذا لم يوجد ID نستخدم الـ UID الخاص بالمستخدم كجلسة مؤقتة)
  const currentSessionId = chatId || user?.uid || "guest-session";

  useEffect(() => {
    setMessages([{ role: "ai", content: "مرحباً! أنا نظام YasserGPT الذكي. سأقوم بتحديد أفضل نموذج للإجابة على استفسارك تلقائياً." }]);
  }, [chatId]);

  const handleSendMessage = async (text, selectedModel = "auto") => {
    if (!text.trim() || !user) return;

    // 1. إضافة رسالة المستخدم للواجهة
    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    
    setIsLoading(true);

    try {
      // 2. استدعاء الوظيفة التي أرسلتها (التي تختار الموديل بناءً على الكلمات المفتاحية)
      // نمرر selectedModel إذا اختاره المستخدم يدوياً، وإلا سيكون "auto" ليقرر الكود خلف الكواليس
      const response = await askAI(currentSessionId, text, { 
        model: selectedModel,
      });

      // 3. إضافة رد الذكاء الاصطناعي
      const aiMsg = { role: "ai", content: response };
      setMessages((prev) => [...prev, aiMsg]);

    } catch (error) {
      console.error("AI Error:", error);
      setMessages((prev) => [...prev, { 
        role: "ai", 
        content: `⚠️ خطأ: ${error.message || "تعذر الاتصال بالخادم"}` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 dark:bg-dark-200">
      {/* منطقة عرض الرسائل */}
      <div className="flex-1 overflow-y-auto p-4">
        <ChatContainer messages={messages} isLoading={isLoading} />
      </div>

      {/* مؤشر نوع المعالجة (اختياري لتوضيح الذكاء) */}
      {isLoading && (
        <div className="text-xs text-center text-gray-400 animate-pulse pb-2">
          جاري تحليل الاستفسار واختيار أفضل نموذج...
        </div>
      )}

      {/* منطقة الإدخال */}
      <div className="p-4 bg-white dark:bg-dark-100">
        <InputArea 
          onSend={handleSendMessage} 
          disabled={isLoading} 
        />
      </div>
    </div>
  );
};

export default TestChatPage;