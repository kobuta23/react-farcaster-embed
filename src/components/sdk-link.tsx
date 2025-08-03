import React from "react";

interface SDKLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
  onLinkClick?: (url: string, event?: React.MouseEvent) => void;
  "data-fid"?: string;
}

export function SDKLink({ 
  href, 
  children, 
  className = "", 
  onLinkClick, 
  "data-fid": dataFid 
}: SDKLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (onLinkClick) {
      e.preventDefault();
      onLinkClick(href, e);
    }
  };

  return (
    <a
      href={href}
      className={className}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      data-fid={dataFid}
    >
      {children}
    </a>
  );
} 