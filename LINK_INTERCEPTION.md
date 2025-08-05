# Link Interception in react-farcaster-embed

## Overview

The react-farcaster-embed package includes intelligent link interception that provides a seamless in-app experience for Farcaster-specific links while safely handling external links.

## How It Works

### Link Types and Behavior

1. **Profile Links** (`https://warpcast.com/~/profiles/123`)
   - **Behavior**: Uses Farcaster SDK to open profile in-app
   - **Fallback**: Opens in new tab if SDK unavailable
   - **Example**: `https://warpcast.com/~/profiles/456`

2. **Cast Links** (`https://warpcast.com/username/0x...`)
   - **Behavior**: Uses Farcaster SDK to open cast in-app
   - **Fallback**: Opens in new tab if SDK unavailable
   - **Example**: `https://warpcast.com/alice/0x123abc`

3. **External Links** (any non-Warpcast URL)
   - **Behavior**: Shows confirmation dialog, then opens in new tab
   - **Message**: "You are being redirected out of the app. Continue?"
   - **Example**: `https://example.com`, `https://github.com`

4. **Internal Warpcast Links** (`https://warpcast.com/...`)
   - **Behavior**: Opens normally in browser (no interception)
   - **Example**: `https://warpcast.com/explore`

### Implementation

The link interception is implemented in the `handleSdkLinkClick` function in `src/components/cast.tsx`:

```tsx
function handleSdkLinkClick(e: React.MouseEvent<HTMLAnchorElement>) {
  const href = e.currentTarget.getAttribute("href") || "";
  
  // Profile links
  if (/\/~\/profiles\/(\d+)$/.test(href)) {
    e.preventDefault();
    const fid = parseInt(href.split("/").pop() || "0");
    if (fid && sdk?.actions?.viewProfile) {
      sdk.actions.viewProfile({ fid });
    } else {
      window.open(href, "_blank");
    }
    return;
  }
  
  // Cast links
  if (/\/0x[0-9a-fA-F]+$/.test(href)) {
    e.preventDefault();
    const hash = href.split("/").pop();
    if (hash && sdk?.actions?.viewCast) {
      sdk.actions.viewCast({ hash });
    } else {
      window.open(href, "_blank");
    }
    return;
  }
  
  // External links
  if (href && !href.startsWith("https://warpcast.com")) {
    e.preventDefault();
    const confirmed = window.confirm("You are being redirected out of the app. Continue?");
    if (confirmed) {
      window.open(href, "_blank");
    }
    return;
  }
  
  // Internal Warpcast links - let browser handle
}
```

## Where It's Applied

The link interception is applied to:

1. **Text links** - Via `CastTextFormatter` component using `linkify-react`
2. **Avatar links** - Direct `onClick` handler
3. **URL embeds** - Direct `onClick` handler
4. **Stats links** - Direct `onClick` handler
5. **Warpcast icon link** - Direct `onClick` handler

## Testing

### Manual Testing

1. Open `test-link-interception.html` in a browser
2. Click different types of links to see the behavior
3. Check browser console for detailed logs
4. Test with and without SDK available

### Expected Behavior

- **Profile/Cast links**: Should show SDK alert or open in new tab
- **External links**: Should show confirmation dialog, then open in new tab
- **Internal Warpcast links**: Should open normally in browser

### SDK Integration

The component expects the Farcaster Mini App SDK to be available:

```tsx
import { sdk } from "@farcaster/miniapp-sdk";
```

If the SDK is not available, links fall back to opening in new tabs.

## Configuration

The link interception behavior can be customized by modifying the `handleSdkLinkClick` function. Common customizations:

- **Change warning message**: Modify the `window.confirm` text
- **Add analytics**: Log link clicks before processing
- **Custom external link handling**: Add specific logic for certain domains
- **Disable interception**: Remove `onClick` handlers for specific links

## Security Considerations

- External links always show a confirmation dialog
- Links open in new tabs to preserve the current app state
- SDK calls are wrapped in try-catch for graceful fallback
- No sensitive data is logged or transmitted 