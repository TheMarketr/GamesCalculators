# MONOPOLY GO, VALORANT and Coin Master implementation

Review date: September 25, 2026. This extends the existing Astro/Preact static site; no existing route is removed, redirected or marked noindex.

## Scope

Three hubs and 18 functional tool/reference routes. The site configuration now contains 16 games and 160 tools. Display counts remain configuration-derived. All new routes use the existing game hub, ToolShell, search, sitemap, canonical, structured content, FAQ and PNG social-image systems.

## Published URL and keyword map

| Path | Primary query | Secondary intent |
| --- | --- | --- |
| /monopoly-go/ | monopoly go tools | rewards, event planning |
| /monopoly-go/tycoon-club/ | monopoly go tycoon club | daily wheel, shop gift checklist |
| /monopoly-go/events/ | monopoly go events | event schedule, ended-event archive |
| /monopoly-go/golden-blitz/ | monopoly go golden blitz | selected Gold Stickers, safe exchanges |
| /monopoly-go/wiki/ | monopoly go wiki | dice, stickers, stars, Partner Currency |
| /monopoly-go/sticker-safe-calculator/ | monopoly go sticker safe calculator | stars remaining, safe progress, vault planning |
| /monopoly-go/partner-event/ | monopoly go partner event | attraction points, contribution planning |
| /valorant/ | valorant calculators | crosshairs, sensitivity tools |
| /valorant/crosshair/ | valorant crosshair | generator, preview, dot, circle approximation |
| /valorant/crosshair-codes/ | valorant crosshair codes | original profiles, copy and edit |
| /valorant/crosshair-settings/ | valorant crosshair settings | inner/outer lines, opacity, offset |
| /valorant/best-crosshairs/ | best crosshair valorant | preference matching, visibility, precision |
| /valorant/sens-converter/ | valorant sens converter | sensitivity converter, CS2/CS:GO, Apex, Overwatch, Fortnite |
| /valorant/edpi-calculator/ | valorant edpi calculator | DPI presets, target sensitivity |
| /valorant/scoped-sensitivity-calculator/ | valorant scoped sensitivity calculator | scope and ADS setting arithmetic |
| /valorant/rank-progress-calculator/ | valorant rank progress calculator | RR gap, expected games, win-rate assumptions |
| /coin-master/ | coin master calculators | official rewards, village planning |
| /coin-master/free-spins/ | coin master free spins | free coins, reward links, daily gift |
| /coin-master/reward-calendar-tracker/ | coin master reward calendar | seven-position cycle, 30-point progress |
| /coin-master/how-to-get-free-spins/ | how to get free spins in coin master | legitimate daily rewards, eligibility |
| /coin-master/village-mania-guide/ | coin master village mania | building discounts, entered-price savings |

## Functionality

- MONOPOLY GO: persistent two-item Tycoon Club checklist; source-dated event archive with device-local time; explicit Golden Blitz confirmation state; searchable ten-topic wiki; editable sticker-star planning and Partner contribution arithmetic.
- VALORANT: live primary crosshair editor, import/export/share, six original presets, preference and property filters; six-game hipfire sensitivity conversion with swap, presets and cm/360; eDPI reverse calculation; explicitly limited scope multiplier arithmetic; Iron–Ascendant RR planning.
- Coin Master: publisher-source reward feed with age/check labels, claimed/undo/hide filters and local persistence; independent daily/monthly calendar tracking; official spin-source guide; whole-village or eligible-item discount arithmetic using user-entered prices.
- Three semantic related links per tool; three original FAQs per page; specific mechanics, worked examples, decisions and limitations.
- Coin Master reward page sets `adsDisabled: true` and exposes the flag on ToolShell. Advertising components remain unrendered under the site's existing policy.

## Datasets and provenance

| File | Records | Meaning |
| --- | ---: | --- |
| src/data/monopoly-go/rewards.json | 0 | No source-traceable direct reward verified; feed route withheld |
| src/data/monopoly-go/events.json | 1 | Historical Paws in the Park community event, explicitly ended |
| src/data/monopoly-go/topics.ts | 10 | Original reference entries with official source metadata |
| src/data/valorant/sensitivity-games.ts | 6 | Aimlabs converter constants; community/specialist reference, not publisher-certified formulas |
| src/games/valorant/crosshair.ts | 6 | Original practice profiles; no esports-player attribution |
| src/data/coin-master/rewards.json | 1 | Recurring official Daily Gift entry; unknown quantity, not a fabricated spin promotion |

All data-dependent records carry source links and review/check dates. No global deployment date is substituted for editorial review. Reward `checkedAt` is a network check; `discoveredAt` remains the first recorded discovery.

### Sources actually reviewed

- [MONOPOLY GO trading](https://www.monopolygo.com/news/104/tycoon-bootcamp-benefits-of-trading)
- [Tycoon Club](https://www.monopolygo.com/news/tycoon-club-not-every-tycoon-knows-this-shortcut)
- [Partner events](https://www.monopolygo.com/news/125/tycoon-bootcamp-partners-events)
- [Historical Paws in the Park event](https://www.monopolygo.com/news/155/paws-in-the-park-trade-play-repeat)
- [MONOPOLY GO support](https://support.monopolygo.com/)
- [Riot crosshair import/export](https://playvalorant.com/en-gb/news/game-updates/valorant-patch-notes-4-05/)
- [Riot custom colors and vertical line lengths](https://playvalorant.com/en-gb/news/game-updates/valorant-patch-notes-5-04/)
- [Community crosshair token mapping](https://github.com/genesy/crosshair-codes/blob/main/src/codegenerator.ts)
- [Aimlabs converter](https://aimlabs.com/mouse-sensitivity-converter): checked the public converter implementation for VALORANT .07, CS2/CS:GO/Apex .022, Fortnite .005555 per displayed percentage, Overwatch .0066 and native Aimlabs .05.
- [Riot RR rules](https://support-valorant.riotgames.com/hc/en-us/articles/4404096596371-Rank-Rating-RR-for-Iron-through-Ascendant-Ranks)
- [Coin Master official free-reward instructions](https://support.coinmastergame.com/hc/en-us/articles/28407634992274-How-can-I-get-free-rewards)
- [Official Reward Center](https://coin-master.co/m/Reward-Center2)
- [Reward Calendar](https://support.coinmastergame.com/hc/en-us/articles/360019298160-Reward-Calendar)
- [Village Mania](https://support.coinmastergame.com/hc/en-us/articles/360019297880-What-is-Village-Mania)
- [Village building strategy](https://support.coinmastergame.com/hc/en-us/articles/29805992231058-How-can-I-strategically-best-build-my-Village)
- [Official spin methods](https://support.coinmastergame.com/hc/en-us/articles/4404737856274-How-do-I-get-Spins)

## Reward maintenance

- `pnpm data:check:monopoly-go`: checks stored approved URLs, retaining previous check dates on transient failures; marks 404/410 as retired. Hourly GitHub schedule at minute 17. No unsupported discovery source is fabricated.
- `pnpm data:sync:coin-master`: reads the public official Reward Center's data, selects its active explicitly labeled Daily Gift button, validates the HTTPS chain and documented native shop destination, deduplicates and writes local JSON. Four-hour GitHub schedule at minute 43.
- The Coin Master chain reviewed was `coin-master.co/3YojGBi` → `d10xl.com/coinmaster/CYrE5` → `coinmaster://shop_login`. Scripts inspect but never launch the app scheme.
- `scripts/add-monopoly-go-reward.mjs` and `scripts/add-coin-master-reward.mjs` accept claim URL, official source URL and label. The exact link must occur in the official source. Amounts require separate editorial evidence. Social-source support must be reviewed before expanding the strict allowlist.
- Unexpected formats, hosts, paths, loops and network failures stop ingestion. Existing records are preserved. Reachability is never labeled proof of claim eligibility.
- Scheduled changes run tests, commit only reward JSON and dispatch the existing Cloudflare deployment workflow. That deployment now runs the full `pnpm check` gate. GitHub schedules can be delayed and require repository Actions permissions; dates make missed checks visible.
- **Hosting-account limitation discovered:** GitHub run 36147112526 reports that jobs cannot start because the GitHub account is locked due to a billing issue. The workflows are implemented, but unattended refresh cannot be claimed active until that external account issue is resolved. Local maintenance commands work; publication uses the existing authorized direct Cloudflare deployment credential instead. No billing settings were changed.

## Original media

Generated with the image-generation skill, then resized to local WebP: each cluster has a 1200×675 scene and 256×256 icon in `public/images/games/{slug}/`. Existing `originalClusterMedia()` supplies source/rights metadata; media credits include the new games.

Prompt concepts: an original green mobile board with dice and reward cards; an original coral-lit tactical mouse/crosshair/grid scene; an original gold-coin wheel with miniature village buildings. No publisher logos, characters, screenshots or claims of endorsement. Original illustration assets, not gameplay evidence.

## Withheld routes — not in navigation or sitemap

| Route | Publication requirement |
| --- | --- |
| /monopoly-go/free-dice-links/ | At least one direct, publisher-source-traceable reward; no empty feed published |
| /monopoly-go/board-cost-calculator/ | Reviewed board-cost table with version/variation context |
| /monopoly-go/sticker-tracker/ | Sufficiently complete current album/set/sticker dataset |
| /valorant/rank-distribution/ | Dated, attributable and maintainable rank-distribution dataset |
| /coin-master/village-cost-calculator/ | Verified village costs; available secondary lists conflict |
| /coin-master/village-progress-calculator/ | Same verified village dataset, not invented defaults |
| /coin-master/card-set-tracker/ | Sufficiently complete card/set collection dataset |
| /coin-master/free-coins/ | Intentionally future-only; no distinct dataset/intent beyond free-spins |

No current MONOPOLY GO event, Golden Blitz pair or Partner schedule is asserted without an official confirmation. The live schedule pages state that limitation prominently, retaining useful mechanics and planning tools.

## Tests and manual QA

Regression coverage includes safe/Partner arithmetic, UTC boundaries, eDPI/conversion/swap, invalid numbers, RR expectations, crosshair parsing/serialization/all-profile round trips, unsupported sections, malicious property names, URL normalization/deduplication/age labels, local-storage corruption/failure, reward redirect chains, provenance allowlists, calendar progression, price/discount/affordability arithmetic and dataset/config metadata.

Browser QA: all 21 routes at 320px; crosshair, sensitivity, Coin Master rewards and Tycoon Club at 375px, 768px and 1440px. No horizontal page overflow or broken images. Crosshair import/copy/reset/share, conversion swap/invalid input/copy, gallery filters/reset, reward filters/claimed persistence/undo, Tycoon checklist persistence and calendar persistence verified. Global search returned Golden Blitz. No browser JavaScript errors observed during route checks.

`scripts/check-new-clusters-build.mjs` verifies 21 new routes, all 202 pre-existing index URLs, H1/title/description/canonical/PNG metadata, sitemap membership, local asset/link existence and absence of withheld pages. The separate 404 output is retained by Astro.

### Final local validation

- `pnpm check`: passed, including safety, Astro type checking, unit tests, production build, content quality and metadata checks.
- 271 tests in 32 files passed (80 new tests). Astro: zero errors, warnings or hints.
- 224 production HTML pages and 224 PNG social cards generated.
- Content checker: 160 structured/generated tool pages; zero exact/similar paragraph duplicates, repeated FAQ questions/sets, generic phrases, placeholders, thin entries or non-blocking warnings.
- All indexable meta descriptions passed the existing 130–150-character gate.
- Additional build audit passed for all 21 new routes and all 202 existing index URLs. The preserved baseline also matched all 202 URLs in the live sitemap before deployment. Every new OG image exists at 1200×630.
- Vite retains a non-blocking >500 KB warning for existing large calculator bundles. New calculator entry modules are approximately 17 KB (VALORANT), 10 KB (MONOPOLY GO) and 9 KB (Coin Master), before compression and shared runtime imports.
- Compiled production preview also passed crosshair copy/reset and new-game search smoke checks.

### Production deployment

- Implementation commit: `13b6c210718560fe967283bcc532f99773738054`, pushed to GitHub `main`.
- The exact locally checked `dist` artifact was uploaded through the existing authorized Cloudflare Pages credential; no untested rebuild was substituted.
- Cloudflare deployment: `a6b66c04.gamescalculators.pages.dev`, production custom domain `https://gamescalculators.com`.
- `node scripts/verify-new-clusters-live.mjs`: all 21 new URLs returned HTTP 200, correct canonical, one H1 and no noindex. Live sitemap now contains 223 URLs, preserving all 202 existing entries with no missing new pages.
- Live browser smoke test: changing VALORANT sensitivity to 0.5 at 800 DPI returned CS2 1.590909, 400 eDPI and 32.66 cm/360. Reset restored the default. Original VALORANT artwork loaded at its expected 1200px intrinsic width.
- GitHub's new deployment run 36153992362 failed before starting, consistent with the billing lock. Direct Cloudflare publication succeeded independently; scheduled reward refresh remains externally blocked as documented above.
- Final documentation/live-audit script commit does not change the deployed application artifact.

### Remaining verification boundaries

- Crosshair codes are unit-tested against documented token mappings, but have not been imported into a live VALORANT client. The primary editor explicitly rejects advanced/ADS/sniper sections; movement and firing are saved settings, not simulated weapon behavior.
- Scope output is labeled settings arithmetic, not verified scoped cm/360. RR output is a simplified fixed-average plan, not a Riot prediction.
- No game account was used to redeem Coin Master rewards. Reward quantity and eligibility remain unverified.
- No Lighthouse score is claimed; responsive browser checks and static/build checks are separate evidence.
