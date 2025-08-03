import React from "react";

interface CustomLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
  onLinkClick?: (url: string, event?: React.MouseEvent) => Promise<void> | void;
  "data-fid"?: number;
}

export function CustomLink({ 
  href, 
  children, 
  className = "", 
  title, 
  onLinkClick, 
  "data-fid": dataFid 
}: CustomLinkProps) {
  const handleClick = async (e: React.MouseEvent) => {
    if (onLinkClick) {
      e.preventDefault();
      await onLinkClick(href, e);
    }
  };

  return (
    <a
      href={href}
      className={className}
      title={title}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      data-fid={dataFid}
    >
      {children}
    </a>
  );
} 