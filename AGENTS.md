# Project Agent Guidelines

## Product UI Workflow

- Treat [PRODUCT.md](PRODUCT.md) and explicit user requirements as product truth. Do not invent a product name, customer proof, performance claims, or publishing integrations.
- Use `/ui-ux-pro-max` for UI discovery: identify the user's task and surface mode, then search for a relevant layout, UX flow, palette, and stack guidance. Prefer focused domain searches for specific concerns. Verify each result fits this product; retry once when it is off-topic, and treat recommendations as guidance rather than requirements.
- Use Impeccable to establish or preserve the surface direction, translate the approved direction into semantic design tokens and components, implement the interface, and finish with responsive, accessibility, interaction, and visual checks. Do not copy a recommendation into the UI without reconciling it with the brief.
- For a new surface, keep the responsibilities distinct: UI UX Pro Max informs layout, user flow, and color strategy; Impeccable owns the direction decision, token application, implementation quality, and design-system documentation.
- Precedence is: explicit user requirements, `PRODUCT.md`, the approved surface direction, then skill recommendations. The confirmed warm cream/off-white palette, purple/violet accents, and React + Tailwind stack must be preserved.

## Implementation

- Use semantic color and spacing tokens rather than one-off values. Keep the existing token system authoritative; extend it when necessary instead of creating parallel tokens.
- Keep React interactions functional, form labels explicit, keyboard focus visible, status changes accessible, and motion respectful of `prefers-reduced-motion`.
- Verify the built page at desktop and mobile sizes, exercise its primary workflow and empty/loading/error states, and run the project's available checks before handoff.
