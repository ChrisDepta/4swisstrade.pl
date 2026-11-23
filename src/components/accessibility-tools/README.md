# AccessibilityTools

Reusable React component with an independent, fixed accessibility panel. Copy
`accessibility-tools.tsx` and `accessibility-tools.css` together. The component
requires React 19 and `lucide-react`; it does not depend on Next.js or Tailwind.

```tsx
import { AccessibilityTools } from "./accessibility-tools/accessibility-tools";

<AccessibilityTools storageKey="my-site-accessibility" brand="MY SITE">
  <App />
</AccessibilityTools>
```

Mount one instance around the site's content, outside transformed or filtered
ancestors. Render the application's header, main content and footer as children.
The component's CSS must be processed by the host application's bundler.
`storageKey` identifies the browser's saved settings. `brand` and the optional
`labels` object customize the panel; `AccessibilityLabels` describes the labels.
Polish labels are the default. `legacyStoragePrefix` optionally migrates the
previous `-font-scale`, `-large-text`, `-high-contrast`, `-reduce-motion` and
`-invert-colors` keys when no settings exist under `storageKey`.

The slider changes the root font size from 1× to 4×. Text using `rem` scales
with it; text fixed in pixels, canvas content, content rendered outside the
children, and cross-origin frames cannot be resized by the component. The
other effects are scoped to the wrapped content. Reading aids follow the
pointer or keyboard focus; the mask and line are mutually exclusive. Three
levels cycle back to off; binary options toggle. On exceptionally short
viewports the panel can scroll to keep its controls reachable.
Reduced motion stops CSS transitions and animations, but does not stop video
or JavaScript-driven animation; handle those in the host application.

The component provides assistive controls; it does not by itself guarantee
WCAG compliance. Test the host application's content, keyboard navigation,
contrast and layouts at enlarged text and browser zoom.
