import * as react_jsx_runtime from 'react/jsx-runtime';

type FarcasterEmbedOptions = {
    timestampFormat?: Intl.DateTimeFormatOptions;
    timestampLocale?: string;
    customEndpoint?: string;
    silentError?: boolean;
    onLinkClick?: (url: string, event?: React.MouseEvent) => void;
    maxTextLength?: number;
};

type CastImage = {
    type: string;
    url: string;
    sourceUrl: string;
    alt: string;
};
type CastVideo = {
    type: string;
    url: string;
    sourceUrl: string;
    width: number;
    height: number;
    duration: number;
    thumbnailUrl: string;
};
type CastUrl = {
    type: string;
    openGraph?: {
        url?: string;
        sourceUrl?: string;
        title?: string;
        description?: string;
        domain?: string;
        image?: string;
        useLargeImage?: boolean;
    };
};
type CastTags = {
    type?: string;
    id?: string;
    name?: string;
    imageUrl?: string;
}[];
type AuthorProfileBio = {
    text?: string;
    mentions?: string[];
    channelMentions?: any[];
};
type AuthorProfileLocation = {
    placeId?: string;
    description?: string;
};
type AuthorProfile = {
    bio?: AuthorProfileBio;
    location?: AuthorProfileLocation;
};
type AuthorPfp = {
    url?: string;
    verified?: boolean;
};
type Author = {
    fid?: number;
    username?: string;
    displayName?: string;
    pfp?: AuthorPfp;
    profile?: AuthorProfile;
    followerCount?: number;
    followingCount?: number;
    activeOnFcNetwork?: boolean;
    viewerContext?: {
        following?: boolean;
    };
};
type CastData = {
    hash?: string;
    threadHash?: string;
    parentSource?: {
        type?: string;
        url?: string;
    };
    author?: Author;
    text?: string;
    timestamp?: number;
    mentions?: any[];
    attachments?: any;
    embeds?: {
        casts?: CastData[];
        images?: CastImage[];
        urls?: CastUrl[];
        videos?: CastVideo[];
        unknowns?: any[];
        processedCastText?: string;
    };
    ancestors?: {
        count?: number;
        casts?: CastData[];
    };
    replies?: {
        count?: number;
        casts?: CastData[];
    };
    reactions?: {
        count?: number;
    };
    recasts?: {
        count?: number;
    };
    watches?: {
        count?: number;
    };
    tags?: CastTags;
    viewCount?: number;
    quoteCount?: number;
    combinedRecastCount?: number;
    warpsTipped?: number;
    viewerContext?: {
        reacted?: boolean;
        recast?: boolean;
        bookmarked?: boolean;
        watched?: boolean;
    };
};

/**
 * Renders a Farcaster embed for a cast. You can use two methods to render a Farcaster embed:
 * 1. Providing a Farcaster URL to a cast (url)
 * 2. Providing a username and hash of a cast (username, hash)
 * @param url Farcaster URL for the cast.
 * @param username Username of the cast author.
 * @param hash Hash of the cast.
 * @param castData Optional cast data. If provided, the API call to fetch the cast data will be skipped.
 * @param options Custom overrides. See FarcasterEmbedOptions type for available options.
 * @returns React JSX Component
 */
declare function FarcasterEmbed({ url, username, hash, castData, options, }: {
    url?: string;
    username?: string;
    hash?: string;
    castData?: CastData;
    options?: FarcasterEmbedOptions;
}): react_jsx_runtime.JSX.Element;

export { FarcasterEmbed };
