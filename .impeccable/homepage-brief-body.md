# Homepage Dashboard

Surface scope: responsive web workspace homepage for signed-in content creators.

Mode: Operate.

Audience and task: a creator enters a keyword, starts the AI article workflow, checks its current stage, and returns to recent drafts or published posts. The primary action is "Tạo bài viết bằng AI". The first screen must make the composer, one processing task at 60%, and three recent articles immediately scannable.

Constraints: preserve React + Tailwind, Vietnamese interface copy, all current component behavior, and clear demo labeling. The user has replaced the earlier dark mode with a cream/warm off-white ground and purple/violet accents. The product name and publishing destination remain undecided; do not imply real integrations or completed backend behavior.

## Direction contract

THESIS: A warm, focused content workspace makes the path from keyword to article feel inviting without hiding the Agent's live work. It refuses generic metric tiles that compete with the creation task.

OWN-WORLD: Modern Warm Soft UI Evolution. Use a cream paper ground (#F6F1E8), warm white working surfaces (#FFFCF6), deep plum ink (#372C3F), and restrained violet action color (#704A91) with pale lavender active surfaces (#EEE7F5). Public Sans carries UI and article titles. Use 10-12px radii, fine warm borders, and offset low-contrast shadows; avoid embossed controls, gradients, or decorative blur. The signature move remains the four-stage Agent route, with the active waypoint in violet and completed, queued, and error states distinguished semantically; navigation and controls remain standard web patterns.

STORY: Enter a keyword, start generation, understand what the Agent is doing and what happens next, then scan or resume a recent article. The page must show visible submit feedback and retain failed or cancelled work with a recovery path.

FIRST VIEWPORT: At 1440px, a warm-tinted 220px left navigation rail anchors a light utility header. In the main canvas, the labeled keyword composer and violet primary action lead in the left column; the 60%-complete four-stage Agent route sits to its right on a softly raised warm-white surface. Below, three recent articles remain aligned rows with cover art, title, status, and update time. On mobile, navigation becomes a compact top control and the composer, Agent state, and article rows stack in that order.

FORM: Open Publishing Grid structure with the user's explicitly pinned Modern Warm Soft UI Evolution visual world; preserve the working dashboard shell while replacing the dark graphite material system. Origin seed: seed:05a0eff54cfc1d40.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
