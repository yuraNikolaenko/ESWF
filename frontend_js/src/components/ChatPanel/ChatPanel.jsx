import React, { useState, useRef, useEffect } from "react";
import "../../styles/ChatPanel.css";
import { getBaseApiUrl } from "../../utils/apiConfig";
import {
  SendOutlined,
  PaperClipOutlined,
  AudioOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

const ChatPanel = ({ isVisible }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const textareaRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const BASE_API_URL = getBaseApiUrl();

    try {
      const response = await fetch(`${BASE_API_URL}/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      const gptMessage = data.reply
        ? { from: "gpt", text: data.reply }
        : { from: "gpt", text: "[Помилка: GPT не відповів]" };

      setMessages((prev) => [...prev, gptMessage]);
    } catch (error) {
      console.error("Помилка запиту:", error);
      setMessages((prev) => [
        ...prev,
        { from: "gpt", text: "[Помилка підключення до API]" },
      ]);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <div
      className="chat-panel"
      style={{ width: isVisible ? "300px" : "0px" }}
    >
      <h4>Chat ESWF</h4>

      <div className="chat-messages-container">
        {messages.map((msg, index) => (
          msg.from === "gpt" ? (
            <div key={index} className="chat-message gpt">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline ? (
                      <div className="code-block">
                        <button
                          className="copy-button"
                          onClick={() =>
                            navigator.clipboard.writeText(children)
                          }
                        >
                          <CopyOutlined />
                        </button>
                        <pre>
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      </div>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {msg.text}
              </ReactMarkdown>
            </div>
          ) : (
            <div key={index} className="chat-message user">
              <strong>Ви:</strong> {msg.text}
            </div>
          )
        ))}
      </div>

      <div className="chat-input-wrapper">
        <div className="chat-input-block">
          <div className="chat-attachments">(прикріплені файли)</div>

          <textarea
            ref={textareaRef}
            className="chat-textarea"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !e.shiftKey && sendMessage()
            }
            placeholder="Введіть повідомлення..."
          />

          <div className="chat-action-buttons">
            <button onClick={() => alert("Прикріпити файл")}>
              <PaperClipOutlined />
            </button>
            <button onClick={() => alert("Розпочати запис")}>
              <AudioOutlined />
            </button>
            <button onClick={sendMessage}>
              <SendOutlined />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
