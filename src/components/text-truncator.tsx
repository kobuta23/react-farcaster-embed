import React, { useState, useEffect } from "react";

interface TextTruncatorProps {
  text: string;
  maxLength: number;
  className?: string;
}

export function TextTruncator({ text, maxLength, className = "" }: TextTruncatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Reset expanded state when text or maxLength changes
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
            className="farcaster-embed-text-truncator-button"
            style={{
              color: "inherit",
              background: "none",
              border: "none",
              padding: "0",
              margin: "0 0 0 4px",
              cursor: "pointer",
              textDecoration: "underline",
              fontSize: "inherit",
            }}
          >
            see less
          </button>
        </>
      ) : (
        <>
          {truncatedText}
          <button
            onClick={() => setIsExpanded(true)}
            className="farcaster-embed-text-truncator-button"
            style={{
              color: "inherit",
              background: "none",
              border: "none",
              padding: "0",
              margin: "0 0 0 4px",
              cursor: "pointer",
              textDecoration: "underline",
              fontSize: "inherit",
            }}
          >
            see more...
          </button>
        </>
      )}
    </span>
  );
} 