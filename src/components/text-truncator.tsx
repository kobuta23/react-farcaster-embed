import React, { useState, useEffect } from "react";

interface TextTruncatorProps {
  text: string;
  maxLength: number;
  className?: string;
}

export function TextTruncator({ text, maxLength, className = "" }: TextTruncatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

<<<<<<< HEAD
  // Reset expanded state when text or maxLength changes
=======
>>>>>>> eafa4da (Minimal patch: SDK-powered link handling and text truncation only (mark SDK as external))
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
<<<<<<< HEAD
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
=======
            style={{ marginLeft: 4, color: "#FF6200", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
>>>>>>> eafa4da (Minimal patch: SDK-powered link handling and text truncation only (mark SDK as external))
          >
            see less
          </button>
        </>
      ) : (
        <>
          {truncatedText}
          <button
            onClick={() => setIsExpanded(true)}
<<<<<<< HEAD
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
=======
            style={{ marginLeft: 4, color: "#FF6200", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
>>>>>>> eafa4da (Minimal patch: SDK-powered link handling and text truncation only (mark SDK as external))
          >
            see more...
          </button>
        </>
      )}
    </span>
  );
} 