var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.tsx
var src_exports = {};
__export(src_exports, {
  FarcasterEmbed: () => FarcasterEmbed
});
module.exports = __toCommonJS(src_exports);
var import_server_only = require("server-only");

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
var import_jsx_runtime = require("react/jsx-runtime");
function CastImages({ images }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "farcaster-embed-image-container", children: images.map((image) => {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { href: image.url, target: "_blank", className: "farcaster-embed-image-link", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: image.url, alt: image.alt, className: "farcaster-embed-image" }) }, image.url);
  }) });
}

// src/client/video-player-client.tsx
var import_react = __toESM(require("react"));
var import_jsx_runtime2 = require("react/jsx-runtime");
function VideoPlayerClient({
  source,
  poster,
  aspectRatio
}) {
  const [isMediaChromeLoaded, setIsMediaChromeLoaded] = import_react.default.useState(false);
  const [isHlsVideoElementLoaded, setIsHlsVideoElementLoaded] = import_react.default.useState(false);
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
  import_react.default.useEffect(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "div",
    {
      style: {
        aspectRatio
      },
      children: isMediaChromeLoaded && isHlsVideoElementLoaded && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
var import_jsx_runtime3 = require("react/jsx-runtime");
function VideoPlayer({ source, poster, aspectRatio }) {
  if (!source) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    "div",
    {
      style: {
        aspectRatio
      },
      children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
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
var import_jsx_runtime4 = require("react/jsx-runtime");
function CastVideos({ videos, client }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "farcaster-embed-video-container", children: videos.map((video) => {
    return client ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      VideoPlayerClient,
      {
        source: video.sourceUrl,
        aspectRatio: video.width / video.height,
        poster: video.thumbnailUrl
      },
      video.url
    ) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
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
var import_jsx_runtime5 = require("react/jsx-runtime");
var ReplyIcon = () => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
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
    children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" })
  }
);
var RecastIcon = () => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
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
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M17 2.1l4 4-4 4" }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M3 12.2v-2a4 4 0 0 1 4-4h12.8M7 21.9l-4-4 4-4" }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M21 11.8v2a4 4 0 0 1-4 4H4.2" })
    ]
  }
);
var LikeIcon = () => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
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
    children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" })
  }
);
var WarpcastIcon = () => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("svg", { width: "24", height: "24", viewBox: "0 0 1260 1260", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
  /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("g", { clipPath: "url(#fc-embed-clip1)", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      "path",
      {
        d: "M947.747 1259.61H311.861C139.901 1259.61 0 1119.72 0 947.752V311.871C0 139.907 139.901 0.00541362 311.861 0.00541362H947.747C1119.71 0.00541362 1259.61 139.907 1259.61 311.871V947.752C1259.61 1119.72 1119.71 1259.61 947.747 1259.61Z",
        fill: "#472A91"
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      "path",
      {
        d: "M826.513 398.633L764.404 631.889L702.093 398.633H558.697L495.789 633.607L433.087 398.633H269.764L421.528 914.36H562.431L629.807 674.876L697.181 914.36H838.388L989.819 398.633H826.513Z",
        fill: "white"
      }
    )
  ] }),
  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("clipPath", { id: "fc-embed-clip1", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("rect", { width: "1259.61", height: "1259.61", fill: "white" }) }) })
] });

// src/components/cast-text-formatter.tsx
var import_react2 = require("react");
var import_linkify_react = __toESM(require("linkify-react"));
var import_jsx_runtime6 = require("react/jsx-runtime");
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
  const [isExpanded, setIsExpanded] = (0, import_react2.useState)(false);
  (0, import_react2.useEffect)(() => {
    setIsExpanded(false);
  }, [text, maxLength]);
  if (!text) {
    return null;
  }
  const shouldTruncate = text.length > maxLength;
  const displayText = shouldTruncate && !isExpanded ? text.substring(0, maxLength) : text;
  const renderText = () => {
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_linkify_react.default, { as: "span", options: getLinkifyOptions(onSdkLinkClick, embeddedUrls), children: displayText });
  };
  if (!shouldTruncate) {
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className, children: renderText() });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className, children: [
    renderText(),
    isExpanded ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
    ) : /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
var import_miniapp_sdk = require("@farcaster/miniapp-sdk");
var import_jsx_runtime7 = require("react/jsx-runtime");
function handleSdkLinkClick(e) {
  var _a, _b, _c, _d;
  const href = e.currentTarget.getAttribute("href") || "";
  if (/\/~\/profiles\/(\d+)$/.test(href)) {
    e.preventDefault();
    const fid = parseInt(href.split("/").pop() || "0");
    if (fid && ((_b = (_a = import_miniapp_sdk.sdk) == null ? void 0 : _a.actions) == null ? void 0 : _b.viewProfile)) {
      import_miniapp_sdk.sdk.actions.viewProfile({ fid });
    } else {
      window.open(href, "_blank");
    }
    return;
  }
  if (/\/0x[0-9a-fA-F]+$/.test(href)) {
    e.preventDefault();
    const hash = href.split("/").pop();
    if (hash && ((_d = (_c = import_miniapp_sdk.sdk) == null ? void 0 : _c.actions) == null ? void 0 : _d.viewCast)) {
      import_miniapp_sdk.sdk.actions.viewCast({ hash });
    } else {
      window.open(href, "_blank");
    }
    return;
  }
  if (href && !href.startsWith("https://warpcast.com")) {
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
  const profileUrl = `https://warpcast.com/~/profiles/${author.fid}`;
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
  const warpcastUrl = `https://warpcast.com/${author.username}/${cast.hash}`;
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
      const quoteUrl = `https://warpcast.com/${quoteCast.author.username}/${quoteCast.hash}`;
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
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "not-prose farcaster-embed-container", children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "farcaster-embed-metadata", children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("a", { href: profileUrl, className: "farcaster-embed-avatar-link", onClick: handleSdkLinkClick, children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "farcaster-embed-author-avatar-container", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("img", { src: author.pfp.url, alt: `@${author.username}`, className: "farcaster-embed-author-avatar" }) }) }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "farcaster-embed-author", children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { className: "farcaster-embed-author-display-name", children: author.displayName }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("p", { className: "farcaster-embed-author-username", children: [
            "@",
            author.username
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "farcaster-embed-timestamp", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { title: fullTimestamp, children: timestamp }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "farcaster-embed-body", style: { wordWrap: "break-word" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
          CastTextFormatter,
          {
            text: mainText,
            maxLength: 280,
            onSdkLinkClick: handleSdkLinkClick,
            embeddedUrls
          }
        ),
        hasImages && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(CastImages, { images }),
        hasVideos && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(CastVideos, { videos, client }),
        hasUrls && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "farcaster-embed-urls-container", children: urls.filter((item) => {
          const { url } = item.openGraph || {};
          if (!url)
            return true;
          const isQuoteCastUrl = quoteCasts == null ? void 0 : quoteCasts.some((quoteCast) => {
            const quoteUrl = `https://warpcast.com/${quoteCast.author.username}/${quoteCast.hash}`;
            return url === quoteUrl;
          });
          return !isQuoteCastUrl;
        }).map((item, index) => {
          const { description, domain, image, title, url, useLargeImage } = item.openGraph || {};
          const isTwitter = domain === "twitter.com" || domain === "t.co" || domain === "x.com";
          if (domain === "warpcast.com")
            return null;
          if (useLargeImage) {
            return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("a", { href: url, target: "_blank", className: "farcaster-embed-url-link", onClick: handleSdkLinkClick, children: [
              image && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("img", { src: image, alt: title, className: "farcaster-embed-url-image" }),
              /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { className: "farcaster-embed-url-metadata", children: [
                /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "farcaster-embed-url-title", children: title }),
                description && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "farcaster-embed-url-description", children: description }),
                domain && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "farcaster-embed-url-domain", children: domain })
              ] })
            ] }, index);
          }
          return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
            "a",
            {
              href: url,
              target: "_blank",
              className: "farcaster-embed-url-link farcaster-embed-url-link-compact",
              onClick: handleSdkLinkClick,
              children: [
                image && !isTwitter && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("img", { src: image, alt: title, className: "farcaster-embed-url-image" }),
                /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { className: "farcaster-embed-url-metadata", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "farcaster-embed-url-title", children: title }),
                  description && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "farcaster-embed-url-description", children: description }),
                  domain && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "farcaster-embed-url-domain", children: domain })
                ] })
              ]
            },
            index
          );
        }) }),
        hasCastEmbeds && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "farcaster-embed-quote-cast-container", children: quoteCasts.filter((quoteCast) => {
          var _a2, _b2;
          const isSameAsMainCast = ((_a2 = quoteCast.author) == null ? void 0 : _a2.username) === ((_b2 = cast.author) == null ? void 0 : _b2.username) && quoteCast.hash === cast.hash;
          if (isSameAsMainCast) {
            return false;
          }
          const quoteUrl = `https://warpcast.com/${quoteCast.author.username}/${quoteCast.hash}`;
          return !mainText.includes(quoteUrl);
        }).map((quoteCast) => {
          const qcPublishedAt = new Date(quoteCast.timestamp);
          const qcTimestamp = qcPublishedAt.toLocaleString(options.timestampLocale, options.timestampFormat);
          const qcHasImages = quoteCast.embeds && quoteCast.embeds.images && quoteCast.embeds.images.length > 0;
          const qcImages = quoteCast.embeds && quoteCast.embeds.images;
          const qcHasVideos = quoteCast.embeds && quoteCast.embeds.videos && quoteCast.embeds.videos.length > 0;
          const qcVideos = quoteCast.embeds && quoteCast.embeds.videos;
          return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "farcaster-embed-quote-cast", children: [
            /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "farcaster-embed-metadata", children: [
              /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "farcaster-embed-avatar-link", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "farcaster-embed-quote-cast-author-avatar-container", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
                "img",
                {
                  src: quoteCast.author.pfp.url,
                  alt: `@${quoteCast.author.username}`,
                  width: 20,
                  height: 20,
                  className: "farcaster-embed-author-avatar"
                }
              ) }) }),
              /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "farcaster-embed-author", children: [
                /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { className: "farcaster-embed-author-display-name", children: quoteCast.author.displayName }),
                /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("p", { className: "farcaster-embed-author-username", children: [
                  "@",
                  quoteCast.author.username
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "farcaster-embed-timestamp", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { children: qcTimestamp }) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "farcaster-embed-body", children: [
              /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
                CastTextFormatter,
                {
                  text: quoteCast.text,
                  maxLength: 280,
                  onSdkLinkClick: handleSdkLinkClick,
                  embeddedUrls: []
                }
              ),
              qcHasImages && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(CastImages, { images: qcImages }),
              qcHasVideos && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(CastVideos, { videos: qcVideos })
            ] })
          ] }, quoteCast.hash);
        }) })
      ] }),
      cast.tags.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "farcaster-embed-channel", children: [
        cast.tags[0].imageUrl && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "farcaster-embed-channel-avatar-container", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("img", { src: cast.tags[0].imageUrl, alt: cast.tags[0].name, className: "farcaster-embed-channel-avatar", width: 16, height: 16 }) }),
        cast.tags[0].name && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { className: "farcaster-embed-channel-name", children: cast.tags[0].name })
      ] }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "farcaster-embed-stats", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("ul", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("a", { className: "farcaster-embed-stats-link", href: warpcastUrl, target: "_blank", onClick: handleSdkLinkClick, children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(ReplyIcon, {}),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { children: replies.toLocaleString("en-US") })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("a", { className: "farcaster-embed-stats-link", href: warpcastUrl, target: "_blank", onClick: handleSdkLinkClick, children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(RecastIcon, {}),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { children: recasts.toLocaleString("en-US") })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("a", { className: "farcaster-embed-stats-link", href: warpcastUrl, target: "_blank", onClick: handleSdkLinkClick, children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(LikeIcon, {}),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { children: likes.toLocaleString("en-US") })
        ] }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "farcaster-embed-warpcast-icon", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("a", { href: warpcastUrl, title: "Show on Warpcast", target: "_blank", className: "farcaster-embed-warpcast-link", onClick: handleSdkLinkClick, children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(WarpcastIcon, {}) }) })
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
var import_jsx_runtime8 = require("react/jsx-runtime");
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
      "You must provide a Warpcast URL or username and hash to embed a cast. Or provide your own castData to render the component."
    );
  }
  const cast = castData ?? await getCast(username, hash, { ...defaultOptions, ...options });
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(CastEmbed, { cast, options: { ...defaultOptions, ...options } });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FarcasterEmbed
});
//# sourceMappingURL=index.js.map