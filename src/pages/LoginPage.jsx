import { useState } from "react";
import { signInWithGoogle, auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate("/chat");
    } catch (err) {
      console.error("Firebase Login Error:", err);
      setError(`فشل تسجيل الدخول: ${err.code || "خطأ غير معروف"}`);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/chat");
    } catch (err) {
      setError("خطأ في البريد أو كلمة المرور");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-light-200 dark:bg-dark-100 px-4 py-6">
      <div className="w-full max-w-[95%] sm:max-w-md p-6 sm:p-8 bg-white dark:bg-light-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="text-center mb-6 sm:mb-8">
          <div className="no-underline flex items-center justify-center w-full gap-2">
            <h3 className="text-lg sm:text-xl font-bold text-black dark:text-white">
              Yasser<strong>GPT</strong>
            </h3>
            <img
              src="/img/logo.png"
              alt="Logo"
              className="h-7 w-7 sm:h-8 sm:w-8 object-contain"
            />
          </div>

          <p className="text-sm text-light-500 dark:text-light-400 mt-2">
            {isSignUp ? "إنشاء حساب جديد" : "تسجيل الدخول للمتابعة"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 text-xs sm:text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all cursor-pointer mb-6 active:scale-95"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            className="w-4 h-4 sm:w-5 sm:h-5"
            alt="Google"
          />
          <span className="text-gray-700 font-medium text-sm sm:text-base">
            Continue with Google
          </span>
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-dark-400"></div>
          </div>
          <div className="relative flex justify-center text-xs sm:text-sm">
            <span className="px-2 bg-white dark:bg-light-800 text-gray-500">
              Or
            </span>
          </div>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            className="w-full px-4 py-3 text-sm sm:text-base rounded-xl border border-gray-200 dark:border-dark-300 dark:bg-dark-200 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="كلمة المرور"
            className="w-full px-4 py-3 text-sm sm:text-base rounded-xl border border-gray-200 dark:border-dark-300 dark:bg-dark-200 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-brand hover:opacity-90 text-white font-bold rounded-xl transition-all cursor-pointer active:scale-95"
          >
            {isSignUp ? "إنشاء حساب" : "دخول"}
          </button>
        </form>

        <p className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-light-500 dark:text-light-400">
          {isSignUp ? "لديك حساب بالفعل؟" : "ليس لديك حساب؟"}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="mr-1 sm:mr-2 text-brand hover:underline font-medium cursor-pointer"
          >
            {isSignUp ? "تسجيل الدخول" : "إنشاء حساب الآن"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
