# Portfolio motion

Two rows contain four original works each and one visual duplicate group. CSS transforms translate each track by precisely half its width over 48 seconds; the second track runs in reverse. Equal trailing gaps make the repeat seamless. Existing native gallery HTML remains available without JavaScript.

Every image opens the existing eight-work lightbox, including duplicate images. Duplicate links are excluded from keyboard and accessibility traversal. Keyboard focus switches that row to native horizontal scrolling; reduced motion disables animation and hides duplicates. A persistent pause control, desktop hover, active pointer interaction, open lightbox, offscreen state and hidden document pause animation.

No animation dependencies added. Motion skill guidance informed transform-only animation and reduced-motion behavior. Tested at 360, 390, 768, 1440 and 2560 pixels for opposite directions, group coverage, document overflow, pause, duplicate-image activation, keyboard focus and reduced motion. Screenshots are in qa/carousel-*.png.
