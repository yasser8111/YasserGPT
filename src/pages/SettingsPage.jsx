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
    { id: "creative", title: "المبدع", icon: "fa-solid fa-wand-magic-sparkles" },
    { id: "developer", title: "المبرمج", icon: "fa-solid fa-code" },
  ];

  const handlePersonalityChange = (id) => {
    setSelectedPersonality(id);
    localStorage.setItem("ai_personality", id);
  };

  const currentPersonalityTitle = personalities.find(p => p.id === selectedPersonality)?.title;

  return (
    <div className="flex-1 h-full bg-transparent p-6 md:p-12 overflow-y-auto">
      <div className="max-w-2xl mx-auto space-y-12">
        
        <section className="flex items-center gap-5 pb-4">
          <img 
            src={user?.photoURL || "https://ui-avatars.com/api/?name=" + user?.email} 
            className="w-12 h-12 rounded-full bg-gray-50 dark:bg-dark-200 object-cover" 
            alt="User"
          />
          <div className="flex-1">
            <h3 className="text-lg font-medium dark:text-white">{user?.displayName || "مستخدم"}</h3>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
          <button onClick={logout} className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors font-bold">
            خروج
          </button>
        </section>

        <section className="space-y-10">
          <p className="text-[10px] uppercase tracking-[2px] text-gray-400 font-bold">إعدادات النظام</p>
          
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <span className="text-sm dark:text-gray-300 font-medium">شخصية الذكاء الاصطناعي</span>
              <DropdownMenu
                trigger={
                  <button className="text-sm text-brand font-medium flex items-center gap-2">
                    {currentPersonalityTitle}
                    <i className="fa-solid fa-chevron-down text-[10px]"></i>
                  </button>
                }
                items={personalities.map(p => ({
                  label: p.title,
                  icon: p.icon,
                  onClick: () => handlePersonalityChange(p.id)
                }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm dark:text-gray-300 font-medium">اللغة</span>
              <DropdownMenu
                trigger={
                  <button className="text-sm text-brand font-medium flex items-center gap-2">
                    {language === 'ar' ? 'العربية' : 'English'}
                    <i className="fa-solid fa-chevron-down text-[10px]"></i>
                  </button>
                }
                items={[
                  { label: "العربية", onClick: () => setLanguage('ar') },
                  { label: "English", onClick: () => setLanguage('en') }
                ]}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm dark:text-gray-300 font-medium">نوع الصوت</span>
              <div className="flex gap-6">
                {['male', 'female'].map((g) => (
                  <button 
                    key={g}
                    onClick={() => setVoiceGender(g)}
                    className={`text-xs uppercase tracking-wider transition-all ${voiceGender === g ? "text-brand font-bold" : "text-gray-300 dark:text-gray-600"}`}
                  >
                    {g === 'male' ? 'ذكر' : 'أنثى'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm dark:text-gray-300 font-medium">الوضع الداكن</span>
              <button 
                onClick={onToggleTheme}
                className={`w-9 h-4.5 rounded-full transition-all relative ${isDarkMode ? "bg-brand" : "bg-gray-100 dark:bg-dark-300"}`}
              >
                <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white transition-all ${isDarkMode ? "right-0.5" : "right-5"}`}></div>
              </button>
            </div>
          </div>
        </section>

        <section className="pt-6">
          <button className="text-[10px] text-gray-300 hover:text-red-400 transition-colors uppercase tracking-[2px] font-bold">
            مسح البيانات
          </button>
        </section>

      </div>
    </div>
  );
};

export default SettingsPage;