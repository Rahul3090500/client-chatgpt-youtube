import React, { useRef, useState, useEffect } from "react";
import autoAnimate from "@formkit/auto-animate";

const ChatBody = ({ chat }) => {
  const imageRegex = /!\[(.*?)\]\((.*?)\)/g; // regular expression to match markdown-style image syntax

  const getMessageContent = (message) => {
    const matches = message.match(imageRegex);
    return matches
      ? message.replace(imageRegex, `<img src="$2" alt="$1" />`)
      : `<span>${message}</span>`;
  };

  const aiStyle = `bg-white bg-opacity-40 backdrop-blur-lg dropshadow-md mr-auto`;

  const parent = useRef(null);
  const bottomRef = useRef(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const speakMessage = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  return (
    <div className="flex flex-col gap-4" ref={parent}>
      {chat.map((message, i) => (
        <div
          key={i}
          className={`border-[#999999] break-words border-2 rounded-xl self-end px-3 py-3 max-w-[80%] ${
            message.sender === "ai" && aiStyle
          }`}
        >
          <button onClick={() => speakMessage(message.message)}>
            <div
              dangerouslySetInnerHTML={{
                __html: getMessageContent(message.message),
              }}
            ></div>
          </button>
        </div>
      ))}

      <div ref={bottomRef} className="h-3"></div>
    </div>
  );
};

export default ChatBody;
