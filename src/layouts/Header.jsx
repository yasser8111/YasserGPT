import React from "react";
import { Link } from "react-router-dom";

const Header = ({ onToggleSidebar, isSidebarOpen }) => {
  return (
    <header className="w-full py-3 bg-light-200 dark:bg-dark-100 z-[100]">
      <div className="flex justify-between items-center px-4">
        <button
          onClick={onToggleSidebar}
          className="w-10 h-10 flex items-center justify-center cursor-pointer rounded-full hover:bg-light-300 dark:hover:bg-dark-300 text-light-600 dark:text-light-400 transition-all"
        >
          <i className={`fa-solid ${isSidebarOpen ? "fa-xmark" : "fa-bars"} text-lg`}></i>
        </button>

        <Link to="/" className="no-underline flex items-center gap-2">
          <h3 className="text-lg font-bold text-black dark:text-white m-0">
            Yasser<strong>GPT</strong>
          </h3>
          <img className="h-8 w-8 object-contain" src="/src/assets/logo.png" alt="Logo" />
        </Link>
      </div>
    </header>
  );
};

export default Header;