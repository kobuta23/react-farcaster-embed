import React, { useState, useEffect } from "react";
import Linkify from "linkify-react";

interface CastTextFormatterProps {
  text: string;
  maxLength?: number;
  className?: string;
  onSdkLinkClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  embeddedUrls?: string[];
}

const getLinkifyOptions = (onSdkLinkClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void) => ({
  className: "farcaster-embed-body-link",
  target: "_blank",
  attributes: onSdkLinkClick ? {
    onClick: onSdkLinkClick
  } : undefined
});

export function CastTextFormatter({ 
  text, 
  maxLength = 280, 
  className = "",
  onSdkLinkClick,
  embeddedUrls = []
}: CastTextFormatterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsExpanded(false);
  }, [text, maxLength]);

  if (!text) {
    return null;
  }

  const shouldTruncate = text.length > maxLength;
  const displayText = shouldTruncate && !isExpanded ? text.substring(0, maxLength) : text;



  const renderText = () => {
    return (
      <Linkify as="span" options={getLinkifyOptions(onSdkLinkClick)}>
        {displayText}
      </Linkify>
    );
  };

  if (!shouldTruncate) {
    return (
      <span className={className}>
        {renderText()}
      </span>
    );
  }

  return (
    <span className={className}>
      {renderText()}
      {isExpanded ? (
        <button
          onClick={() => setIsExpanded(false)}
          style={{ 
            marginLeft: 4, 
            color: "#FF6200", 
            background: "none", 
            border: "none", 
            cursor: "pointer", 
            textDecoration: "underline" 
          }}
        >
          see less
        </button>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          style={{ 
            marginLeft: 4, 
            color: "#FF6200", 
            background: "none", 
            border: "none", 
            cursor: "pointer", 
            textDecoration: "underline" 
          }}
        >
          see more...
        </button>
      )}
    </span>
  );
} 