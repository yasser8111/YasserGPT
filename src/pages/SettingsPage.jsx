import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { logout, db } from "../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  writeBatch,
} from "firebase/firestore";
import DropdownMenu from "../components/DropdownMenu";
import { useNavigate } from "react-router-dom";

const SettingsPage = ({ isDarkMode, onToggleTheme }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedPersonality, setSelectedPersonality] = useState(
    localStorage.getItem("ai_personality") || "default",
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const [language, setLanguage] = useState("ar");
  const [voiceGender, setVoiceGender] = useState("male");

  const personalities = [
    { id: "default", title: "العادي", icon: "fa-solid fa-robot" },
    {
      id: "creative",
      title: "المبدع",
      icon: "fa-solid fa-wand-magic-sparkles",
    },
    { id: "developer", title: "المبرمج", icon: "fa-solid fa-code" },
  ];

  const handlePersonalityChange = (id) => {
    setSelectedPersonality(id);
    localStorage.setItem("ai_personality", id);
  };

  const handleDeleteAllChats = async () => {
    if (!user) return;
    if (
      !window.confirm(
        "هل أنت متأكد من حذف جميع المحادثات؟ لا يمكن التراجع عن هذه الخطوة.",
      )
    )
      return;

    setIsDeleting(true);
    try {
      const convRef = collection(db, "users", user.uid, "conversations");
      const snapshot = await getDocs(convRef);

      const batch = writeBatch(db);
      snapshot.docs.forEach((document) => {
        batch.delete(document.ref);
      });

      await batch.commit();
      alert("تم حذف جميع المحادثات بنجاح");
      navigate("/chat");
    } catch (error) {
      console.error("Error deleting all chats:", error);
      alert("حدث خطأ أثناء محاولة الحذف");
    } finally {
      setIsDeleting(false);
    }
  };

  const currentPersonalityTitle = personalities.find(
    (p) => p.id === selectedPersonality,
  )?.title;

  return (
    <div className="flex-1 h-full bg-transparent p-6 md:p-12 overflow-y-auto custom-scrollbar">
      <div className="max-w-2xl mx-auto space-y-10">
        {/* Header Section */}
        <header className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            الإعدادات
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            خصص تجربة YasserGPT الخاصة بك
          </p>
        </header>

        {/* Intelligence Settings */}
        <section className="bg-white dark:bg-dark-50 rounded-2xl p-6 border border-gray-100 dark:border-dark-300 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-50 dark:border-dark-300/50">
            <i className="fa-solid fa-brain text-brand"></i>
            <h3 className="font-bold text-gray-800 dark:text-gray-200">
              الذكاء الاصطناعي
            </h3>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-sm text-gray-600 dark:text-gray-300 font-medium block">
                  شخصية المساعد
                </span>
                <span className="text-[10px] text-gray-400">
                  تغيير أسلوب ردود الذكاء الاصطناعي
                </span>
              </div>
              <DropdownMenu
                trigger={
                  <button className="cursor-pointer text-sm text-gray-900 dark:text-white font-semibold flex items-center gap-2 px-3 py-1.5 bg-light-100 dark:bg-dark-200 rounded-lg hover:opacity-80 transition-opacity">
                    <i
                      className={
                        personalities.find((p) => p.id === selectedPersonality)
                          ?.icon + " text-xs opacity-70"
                      }
                    ></i>
                    {currentPersonalityTitle}
                    <i className="fa-solid fa-chevron-down text-[10px] text-gray-400"></i>
                  </button>
                }
                items={personalities.map((p) => ({
                  label: p.title,
                  icon: p.icon,
                  onClick: () => handlePersonalityChange(p.id),
                }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-sm text-gray-600 dark:text-gray-300 font-medium block">
                  اللغة المفضلة
                </span>
                <span className="text-[10px] text-gray-400">
                  لغة واجهة المستخدم والردود
                </span>
              </div>
              <DropdownMenu
                trigger={
                  <button className="cursor-pointer text-sm text-gray-900 dark:text-white font-semibold flex items-center gap-2 px-3 py-1.5 bg-light-100 dark:bg-dark-200 rounded-lg hover:opacity-80 transition-opacity">
                    {language === "ar" ? "العربية" : "English"}
                    <i className="fa-solid fa-chevron-down text-[10px] text-gray-400"></i>
                  </button>
                }
                items={[
                  { label: "العربية", onClick: () => setLanguage("ar") },
                  { label: "English", onClick: () => setLanguage("en") },
                ]}
              />
            </div>
          </div>
        </section>

        {/* System & Visuals */}
        <section className="bg-white dark:bg-dark-50 rounded-2xl p-6 border border-gray-100 dark:border-dark-300 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-50 dark:border-dark-300/50">
            <i className="fa-solid fa-display text-brand"></i>
            <h3 className="font-bold text-gray-800 dark:text-gray-200">
              النظام والمظهر
            </h3>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                الوضع الداكن
              </span>
              <button
                onClick={onToggleTheme}
                className={`cursor-pointer w-11 h-6 rounded-full transition-colors relative flex items-center ${
                  isDarkMode ? "bg-brand" : "bg-gray-200 dark:bg-dark-300"
                }`}
              >
                <div
                  className={`absolute w-4 h-4 rounded-full bg-white shadow-sm transition-all ${
                    isDarkMode ? "right-1" : "right-6"
                  }`}
                ></div>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                نبرة الصوت
              </span>
              <div className="flex bg-light-100 dark:bg-dark-200 p-1 rounded-xl">
                {["male", "female"].map((g) => (
                  <button
                    key={g}
                    onClick={() => setVoiceGender(g)}
                    className={`cursor-pointer px-5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      voiceGender === g
                        ? "bg-white dark:bg-dark-300 text-brand shadow-sm"
                        : "text-gray-400 dark:text-gray-500 hover:text-gray-600"
                    }`}
                  >
                    {g === "male" ? "ذكر" : "أنثى"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Account & Data */}
        <section className="bg-white dark:bg-dark-50 rounded-2xl p-6 border border-gray-100 dark:border-dark-300 shadow-sm">
          <div className="flex items-center gap-5 pb-6 border-b border-gray-50 dark:border-dark-300/50">
            <img
              src={
                user?.photoURL ||
                `https://ui-avatars.com/api/?name=${user?.email}`
              }
              className="w-14 h-14 rounded-full bg-gray-50 dark:bg-dark-200 object-cover ring-2 ring-brand/10"
              alt="User"
              onError={(e) => (e.target.src = "/img/Avatar.png")}
            />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {user?.displayName || "مستخدم YasserGPT"}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.email}
              </p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl border border-gray-100 dark:border-dark-300 text-xs font-bold text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all cursor-pointer"
            >
              خروج
            </button>
          </div>

          <div className="pt-6">
            <button
              onClick={handleDeleteAllChats}
              disabled={isDeleting}
              className="w-full cursor-pointer flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs text-red-500 border border-red-100 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all font-bold disabled:opacity-50"
            >
              <i
                className={`fa-solid ${isDeleting ? "fa-spinner animate-spin" : "fa-trash-can"} text-sm`}
              ></i>
              {isDeleting ? "جاري الحذف..." : "حذف جميع محادثات Firestore"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
