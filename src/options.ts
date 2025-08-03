export type FarcasterEmbedOptions = {
  timestampFormat?: Intl.DateTimeFormatOptions;
  timestampLocale?: string;
  customEndpoint?: string;
  silentError?: boolean;
  onLinkClick?: (url: string, event?: React.MouseEvent) => void;
  maxTextLength?: number;
};

export const defaultOptions: FarcasterEmbedOptions = {
  timestampFormat: {
    year: "numeric",
    month: "short",
    day: "numeric",
  },
  timestampLocale: "en-US",
  silentError: false,
};
