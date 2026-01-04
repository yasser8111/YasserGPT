import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { logout, db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import DropdownMenu from "../components/DropdownMenu";
import { useNavigate, useParams } from "react-router-dom";
import MinimalModal from "../components/MinimalModal";

const Sidebar = ({ isOpen, setIsOpen, isDarkMode, onToggleTheme }) => {
  const { user } = useAuth();
  const { chatId: currentChatId } = useParams();
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

  // حالة المودال الموحدة
  const [modal, setModal] = useState({
    isOpen: false,
    type: "confirm",
    title: "",
    description: "",
    confirmText: "",
    isDanger: false,
    action: null,
    inputValue: "",
  });

  useEffect(() => {
    if (!user) {
      setConversations([]);
      return;
    }

    const q = query(
      collection(db, "users", user.uid, "conversations"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setConversations(chats);
    });

    return () => unsubscribe();
  }, [user]);

  const handleNewChat = async () => {
    if (!user) return;
    try {
      const convRef = collection(db, "users", user.uid, "conversations");
      const newDoc = await addDoc(convRef, {
        title: "محادثة جديدة",
        createdAt: serverTimestamp(),
      });
      navigate(`/chat/${newDoc.id}`);
      if (window.innerWidth < 1024) setIsOpen(false);
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  const handleDeleteChat = (chatId) => {
    setModal({
      isOpen: true,
      type: "confirm",
      title: "حذف المحادثة",
      description: "هل أنت متأكد من حذف هذه المحادثة نهائياً؟",
      confirmText: "حذف نهائي",
      isDanger: true,
      action: async () => {
        try {
          await deleteDoc(doc(db, "users", user.uid, "conversations", chatId));
          if (currentChatId === chatId) navigate("/chat");
          setModal((prev) => ({ ...prev, isOpen: false }));
        } catch (error) {
          console.error("Error deleting chat:", error);
        }
      },
    });
  };

  const handleRenameChat = (chatId, oldTitle) => {
    setModal({
      isOpen: true,
      type: "input",
      title: "إعادة تسمية المحادثة",
      inputValue: oldTitle,
      confirmText: "تحديث",
      isDanger: false,
      action: async (newTitle) => {
        if (!newTitle || newTitle.trim() === "" || newTitle === oldTitle) {
          setModal((prev) => ({ ...prev, isOpen: false }));
          return;
        }
        try {
          await updateDoc(doc(db, "users", user.uid, "conversations", chatId), {
            title: newTitle.trim(),
          });
          setModal((prev) => ({ ...prev, isOpen: false }));
        } catch (error) {
          console.error("Error renaming chat:", error);
        }
      },
    });
  };

  const settingsItems = [
    {
      label: isDarkMode ? "الوضع الفاتح" : "الوضع الليلي",
      icon: isDarkMode ? "fa-solid fa-sun" : "fa-solid fa-moon",
      onClick: onToggleTheme,
    },
    {
      label: "الإعدادات",
      icon: "fa-solid fa-gear",
      onClick: () => {
        navigate("/settings");
        if (window.innerWidth < 1024) setIsOpen(false);
      },
    },
    ...(user
      ? [
          {
            label: "تسجيل الخروج",
            icon: "fa-solid fa-right-from-bracket",
            onClick: logout,
          },
        ]
      : []),
  ];

  return (
    <>
      <MinimalModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.title}
        description={modal.description}
        type={modal.type}
        confirmText={modal.confirmText}
        isDanger={modal.isDanger}
        value={modal.inputValue}
        onChange={(val) => setModal({ ...modal, inputValue: val })}
        onConfirm={() => modal.action(modal.inputValue)}
      />

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-110 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <aside
        className={`${
          isOpen
            ? "w-72 opacity-100 translate-x-0"
            : "w-0 opacity-0 -translate-x-full lg:translate-x-0"
        } fixed lg:relative z-120 flex-shrink-0 transition-all duration-300 ease-in-out bg-white dark:bg-dark-50 h-full flex flex-col overflow-hidden shadow-xl lg:shadow-none`}
      >
        <div className="p-4 flex flex-col h-full min-w-[18rem]">
          <button
            onClick={handleNewChat}
            className="text-black p-3 rounded-xl font-bold flex items-center justify-center gap-2 mb-6 bg-light-200 dark:bg-dark-300 dark:text-white cursor-pointer active:scale-95 transition-transform"
          >
            <i className="fa-solid fa-plus text-sm"></i>
            <span>محادثة جديدة</span>
          </button>

          <div className="flex-1 overflow-y-auto custom-scrollbar mb-4">
            {user ? (
              <>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">
                  الأخيرة
                </p>
                {conversations.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => {
                      navigate(`/chat/${chat.id}`);
                      if (window.innerWidth < 1024) setIsOpen(false);
                    }}
                    className={`group p-2 text-sm rounded-xl cursor-pointer flex items-center justify-between transition-colors ${
                      currentChatId === chat.id
                        ? "bg-light-200 dark:bg-dark-200 text-brand font-medium"
                        : "text-light-600 dark:text-light-400 hover:bg-light-100 dark:hover:bg-dark-300"
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <i className="fa-regular fa-message text-xs opacity-70"></i>
                      <span className="truncate">
                        {chat.title || "محادثة بدون عنوان"}
                      </span>
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu
                        position="right"
                        items={[
                          {
                            label: "تعديل الاسم",
                            icon: "fa-solid fa-pen",
                            onClick: () =>
                              handleRenameChat(chat.id, chat.title),
                          },
                          {
                            label: "حذف",
                            icon: "fa-solid fa-trash",
                            variant: "danger",
                            onClick: () => handleDeleteChat(chat.id),
                          },
                        ]}
                        trigger={
                          <button className="w-7 h-7 hover:bg-gray-200 dark:hover:bg-dark-200 rounded-full cursor-pointer">
                            <i className="fa-solid fa-ellipsis-vertical text-xs text-gray-400"></i>
                          </button>
                        }
                      />
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <p className="text-xs text-gray-400">
                  سجّل الدخول لحفظ سجل محادثاتك
                </p>
              </div>
            )}
          </div>

          <div className="mt-auto pt-4 border-t border-gray-100 dark:border-dark-300 flex flex-col gap-2">
            <DropdownMenu
              position="top"
              items={settingsItems}
              trigger={
                <button className="w-full flex items-center gap-3 p-3 text-sm rounded-xl cursor-pointer hover:bg-light-200 dark:hover:bg-dark-300 text-light-600 dark:text-light-400 transition-colors">
                  <i className="fa-solid fa-gear w-5 text-center"></i>
                  <span>الإعدادات</span>
                </button>
              }
            />

            {user && (
              <div className="flex items-center gap-3 p-2 rounded-xl cursor-pointer dark:hover:bg-dark-300 hover:bg-light-200 transition-colors">
                <img
                  src={
                    user.photoURL ||
                    `https://ui-avatars.com/api/?name=${user.email}`
                  }
                  onError={(e) => {
                    e.target.src = "/img/Avatar.png";
                  }}
                  className="w-9 h-9 rounded-full bg-gray-300 object-cover"
                  alt="Avatar"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-dark-100 dark:text-white truncate">
                    {user.displayName || "مستخدم"}
                  </p>
                  <p className="text-[10px] text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="w-8 h-8 cursor-pointer flex items-center justify-center rounded-full hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-all"
                >
                  <i className="text-base fa-solid fa-right-from-bracket"></i>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
