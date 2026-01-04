import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import "../index.css";

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <button className="copy-btn" onClick={handleCopy} title="نسخ الكود">
      {copied ? (
        <i className="fa-solid fa-check text-green-500"></i>
      ) : (
        <i className="fa-regular fa-copy"></i>
      )}
    </button>
  );
};

const Message = ({ role, content, isLoading }) => {
  const isAi = role === "ai";

  if (isLoading) {
    return (
      <div className="ai self-end flex items-center">
        <img
          className="h-5 w-5 animate-loading"
          src="/src/assets/logo.png"
          alt="Logo"
        />
      </div>
    );
  }

  const MarkdownComponents = {
    p: ({ children }) => <div className="mb-4 last:mb-0">{children}</div>,

    table: ({ children }) => (
      <div className="table-wrapper">
        <table>{children}</table>
      </div>
    ),

    code: ({ node, inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || "");
      
      const rawCode = Array.isArray(children)
        ? children.map(child => (typeof child === 'object' ? child.props.children : child)).join("")
        : String(children).replace(/\n$/, "");

      if (inline) {
        return (
          <code
            className="bg-code-inline-bg px-1.5 py-0.5 rounded text-syntax-variable font-bold"
            {...props}
          >
            {children}
          </code>
        );
      }

      return (
        <div className="code-wrapper my-4">
          <div className="code-header">
            <span className="lang-name">{match ? match[1] : "code"}</span>
            <CopyButton text={rawCode} />
          </div>
          <pre className="p-4 overflow-x-auto">
            <code className={className} {...props}>
              {children}
            </code>
          </pre>
        </div>
      );
    },
  };

  const preprocessContent = (text) => {
    if (typeof text !== "string") return text;
    return text
      .replace(/<pre><code.*?>/g, "```javascript\n")
      .replace(/<\/code><\/pre>/g, "\n```")
      .replace(/<code>/g, "`")
      .replace(/<\/code>/g, "`");
  };

  return (
    <div
      className={`message ${
        isAi
          ? "ai overflow-visible self-end animate-[aiMessage_0.3s_ease-out_forwards] text-black dark:text-white max-w-full"
          : "user self-start bg-light-50 dark:bg-light-800 text-dark-100 dark:text-light-100 rounded-[18px_4px_18px_18px] animate-[userMessage_0.3s_forwards] max-w-[80%] sm:max-w-[90%]"
      } p-3 leading-relaxed text-base break-words transition-all`}
    >
      {isAi ? (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={MarkdownComponents}
        >
          {preprocessContent(content)}
        </ReactMarkdown>
      ) : (
        content
      )}
    </div>
  );
};

export default Message;