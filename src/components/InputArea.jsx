import React, { useState, useRef, useEffect } from "react";
import { MODELS } from "../constants/config.js";
import DropdownMenu from "./DropdownMenu.jsx";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "ar-SA";
}

const InputArea = ({ onSend, disabled }) => {
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS.AUTO.id);
  
  const textareaRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const finalTranscriptRef = useRef("");

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [inputText]);

  useEffect(() => {
    if (!recognition) return;
    recognition.onresult = (event) => {
      resetSilenceTimer();
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscriptRef.current += event.results[i][0].transcript + " ";
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setInputText(finalTranscriptRef.current + interimTranscript);
    };
    recognition.onend = () => { setIsRecording(false); clearTimeout(silenceTimerRef.current); };
    recognition.onerror = () => setIsRecording(false);
  }, []);

  const resetSilenceTimer = () => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = setTimeout(() => {
      if (recognition && isRecording) recognition.stop();
    }, 3000);
  };

  const handleSend = () => {
    if (inputText.trim() && !disabled) {
      onSend(inputText, selectedModel);
      setInputText("");
      finalTranscriptRef.current = "";
      if (isRecording) { recognition.stop(); setIsRecording(false); }
    }
  };

  const toggleMic = () => {
    if (!recognition) return;
    if (isRecording) {
      recognition.stop();
    } else {
      finalTranscriptRef.current = inputText ? inputText.trim() + " " : "";
      recognition.start();
      setIsRecording(true);
      resetSilenceTimer();
    }
  };

  const currentModel = Object.values(MODELS).find(m => m.id === selectedModel);

  const modelMenuItems = Object.values(MODELS).map((model) => ({
    label: model.displayName,
    icon: selectedModel === model.id ? "fa-solid fa-check text-brand" : "",
    onClick: () => setSelectedModel(model.id)
  }));

  return (
    <div className="w-full max-w-[750px] mx-auto p-3">
      <div className="flex flex-col p-3 bg-white dark:bg-dark-300 rounded-[28px] relative">
        <textarea
          ref={textareaRef}
          dir="rtl"
          placeholder={isRecording ? "جاري الاستماع..." : "اكتب هنا..."}
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            finalTranscriptRef.current = e.target.value;
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          rows="1"
          className="w-full min-h-[40px] py-2 px-3 border-none outline-none resize-none bg-transparent text-gray-800 dark:text-gray-100 text-base overflow-y-auto"
        ></textarea>

        <div className="flex justify-between items-center w-full pt-1">
          <div className="flex gap-3">
            <button
              onClick={isRecording ? toggleMic : handleSend}
              disabled={!inputText.trim() && !isRecording}
              className={`cursor-pointer w-10 h-10 flex items-center justify-center rounded-full transition-all ${
                isRecording 
                ? "bg-red-500 text-white animate-pulse" 
                : "text-white bg-brand disabled:opacity-30"
              }`}
            >
              <i className={`fa-solid ${isRecording ? "fa-stop" : "fa-paper-plane"} text-base`}></i>
            </button>

            {!isRecording && (
              <button
                onClick={toggleMic}
                className="cursor-pointer w-10 h-10 flex items-center justify-center rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-400"
              >
                <i className="fa-solid fa-microphone text-base"></i>
              </button>
            )}
          </div>

          <DropdownMenu
            position="top"
            items={modelMenuItems}
            trigger={
              <button className="flex items-center gap-2 h-9 px-4 rounded-full bg-white dark:bg-dark-300 text-[11px] font-bold text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-200 transition-all cursor-pointer">
                <span>{currentModel?.displayName}</span>
                <i className="fa-solid fa-chevron-up text-[10px]"></i>
              </button>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default InputArea;