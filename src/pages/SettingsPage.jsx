import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { logout } from "../firebase";
import DropdownMenu from "../components/DropdownMenu";

const SettingsPage = ({ isDarkMode, onToggleTheme }) => {
  const { user } = useAuth();

  const [selectedPersonality, setSelectedPersonality] = useState(
    localStorage.getItem("ai_personality") || "default"
  );

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

  const currentPersonalityTitle = personalities.find(
    (p) => p.id === selectedPersonality
  )?.title;

  return (
    <div className="flex-1 h-full bg-transparent p-6 md:p-12 overflow-y-auto">
      <div className="max-w-2xl mx-auto space-y-12">
        <section className="flex items-center gap-5 pb-4 border-b border-gray-100 dark:border-dark-300">
          <img
            src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.email}`}
            className="w-12 h-12 rounded-full bg-gray-50 dark:bg-dark-200 object-cover"
            alt="User"
            onError={(e) => (e.target.src = "/img/Avatar.png")}
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {user?.displayName || "مستخدم"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="w-9 h-9 cursor-pointer flex items-center justify-center rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-all"
          >
            <i className="text-base fa-solid fa-right-from-bracket"></i>
          </button>
        </section>

        <section className="space-y-10">
          <p className="text-[11px] uppercase tracking-[2px] text-gray-400 dark:text-gray-500 font-bold">
            إعدادات النظام
          </p>

          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                شخصية الذكاء الاصطناعي
              </span>
              <DropdownMenu
                trigger={
                  <button className="cursor-pointer text-sm text-gray-900 dark:text-white font-semibold flex items-center gap-2 hover:opacity-70 transition-opacity">
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
              <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                اللغة
              </span>
              <DropdownMenu
                trigger={
                  <button className="cursor-pointer text-sm text-gray-900 dark:text-white font-semibold flex items-center gap-2 hover:opacity-70 transition-opacity">
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

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                نوع الصوت
              </span>
              <div className="flex">
                {["male", "female"].map((g) => (
                  <button
                    key={g}
                    onClick={() => setVoiceGender(g)}
                    className={`cursor-pointer px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                      voiceGender === g
                        ? "dark:text-white text-black"
                        : "text-gray-400 dark:text-gray-500 hover:text-gray-600"
                    }`}
                  >
                    {g === "male" ? "ذكر" : "أنثى"}
                  </button>
                ))}
              </div>
            </div>

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
                  className={`absolute w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-all ${
                    isDarkMode ? "right-1" : "right-5.5"
                  }`}
                ></div>
              </button>
            </div>
          </div>
        </section>

        <section className="pt-6 border-t border-gray-100 dark:border-dark-300 mt-6">
          <button className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/5 transition-all duration-200 uppercase tracking-widest font-bold group">
            <i className="fa-solid fa-trash-can text-sm"></i>
            مسح البيانات
          </button>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;