# Typography update, 22 September 2026

Display typography was restored to the original locally hosted Barlow Condensed Bold at the user's request. Original responsive sizes and spacing are restored; body copy remains DM. The earlier Syne experiment is no longer applied.

Following the refined brief, the window treatment is limited to MOVIMENTO, IDENTIDADE and FLUXO. Other headings, including vertical section names, remain solid. White 1px contours (1.25px on desktop) preserve the letter silhouette.

titles.js masks a synchronous copy of the actual WebGL frame, aligned to the background's viewport coordinates. It does not simulate an unrelated gradient or create additional WebGL contexts. Text remains semantic and selectable; canvas is decorative. Reduced motion, missing WebGL and context loss keep solid text. Masks are rebuilt on font readiness and resize, not on every frame. Only visible words are composited.

Verification: Chrome at 360, 390, 768 and 1440px; no horizontal overflow, portfolio dialog and navigation, WhatsApp form and passive touch response. Dedicated checks confirmed animated masked pixels, white outlines and reduced-motion/context-loss fallback. Screenshots in ignored qa directory. These are emulated viewport checks, not physical iPhone testing.
