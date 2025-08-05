// src/index.tsx
import "server-only";

// src/api.ts
var getCast = async (username, hash, options) => {
  try {
    const res = await fetch(
      (options == null ? void 0 : options.customEndpoint) ? `${options == null ? void 0 : options.customEndpoint}/${username}/${hash}` : `https://farcaster.tv/${username}/${hash}`
    );
    const cast = await res.json();
    if (cast.result.casts[0].hash === "0x0000000000000000000000000000000000000000") {
      throw new Error("Root cast has been deleted.");
    }
    return cast.result.casts.findLast((cast2) => cast2.hash.includes(hash));
  } catch (e) {
    console.error(e);
    if (!(options == null ? void 0 : options.silentError)) {
      throw new Error(
        `Unable to fetch cast ${hash} by ${username} as it most likely does not exist anymore.${(options == null ? void 0 : options.customEndpoint) ? " You are using a custom endpoint (" + (options == null ? void 0 : options.customEndpoint) + "). Make sure it is correct and the server is running. For more info about the proxy server check the README." : ""}`
      );
    }
  }
};

// src/components/cast-images.tsx
import { jsx } from "react/jsx-runtime";
function CastImages({ images }) {
  return /* @__PURE__ */ jsx("div", { className: "farcaster-embed-image-container", children: images.map((image) => {
    return /* @__PURE__ */ jsx("a", { href: image.url, target: "_blank", className: "farcaster-embed-image-link", children: /* @__PURE__ */ jsx("img", { src: image.url, alt: image.alt, className: "farcaster-embed-image" }) }, image.url);
  }) });
}

// src/client/video-player-client.tsx
import React from "react";
import { jsx as jsx2 } from "react/jsx-runtime";
function VideoPlayerClient({
  source,
  poster,
  aspectRatio
}) {
  const [isMediaChromeLoaded, setIsMediaChromeLoaded] = React.useState(false);
  const [isHlsVideoElementLoaded, setIsHlsVideoElementLoaded] = React.useState(false);
  if (!source) {
    return null;
  }
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.type = "module";
      script.onload = () => resolve(script);
      script.onerror = () => reject(new Error(`[react-farcaster-embed] Script load error for ${src}`));
      document.head.appendChild(script);
    });
  };
  React.useEffect(() => {
    const mediaChrome = "https://cdn.jsdelivr.net/npm/media-chrome@1/+esm";
    const hlsVideoElement = "https://cdn.jsdelivr.net/npm/hls-video-element@1.0/+esm";
    loadScript(mediaChrome).then(() => {
      setIsMediaChromeLoaded(true);
    }).catch((error) => {
      console.error("Media Chrome loading failed", error);
    });
    loadScript(hlsVideoElement).then(() => {
      setIsHlsVideoElementLoaded(true);
    }).catch((error) => {
      console.error("HLS Video Element loading failed", error);
    });
    return () => {
      document.head.removeChild(document.head.querySelector(`script[src="${mediaChrome}"]`));
      document.head.removeChild(document.head.querySelector(`script[src="${hlsVideoElement}"]`));
    };
  }, [source, poster, aspectRatio]);
  return /* @__PURE__ */ jsx2(
    "div",
    {
      style: {
        aspectRatio
      },
      children: isMediaChromeLoaded && isHlsVideoElementLoaded && /* @__PURE__ */ jsx2(
        "div",
        {
          className: "farcaster-embed-video-player",
          dangerouslySetInnerHTML: {
            __html: `<media-controller>
            <hls-video
              src="${source}"
              slot="media"
              volume="1"
              crossorigin
              playsinline
            ></hls-video>
            <media-poster-image
              slot="poster"
              src="${poster}">
            </media-poster-image>
            <media-loading-indicator slot="centered-chrome" noautohide></media-loading-indicator>
            <media-control-bar>
              <media-play-button></media-play-button>
              <media-time-range></media-time-range>
              <media-time-display showduration remaining></media-time-display>
              <media-fullscreen-button></media-fullscreen-button>
            </media-control-bar>
          </media-controller>`
          }
        }
      )
    }
  );
}

// src/components/video-player.tsx
import { jsx as jsx3 } from "react/jsx-runtime";
function VideoPlayer({ source, poster, aspectRatio }) {
  if (!source) {
    return null;
  }
  return /* @__PURE__ */ jsx3(
    "div",
    {
      style: {
        aspectRatio
      },
      children: /* @__PURE__ */ jsx3(
        "div",
        {
          className: "farcaster-embed-video-player",
          suppressHydrationWarning: true,
          dangerouslySetInnerHTML: {
            __html: `<script type="module" src="https://cdn.jsdelivr.net/npm/media-chrome@1/+esm" crossorigin="anonymous"></script><script type="module" src="https://cdn.jsdelivr.net/npm/hls-video-element@1.0/+esm" crossorigin="anonymous"></script><media-controller>
            <hls-video
              src="${source}"
              slot="media"
              volume="1"
              crossorigin
              playsinline
            ></hls-video>
            <media-poster-image
              slot="poster"
              src="${poster}">
            </media-poster-image>
            <media-loading-indicator slot="centered-chrome" noautohide></media-loading-indicator>
            <media-control-bar>
              <media-play-button></media-play-button>
              <media-time-range></media-time-range>
              <media-time-display showduration remaining></media-time-display>
              <media-fullscreen-button></media-fullscreen-button>
            </media-control-bar>
          </media-controller>`
          }
        }
      )
    }
  );
}

// src/components/cast-videos.tsx
import { jsx as jsx4 } from "react/jsx-runtime";
function CastVideos({ videos, client }) {
  return /* @__PURE__ */ jsx4("div", { className: "farcaster-embed-video-container", children: videos.map((video) => {
    return client ? /* @__PURE__ */ jsx4(
      VideoPlayerClient,
      {
        source: video.sourceUrl,
        aspectRatio: video.width / video.height,
        poster: video.thumbnailUrl
      },
      video.url
    ) : /* @__PURE__ */ jsx4(
      VideoPlayer,
      {
        source: video.sourceUrl,
        aspectRatio: video.width / video.height,
        poster: video.thumbnailUrl
      },
      video.url
    );
  }) });
}

// src/components/icons.tsx
import { jsx as jsx5, jsxs } from "react/jsx-runtime";
var ReplyIcon = () => /* @__PURE__ */ jsx5(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    children: /* @__PURE__ */ jsx5("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" })
  }
);
var RecastIcon = () => /* @__PURE__ */ jsxs(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    children: [
      /* @__PURE__ */ jsx5("path", { d: "M17 2.1l4 4-4 4" }),
      /* @__PURE__ */ jsx5("path", { d: "M3 12.2v-2a4 4 0 0 1 4-4h12.8M7 21.9l-4-4 4-4" }),
      /* @__PURE__ */ jsx5("path", { d: "M21 11.8v2a4 4 0 0 1-4 4H4.2" })
    ]
  }
);
var LikeIcon = () => /* @__PURE__ */ jsx5(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    children: /* @__PURE__ */ jsx5("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" })
  }
);

// src/components/cast-text-formatter.tsx
import { useState, useEffect } from "react";
import Linkify from "linkify-react";
import { jsx as jsx6, jsxs as jsxs2 } from "react/jsx-runtime";
var getLinkifyOptions = (onSdkLinkClick, embeddedUrls = []) => ({
  className: (href) => {
    const baseClass = "farcaster-embed-body-link";
    return embeddedUrls.includes(href) ? `${baseClass} embedded` : baseClass;
  },
  target: "_blank",
  attributes: onSdkLinkClick ? {
    onClick: (e) => {
      const href = e.currentTarget.getAttribute("href") || "";
      if (embeddedUrls.includes(href)) {
        e.preventDefault();
        return;
      }
      onSdkLinkClick(e);
    }
  } : void 0
});
function CastTextFormatter({
  text,
  maxLength = 280,
  className = "",
  onSdkLinkClick,
  embeddedUrls = []
}) {
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
    return /* @__PURE__ */ jsx6(Linkify, { as: "span", options: getLinkifyOptions(onSdkLinkClick, embeddedUrls), children: displayText });
  };
  if (!shouldTruncate) {
    return /* @__PURE__ */ jsx6("span", { className, children: renderText() });
  }
  return /* @__PURE__ */ jsxs2("span", { className, children: [
    renderText(),
    isExpanded ? /* @__PURE__ */ jsx6(
      "button",
      {
        onClick: () => setIsExpanded(false),
        style: {
          marginLeft: 4,
          color: "#FF6200",
          background: "none",
          border: "none",
          cursor: "pointer",
          textDecoration: "underline"
        },
        children: "see less"
      }
    ) : /* @__PURE__ */ jsx6(
      "button",
      {
        onClick: () => setIsExpanded(true),
        style: {
          marginLeft: 4,
          color: "#FF6200",
          background: "none",
          border: "none",
          cursor: "pointer",
          textDecoration: "underline"
        },
        children: "see more..."
      }
    )
  ] });
}

// src/components/cast.tsx
import { sdk } from "@farcaster/miniapp-sdk";
import { jsx as jsx7, jsxs as jsxs3 } from "react/jsx-runtime";
function handleSdkLinkClick(e) {
  var _a, _b, _c, _d;
  const href = e.currentTarget.getAttribute("href") || "";
  if (/\/~\/profiles\/(\d+)$/.test(href)) {
    e.preventDefault();
    const fid = parseInt(href.split("/").pop() || "0");
    if (fid && ((_b = (_a = sdk) == null ? void 0 : _a.actions) == null ? void 0 : _b.viewProfile)) {
      sdk.actions.viewProfile({ fid });
    } else {
      window.open(href, "_blank");
    }
    return;
  }
  if (/\/0x[0-9a-fA-F]+$/.test(href)) {
    e.preventDefault();
    const hash = href.split("/").pop();
    if (hash && ((_d = (_c = sdk) == null ? void 0 : _c.actions) == null ? void 0 : _d.viewCast)) {
      sdk.actions.viewCast({ hash });
    } else {
      window.open(href, "_blank");
    }
    return;
  }
  if (href && !href.startsWith("https://farcaster.xyz")) {
    e.preventDefault();
    const confirmed = window.confirm("You are being redirected out of the app. Continue?");
    if (confirmed) {
      window.open(href, "_blank");
    }
    return;
  }
}
function CastEmbed({
  cast,
  client,
  options
}) {
  var _a, _b;
  if (!cast)
    return null;
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
    hour12: true
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
  const lastUrl = urls && ((_b = (_a = urls[urls.length - 1]) == null ? void 0 : _a.openGraph) == null ? void 0 : _b.url) || "";
  const hasCastEmbeds = cast.embeds && cast.embeds.casts;
  const quoteCasts = cast.embeds && cast.embeds.casts;
  const mainText = cast.text;
  const embeddedUrls = [];
  if (quoteCasts) {
    quoteCasts.forEach((quoteCast) => {
      const quoteUrl = `https://farcaster.xyz/${quoteCast.author.username}/${quoteCast.hash}`;
      embeddedUrls.push(quoteUrl);
    });
  }
  if (urls) {
    urls.forEach((urlItem) => {
      var _a2;
      if ((_a2 = urlItem.openGraph) == null ? void 0 : _a2.url) {
        embeddedUrls.push(urlItem.openGraph.url);
      }
    });
  }
  return /* @__PURE__ */ jsxs3("div", { className: "not-prose farcaster-embed-container", children: [
    /* @__PURE__ */ jsxs3("div", { children: [
      /* @__PURE__ */ jsxs3("div", { className: "farcaster-embed-metadata", children: [
        /* @__PURE__ */ jsx7("a", { href: profileUrl, className: "farcaster-embed-avatar-link", onClick: handleSdkLinkClick, children: /* @__PURE__ */ jsx7("div", { className: "farcaster-embed-author-avatar-container", children: /* @__PURE__ */ jsx7("img", { src: author.pfp.url, alt: `@${author.username}`, className: "farcaster-embed-author-avatar" }) }) }),
        /* @__PURE__ */ jsxs3("div", { className: "farcaster-embed-author", children: [
          /* @__PURE__ */ jsx7("p", { className: "farcaster-embed-author-display-name", children: author.displayName }),
          /* @__PURE__ */ jsxs3("p", { className: "farcaster-embed-author-username", children: [
            "@",
            author.username
          ] })
        ] }),
        /* @__PURE__ */ jsx7("div", { className: "farcaster-embed-timestamp", children: /* @__PURE__ */ jsx7("p", { title: fullTimestamp, children: timestamp }) })
      ] }),
      /* @__PURE__ */ jsxs3("div", { className: "farcaster-embed-body", style: { wordWrap: "break-word" }, children: [
        /* @__PURE__ */ jsx7(
          CastTextFormatter,
          {
            text: mainText,
            maxLength: 280,
            onSdkLinkClick: handleSdkLinkClick,
            embeddedUrls
          }
        ),
        hasImages && /* @__PURE__ */ jsx7(CastImages, { images }),
        hasVideos && /* @__PURE__ */ jsx7(CastVideos, { videos, client }),
        hasUrls && /* @__PURE__ */ jsx7("div", { className: "farcaster-embed-urls-container", children: urls.filter((item) => {
          const { url, title, description } = item.openGraph || {};
          if (!url)
            return true;
          const isQuoteCastUrl = quoteCasts == null ? void 0 : quoteCasts.some((quoteCast) => {
            const quoteUrl = `https://farcaster.xyz/${quoteCast.author.username}/${quoteCast.hash}`;
            return url === quoteUrl;
          });
          if (isQuoteCastUrl)
            return false;
          const isQuoteCastContent = quoteCasts == null ? void 0 : quoteCasts.some((quoteCast) => {
            const quoteText = quoteCast.text || "";
            const urlTitle = title || "";
            const urlDescription = description || "";
            return urlTitle.includes(quoteText) || urlDescription.includes(quoteText) || quoteText.includes(urlTitle);
          });
          return !isQuoteCastContent;
        }).map((item, index) => {
          const { description, domain, image, title, url, useLargeImage } = item.openGraph || {};
          const isTwitter = domain === "twitter.com" || domain === "t.co" || domain === "x.com";
          if (domain === "farcaster.xyz")
            return null;
          if (useLargeImage) {
            return /* @__PURE__ */ jsxs3("a", { href: url, target: "_blank", className: "farcaster-embed-url-link", onClick: handleSdkLinkClick, children: [
              image && /* @__PURE__ */ jsx7("img", { src: image, alt: title, className: "farcaster-embed-url-image" }),
              /* @__PURE__ */ jsxs3("span", { className: "farcaster-embed-url-metadata", children: [
                /* @__PURE__ */ jsx7("span", { className: "farcaster-embed-url-title", children: title }),
                description && /* @__PURE__ */ jsx7("span", { className: "farcaster-embed-url-description", children: description }),
                domain && /* @__PURE__ */ jsx7("span", { className: "farcaster-embed-url-domain", children: domain })
              ] })
            ] }, index);
          }
          return /* @__PURE__ */ jsxs3(
            "a",
            {
              href: url,
              target: "_blank",
              className: "farcaster-embed-url-link farcaster-embed-url-link-compact",
              onClick: handleSdkLinkClick,
              children: [
                image && !isTwitter && /* @__PURE__ */ jsx7("img", { src: image, alt: title, className: "farcaster-embed-url-image" }),
                /* @__PURE__ */ jsxs3("span", { className: "farcaster-embed-url-metadata", children: [
                  /* @__PURE__ */ jsx7("span", { className: "farcaster-embed-url-title", children: title }),
                  description && /* @__PURE__ */ jsx7("span", { className: "farcaster-embed-url-description", children: description }),
                  domain && /* @__PURE__ */ jsx7("span", { className: "farcaster-embed-url-domain", children: domain })
                ] })
              ]
            },
            index
          );
        }) }),
        hasCastEmbeds && /* @__PURE__ */ jsx7("div", { className: "farcaster-embed-quote-cast-container", children: quoteCasts.filter((quoteCast) => {
          var _a2, _b2;
          const isSameAsMainCast = ((_a2 = quoteCast.author) == null ? void 0 : _a2.username) === ((_b2 = cast.author) == null ? void 0 : _b2.username) && quoteCast.hash === cast.hash;
          if (isSameAsMainCast) {
            return false;
          }
          const quoteUrl = `https://farcaster.xyz/${quoteCast.author.username}/${quoteCast.hash}`;
          return !mainText.includes(quoteUrl);
        }).map((quoteCast) => {
          const qcPublishedAt = new Date(quoteCast.timestamp);
          const qcTimestamp = qcPublishedAt.toLocaleString(options.timestampLocale, options.timestampFormat);
          const qcHasImages = quoteCast.embeds && quoteCast.embeds.images && quoteCast.embeds.images.length > 0;
          const qcImages = quoteCast.embeds && quoteCast.embeds.images;
          const qcHasVideos = quoteCast.embeds && quoteCast.embeds.videos && quoteCast.embeds.videos.length > 0;
          const qcVideos = quoteCast.embeds && quoteCast.embeds.videos;
          return /* @__PURE__ */ jsxs3("div", { className: "farcaster-embed-quote-cast", children: [
            /* @__PURE__ */ jsxs3("div", { className: "farcaster-embed-metadata", children: [
              /* @__PURE__ */ jsx7("div", { className: "farcaster-embed-avatar-link", children: /* @__PURE__ */ jsx7("div", { className: "farcaster-embed-quote-cast-author-avatar-container", children: /* @__PURE__ */ jsx7(
                "img",
                {
                  src: quoteCast.author.pfp.url,
                  alt: `@${quoteCast.author.username}`,
                  width: 20,
                  height: 20,
                  className: "farcaster-embed-author-avatar"
                }
              ) }) }),
              /* @__PURE__ */ jsxs3("div", { className: "farcaster-embed-author", children: [
                /* @__PURE__ */ jsx7("p", { className: "farcaster-embed-author-display-name", children: quoteCast.author.displayName }),
                /* @__PURE__ */ jsxs3("p", { className: "farcaster-embed-author-username", children: [
                  "@",
                  quoteCast.author.username
                ] })
              ] }),
              /* @__PURE__ */ jsx7("div", { className: "farcaster-embed-timestamp", children: /* @__PURE__ */ jsx7("p", { children: qcTimestamp }) })
            ] }),
            /* @__PURE__ */ jsxs3("div", { className: "farcaster-embed-body", children: [
              /* @__PURE__ */ jsx7(
                CastTextFormatter,
                {
                  text: quoteCast.text,
                  maxLength: 280,
                  onSdkLinkClick: handleSdkLinkClick,
                  embeddedUrls: []
                }
              ),
              qcHasImages && /* @__PURE__ */ jsx7(CastImages, { images: qcImages }),
              qcHasVideos && /* @__PURE__ */ jsx7(CastVideos, { videos: qcVideos })
            ] })
          ] }, quoteCast.hash);
        }) })
      ] }),
      cast.tags.length > 0 && /* @__PURE__ */ jsx7("div", { children: /* @__PURE__ */ jsxs3("div", { className: "farcaster-embed-channel", children: [
        cast.tags[0].imageUrl && /* @__PURE__ */ jsx7("div", { className: "farcaster-embed-channel-avatar-container", children: /* @__PURE__ */ jsx7("img", { src: cast.tags[0].imageUrl, alt: cast.tags[0].name, className: "farcaster-embed-channel-avatar", width: 16, height: 16 }) }),
        cast.tags[0].name && /* @__PURE__ */ jsx7("p", { className: "farcaster-embed-channel-name", children: cast.tags[0].name })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs3("div", { className: "farcaster-embed-stats", children: [
      /* @__PURE__ */ jsxs3("ul", { children: [
        /* @__PURE__ */ jsx7("li", { children: /* @__PURE__ */ jsxs3("a", { className: "farcaster-embed-stats-link", href: farcasterUrl, target: "_blank", onClick: handleSdkLinkClick, children: [
          /* @__PURE__ */ jsx7(ReplyIcon, {}),
          /* @__PURE__ */ jsx7("span", { children: replies.toLocaleString("en-US") })
        ] }) }),
        /* @__PURE__ */ jsx7("li", { children: /* @__PURE__ */ jsxs3("a", { className: "farcaster-embed-stats-link", href: farcasterUrl, target: "_blank", onClick: handleSdkLinkClick, children: [
          /* @__PURE__ */ jsx7(RecastIcon, {}),
          /* @__PURE__ */ jsx7("span", { children: recasts.toLocaleString("en-US") })
        ] }) }),
        /* @__PURE__ */ jsx7("li", { children: /* @__PURE__ */ jsxs3("a", { className: "farcaster-embed-stats-link", href: farcasterUrl, target: "_blank", onClick: handleSdkLinkClick, children: [
          /* @__PURE__ */ jsx7(LikeIcon, {}),
          /* @__PURE__ */ jsx7("span", { children: likes.toLocaleString("en-US") })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx7("div", { className: "farcaster-embed-farcaster-icon", children: /* @__PURE__ */ jsx7("a", { href: farcasterUrl, title: "Show on farcaster", target: "_blank", className: "farcaster-embed-farcaster-link", onClick: handleSdkLinkClick, children: /* @__PURE__ */ jsx7("farcasterIcon", {}) }) })
    ] })
  ] });
}

// src/options.ts
var defaultOptions = {
  timestampFormat: {
    year: "numeric",
    month: "short",
    day: "numeric"
  },
  timestampLocale: "en-US",
  silentError: false
};

// src/index.tsx
import { jsx as jsx8 } from "react/jsx-runtime";
async function FarcasterEmbed({
  url,
  username,
  hash,
  castData,
  options
}) {
  if (url) {
    const urlParts = url.split("/");
    username = urlParts[3];
    hash = urlParts[4];
  }
  if (!castData && (!username || !hash)) {
    throw new Error(
      "You must provide a Farcaster URL or username and hash to embed a cast. Or provide your own castData to render the component."
    );
  }
  const cast = castData ?? await getCast(username, hash, { ...defaultOptions, ...options });
  return /* @__PURE__ */ jsx8(CastEmbed, { cast, options: { ...defaultOptions, ...options } });
}
export {
  FarcasterEmbed
};
//# sourceMappingURL=index.mjs.map