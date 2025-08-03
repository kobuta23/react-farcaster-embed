import React, { useState, useEffect } from "react";

interface TextTruncatorProps {
  text: string;
  maxLength: number;
  className?: string;
}

export function TextTruncator({ text, maxLength, className = "" }: TextTruncatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsExpanded(false);
  }, [text, maxLength]);

  if (!text || text.length <= maxLength) {
    return <span className={className}>{text}</span>;
  }

  const truncatedText = text.substring(0, maxLength);

  return (
    <span className={className}>
      {isExpanded ? (
        <>
          {text}
          <button
            onClick={() => setIsExpanded(false)}
            style={{ marginLeft: 4, color: "#FF6200", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
          >
            see less
          </button>
        </>
      ) : (
        <>
          {truncatedText}
          <button
            onClick={() => setIsExpanded(true)}
            style={{ marginLeft: 4, color: "#FF6200", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
          >
            see more...
          </button>
        </>
      )}
    </span>
  );
} 