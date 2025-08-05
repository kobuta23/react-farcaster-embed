import type { FarcasterEmbedOptions } from "../options";
import type { CastData } from "../types";
import { CastImages } from "./cast-images";
import { CastVideos } from "./cast-videos";
import { LikeIcon, RecastIcon, ReplyIcon, FarcasterIcon } from "./icons";
import { CastTextFormatter } from "./cast-text-formatter";
// Import the SDK (assume user will polyfill or provide it in their app)
// @ts-ignore
import { sdk } from "@farcaster/miniapp-sdk";

function handleSdkLinkClick(e: React.MouseEvent<HTMLAnchorElement>) {
  const href = e.currentTarget.getAttribute("href") || "";
  
  // Profile: https://farcaster.xyz/~/profiles/123
  if (/\/~\/profiles\/(\d+)$/.test(href)) {
    e.preventDefault();
    const fid = parseInt(href.split("/").pop() || "0");
    if (fid && sdk?.actions?.viewProfile) {
      sdk.actions.viewProfile({ fid });
    } else {
      // Fallback: open in new tab if SDK not available
      window.open(href, "_blank");
    }
    return;
  }
  
  // Cast: https://farcaster.xyz/username/0x...
  if (/\/0x[0-9a-fA-F]+$/.test(href)) {
    e.preventDefault();
    const hash = href.split("/").pop();
    if (hash && sdk?.actions?.viewCast) {
      sdk.actions.viewCast({ hash });
    } else {
      // Fallback: open in new tab if SDK not available
      window.open(href, "_blank");
    }
    return;
  }
  
  // External links - show warning and open in new tab
  if (href && !href.startsWith("https://farcaster.xyz")) {
    e.preventDefault();
    const confirmed = window.confirm("You are being redirected out of the app. Continue?");
    if (confirmed) {
      window.open(href, "_blank");
    }
    return;
  }
  
  // Otherwise, let browser handle (internal farcaster links)
}

export function CastEmbed({
  cast,
  client,
  options,
}: {
  cast: CastData;
  client?: boolean;
  options: FarcasterEmbedOptions;
}) {
  if (!cast) return null;

  const author = cast.author;
  const profileUrl = `https://farcaster.xyz/~/profiles/${author.fid}`;
  const publishedAt = new Date(cast.timestamp);
  const timestamp = publishedAt.toLocaleString(options.timestampLocale, options.timestampFormat);
  const fullTimestamp = publishedAt.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  const farcasterUrl = `https://farcaster.xyz/${author.username}/${cast.hash}`;
  const replies = cast.replies && cast.replies.count;
  const likes = cast.reactions && cast.reactions.count;
  const recasts = cast.combinedRecastCount ? cast.combinedRecastCount : cast.recasts.count;
  const images = cast.embeds && cast.embeds.images;
  const hasImages = images && images.length > 0;
  const hasVideos = cast.embeds && cast.embeds.videos && cast.embeds.videos.length > 0;
  const videos = cast.embeds && cast.embeds.videos;
  const hasUrls = cast.embeds && cast.embeds.urls && cast.embeds.urls.length > 0;
  const urls = cast.embeds && cast.embeds.urls;
  const quoteCasts = cast.embeds && cast.embeds.casts;

  const mainText = cast.text;
  
  // Get URLs that are embedded (quote casts and URL embeds)
  const embeddedUrls: string[] = [];
  
  // Add quote cast URLs
  if (quoteCasts) {
    quoteCasts.forEach(quoteCast => {
      const quoteUrl = `https://farcaster.xyz/${quoteCast.author.username}/${quoteCast.hash}`;
      embeddedUrls.push(quoteUrl);
    });
  }
  
  // Add URL embed URLs
  if (urls) {
    urls.forEach(urlItem => {
      if (urlItem.openGraph?.url) {
        embeddedUrls.push(urlItem.openGraph.url);
      }
    });
  }

  return (
    <div className="not-prose farcaster-embed-container">
      <div>
        <div className="farcaster-embed-metadata">
          <a href={profileUrl} className="farcaster-embed-avatar-link" onClick={handleSdkLinkClick}>
            <div className="farcaster-embed-author-avatar-container">
              <img src={author.pfp.url} alt={`@${author.username}`} className="farcaster-embed-author-avatar" />
            </div>
          </a>
          <div className="farcaster-embed-author">
            <p className="farcaster-embed-author-display-name">{author.displayName}</p>
            <p className="farcaster-embed-author-username">@{author.username}</p>
          </div>
          <div className="farcaster-embed-timestamp">
            <p title={fullTimestamp}>{timestamp}</p>
          </div>
        </div>
        <div className="farcaster-embed-body" style={{ wordWrap: "break-word" }}>
          <CastTextFormatter 
            text={mainText} 
            maxLength={280} 
            onSdkLinkClick={handleSdkLinkClick}
            embeddedUrls={embeddedUrls}
          />
          {hasImages && <CastImages images={images} />}
          {hasVideos && <CastVideos videos={videos} client={client} />}
          {hasUrls && (
            <div className="farcaster-embed-urls-container">
              {urls
                .map((item, index) => {
                const { description, domain, image, title, url, useLargeImage } = item.openGraph || {};
                const isTwitter = domain === "twitter.com" || domain === "t.co" || domain === "x.com";

                if (useLargeImage) {
                  return (
                    <a key={index} href={url} target="_blank" className="farcaster-embed-url-link" onClick={handleSdkLinkClick}>
                      {image && <img src={image} alt={title} className="farcaster-embed-url-image" />}
                      <span className="farcaster-embed-url-metadata">
                        <span className="farcaster-embed-url-title">{title}</span>
                        {description && <span className="farcaster-embed-url-description">{description}</span>}
                        {domain && <span className="farcaster-embed-url-domain">{domain}</span>}
                      </span>
                    </a>
                  );
                }

                return (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    className="farcaster-embed-url-link farcaster-embed-url-link-compact"
                    onClick={handleSdkLinkClick}
                  >
                    {image && !isTwitter && <img src={image} alt={title} className="farcaster-embed-url-image" />}
                    <span className="farcaster-embed-url-metadata">
                      <span className="farcaster-embed-url-title">{title}</span>
                      {description && <span className="farcaster-embed-url-description">{description}</span>}
                      {domain && <span className="farcaster-embed-url-domain">{domain}</span>}
                    </span>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div className="farcaster-embed-stats">
        <ul>
          <li>
            <a className="farcaster-embed-stats-link" href={farcasterUrl} target="_blank" onClick={handleSdkLinkClick}>
              <ReplyIcon />
              <span>{replies.toLocaleString("en-US")}</span>
            </a>
          </li>
          <li>
            <a className="farcaster-embed-stats-link" href={farcasterUrl} target="_blank" onClick={handleSdkLinkClick}>
              <RecastIcon />
              <span>{recasts.toLocaleString("en-US")}</span>
            </a>
          </li>
          <li>
            <a className="farcaster-embed-stats-link" href={farcasterUrl} target="_blank" onClick={handleSdkLinkClick}>
              <LikeIcon />
              <span>{likes.toLocaleString("en-US")}</span>
            </a>
          </li>
        </ul>
        {cast.tags.length > 0 && (
          <div>
            <div className="farcaster-embed-channel">
              {cast.tags[0].name && <p className="farcaster-embed-channel-name">/{cast.tags[0].name}</p>}
            </div>
          </div>
        )}
        <div className="farcaster-embed-farcaster-icon">
          <a href={farcasterUrl} title="Show on farcaster" target="_blank" className="farcaster-embed-farcaster-link" onClick={handleSdkLinkClick}>
            <FarcasterIcon />
          </a>
        </div>
      </div>
    </div>
  );
}
