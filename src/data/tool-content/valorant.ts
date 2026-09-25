import { compactToolContent as c, defineToolContent } from './types';
const patch = {
  label: 'Riot Games — crosshair import and export',
  url: 'https://playvalorant.com/en-gb/news/game-updates/valorant-patch-notes-4-05/',
};
const custom = {
  label: 'Riot Games — custom colors and independent line lengths',
  url: 'https://playvalorant.com/en-gb/news/game-updates/valorant-patch-notes-5-04/',
};
const tokens = {
  label: 'Community primary-profile token reference',
  url: 'https://github.com/genesy/crosshair-codes/blob/main/src/codegenerator.ts',
};
const aim = {
  label: 'Aimlabs mouse sensitivity converter',
  url: 'https://aimlabs.com/mouse-sensitivity-converter',
};
export const valorantToolContent = defineToolContent({
  'valorant/crosshair': c({
    name: 'VALORANT Crosshair Generator',
    reviewed: '2026-09-25',
    methodSummary: 'Draws a primary crosshair from line and dot settings and serializes supported values into a version 0 primary-profile code.',
    intro: 'Create a VALORANT crosshair while seeing how its center gap, line thickness and color work together. The editor provides primary-profile import, a code export and a shareable URL. It runs in the browser and never interacts with the game client.',
    useCases: ['Build a compact aiming marker', 'Compare contrast on light and dark surfaces', 'Transfer a supported primary profile through a code'],
    steps: ['Choose a color and preview background.', 'Adjust inner lines, outer lines, outlines and the center dot.', 'Copy the code and import it through the Crosshair Profile controls in VALORANT.'],
    mechanics: 'The preview places four rectangular arms around a central offset and adds a square dot when enabled. Vertical length can be separated from horizontal length. The exported semicolon-delimited code stores primary settings under P; line prefixes 0 and 1 identify inner and outer lines. Import validates numeric ranges and rejects unsupported profile sections rather than losing them.',
    example: 'A cyan classic profile uses four-pixel inner arms, two-pixel thickness and a two-pixel center offset, with outer lines disabled. Increasing offset from two to four opens the center without changing arm thickness or color.',
    result: 'Test the copied profile in the practice range at your actual resolution. The browser preview is enlarged up to three times for inspection, so it should not be compared pixel-for-pixel with a screenshot of gameplay. Use Share profile to retain a complete supported setup in the URL.',
    limits: 'ADS and sniper sections are not supported by this primary editor. Movement and firing flags are exported, but weapon-dependent expansion is not simulated. Code round trips are tested locally; no automated in-game import test is performed.',
    sources: [patch, custom, tokens],
    faqs: [
      {
        question: 'Can the VALORANT crosshair editor import every profile code?',
        answer: 'It accepts the supported version 0 primary profile and the default code 0. ADS, sniper, global and unknown fields produce a clear error instead of being silently removed.',
      },
      {
        question: 'Why is the VALORANT crosshair preview larger than my game crosshair?',
        answer: 'It is enlarged up to three times so small thickness and offset changes are visible. Confirm the final appearance at your game resolution.',
      },
      {
        question: 'Does the VALORANT crosshair editor simulate firing error?',
        answer: 'No. It stores the movement and firing flags and multipliers, while the preview remains a static marker.',
      },
    ],
  }),
  'valorant/crosshair-codes': c({
    name: 'VALORANT Crosshair Codes',
    reviewed: '2026-09-25',
    methodSummary: 'Filters six original practice profiles by shape, color, outline and dot properties, then exposes their primary-profile codes.',
    intro: 'Browse VALORANT crosshair codes with a visible preview before copying them. These are GamesCalculators practice profiles, with no professional-player attribution. The gallery gives each profile a purpose and links directly to its editable version.',
    useCases: ['Compare dot and classic profiles', 'Find an outlined marker for brighter backgrounds', 'Copy a starting profile before making small changes'],
    steps: ['Choose a style or leave all styles visible.', 'Narrow the list using color, outline and center-dot filters.', 'Copy the selected code or open that profile in the editor.'],
    mechanics: 'Each card reads from a local settings record. Preview and code use the same record, which prevents a thumbnail from accidentally describing a different configuration. Filters combine with AND logic, so a Dot choice plus an incompatible color can leave no matching cards.',
    example: 'Selecting Dot and green leaves the Green dot profile. Its two-pixel dot has both line layers disabled. Selecting an additional incompatible outline preference removes that card until the filter is broadened.',
    result: 'Treat the gallery as a set of starting points. A small marker can reduce obstruction, while an outline can improve separation from the map. After importing, test target visibility rather than choosing a profile simply because it looks decorative in a large preview.',
    limits: 'The collection is intentionally limited to six original profiles. The Circle category contains a pixel hollow-box approximation, not a smooth circle. Profiles have not been associated with esports players or their current tournament settings.',
    sources: [patch, tokens],
    faqs: [
      {
        question: 'Are these VALORANT crosshair codes used by professional players?',
        answer: 'No player association is claimed. All six are original practice presets designed to demonstrate different shapes and contrast choices.',
      },
      {
        question: 'Why does the VALORANT crosshair codes gallery return no matches?',
        answer: 'Every selected filter must match the same profile. Reset filters or relax the color and style combination to see more cards.',
      },
      {
        question: 'Can I edit a VALORANT crosshair code from a gallery card?',
        answer: 'Yes. Edit profile opens the crosshair editor with that card’s supported settings encoded in the URL.',
      },
    ],
  }),
  'valorant/best-crosshairs': c({
    name: 'Best VALORANT Crosshairs',
    reviewed: '2026-09-25',
    methodSummary: 'Matches your preferred marker size, visibility goal and color against explicit properties of original local profiles.',
    intro: 'The best VALORANT crosshair depends on what you can see clearly while aiming. This finder narrows original profiles according to your priorities: precision, visibility or minimal obstruction. It does not score your performance or claim that one configuration improves every player.',
    useCases: ['Choose a less obstructive marker', 'Find a more visible outlined profile', 'Compare a medium cross with a minimal dot'],
    steps: ['Start with the visual priority that matters most.', 'Select a preferred style and color if those are important.', 'Preview a matching result, copy it and test it in a controlled practice session.'],
    mechanics: 'Recommendations are a transparent filter over profile properties, not an aim assessment. A profile tagged Visibility appears only when it also matches the other selected conditions. The result set can be empty; the finder never relabels an unrelated preset to force a recommendation.',
    example: 'Choosing Visibility and Medium returns the white outlined profile. Changing the style to Large finds the red large profile instead. Those results describe different visibility options, not a numerical ranking of aiming skill.',
    result: 'Keep sensitivity and practice conditions steady while comparing two markers. Notice whether the center obscures distant targets, whether the color blends into scenery, and whether an outline remains useful during movement. Edit the chosen starting point rather than collecting many unrelated codes.',
    limits: 'Preference labels are editorial descriptions of shape and contrast. They are not measurements of accuracy, reaction time or win rate. Browser rendering is enlarged and cannot reproduce every monitor, resolution or game background.',
    sources: [custom, patch],
    faqs: [
      {
        question: 'Is there one best VALORANT crosshair for all players?',
        answer: 'No. The finder offers profiles matching your stated visual preferences, and you should evaluate their readability in your own game setup.',
      },
      {
        question: 'How does the best VALORANT crosshair finder rank recommendations?',
        answer: 'It filters by explicit preference tags instead of assigning an unexplained score. Matching cards are alternatives to test, not a performance leaderboard.',
      },
      {
        question: 'Should I choose a dot for the best VALORANT precision?',
        answer: 'A dot uses little space but can hide a small target at the center. Compare it with a short open-center cross before deciding.',
      },
    ],
  }),
  'valorant/crosshair-settings': c({
    name: 'VALORANT Crosshair Settings',
    reviewed: '2026-09-25',
    methodSummary: 'Pairs a live primary-profile editor with explanations of line geometry, opacity, outlines and saved movement or firing flags.',
    intro: 'VALORANT crosshair settings control several separate visual layers. The center dot marks the exact middle; inner and outer lines frame it; outlines add dark edges. Use the editor to see which control changes the marker before transferring a primary code to the game.',
    useCases: ['Understand line offset versus length', 'Inspect independent horizontal and vertical arms', 'Compare outline opacity with line opacity'],
    steps: ['Open one settings group at a time.', 'Change the control while watching the center and arm edges.', 'Restore the example or copy the resulting primary-profile code when the geometry is clear.'],
    mechanics: 'Length extends an arm away from the center, thickness changes its width, and offset changes the gap before the arm begins. Each line layer has its own opacity. Independent vertical length is applied only when its separate-length switch is enabled. A dark outline is drawn around visible rectangles.',
    example: 'With inner length four, thickness two and offset two, increasing length to six extends the tips by two pixels without closing the center. Increasing thickness to four makes the arms wider instead. These two edits can look similar at a glance but change different dimensions.',
    result: 'Use line groups to understand your imported settings before editing them. Disabling outer lines simplifies the marker without affecting inner geometry. Lowering opacity changes contrast rather than shape; test it against both light and dark preview backgrounds.',
    limits: 'The static browser image does not model a weapon’s firing state or movement spread. Primary settings are covered; advanced ADS and sniper profiles need the in-game menu. The enlarged rendering is explanatory rather than a screenshot of the VALORANT engine.',
    sources: [custom, tokens],
    faqs: [
      {
        question: 'What is the difference between VALORANT crosshair length and offset?',
        answer: 'Length controls the size of each arm, while offset determines how far the arm begins from the center.',
      },
      {
        question: 'Can VALORANT crosshair horizontal and vertical lengths differ?',
        answer: 'Yes. Enable separate vertical length in the line group, then adjust its vertical value independently.',
      },
      {
        question: 'Why do VALORANT crosshair outlines remain visible with pale colors?',
        answer: 'The dark outline adds an edge around the colored geometry, which can help the marker separate from bright backgrounds.',
      },
    ],
  }),
  'valorant/sens-converter': c({
    name: 'VALORANT Sens Converter',
    reviewed: '2026-09-25',
    methodSummary: 'Preserves hipfire degrees per mouse count using source sensitivity × source yaw ÷ target yaw, with physical turn distance from DPI.',
    intro: 'The VALORANT sens converter translates PC mouse hipfire sensitivity between VALORANT, Counter-Strike 2, Apex Legends, Fortnite, Overwatch 2 and the native Aimlabs profile. It keeps the physical mouse distance for a full turn consistent under the selected conversion constants.',
    useCases: ['Move a VALORANT setup to CS2', 'Compare Apex and VALORANT full-turn mouse travel', 'Check the physical meaning of a converted sensitivity'],
    steps: ['Choose the source game and enter its displayed sensitivity.', 'Enter the mouse DPI you will keep for both games.', 'Choose the target and copy the converted value, checking any percentage-unit note.'],
    mechanics: 'Converted sensitivity is source sensitivity × source yaw ÷ destination yaw. Turn distance in centimeters is 360 × 2.54 ÷ (DPI × sensitivity × yaw). Yaw is a game-specific angular scale, not a universal sensitivity unit. The local table labels these as community-derived hipfire constants.',
    example: 'At 800 DPI, VALORANT sensitivity 0.35 produces 280 eDPI. Using yaw 0.07 and CS2 yaw 0.022 gives CS2 sensitivity 1.113636 and approximately 46.65 cm per full turn. Swapping games uses the converted value, returning to the original setup within floating-point precision.',
    result: 'Copy the target number into its base mouse sensitivity field and confirm a measured full turn in a practice area. Fortnite uses the displayed percentage in this tool, so five percent is entered as 5. Aimlabs players using its VALORANT profile should use their VALORANT setting directly.',
    limits: 'The conversion assumes unchanged DPI and standard PC hipfire yaw. It does not preserve screen-space motion across different fields of view, scope behavior, mouse acceleration or console controller curves. Rounded game sliders can introduce a small difference.',
    sources: [aim],
    faqs: [
      {
        question: 'Does the VALORANT sens converter support CS:GO values?',
        answer: 'The CS2 / CS:GO option uses the standard 0.022 Source yaw. A customized yaw setting requires a separate measured conversion.',
      },
      {
        question: 'Should Fortnite sensitivity be entered as 5 or 0.05?',
        answer: 'Use 5 for the displayed 5% mouse sensitivity. The Fortnite constant is expressed per percentage point.',
      },
      {
        question: 'Why can converted VALORANT sensitivity still feel different?',
        answer: 'Matching cm/360 preserves physical turn distance, but field of view, zoom and screen-space motion can still change the visual feel.',
      },
    ],
  }),
  'valorant/edpi-calculator': c({
    name: 'VALORANT eDPI Calculator',
    reviewed: '2026-09-25',
    methodSummary: 'Multiplies mouse DPI by VALORANT sensitivity and divides a target eDPI by preset DPI values to show equivalent settings.',
    intro: 'The VALORANT eDPI calculator combines mouse DPI and in-game sensitivity into one comparable number. It also works backward from a target eDPI, so changing the hardware DPI preset does not require guessing a new sensitivity. Comparisons are meaningful within the same game scale.',
    useCases: ['Compare two VALORANT mouse setups', 'Keep effective sensitivity when changing DPI', 'Find the sensitivity needed for a chosen eDPI target'],
    steps: ['Enter the active mouse DPI setting.', 'Enter the VALORANT base sensitivity.', 'Set a target eDPI and read the required sensitivity or the preset table.'],
    mechanics: 'eDPI = mouse DPI × in-game sensitivity. The reverse calculation is target eDPI ÷ DPI. A preset row holds target eDPI constant while changing DPI, isolating the arithmetic effect of the hardware setting. The accompanying hipfire cm/360 uses VALORANT’s reviewed 0.07 yaw reference.',
    example: 'An 800 DPI mouse at sensitivity 0.35 gives 280 eDPI. To retain 280 eDPI at 1600 DPI, use sensitivity 0.175. At 400 DPI the corresponding setting is 0.7; all three produce the same base turn-distance calculation.',
    result: 'Record both DPI and sensitivity when sharing a setup, since eDPI alone does not tell another player which field to change. Use the target table when moving between mouse presets, then check that the intended profile is active on the device.',
    limits: 'Equal eDPI values in unrelated games are not necessarily equivalent because angular scales differ. Scope multipliers, input acceleration, display resolution and perceived aiming comfort are outside the basic product. The calculator does not prescribe an optimal eDPI.',
    sources: [aim],
    faqs: [
      {
        question: 'What is 800 DPI and 0.35 sensitivity in VALORANT eDPI?',
        answer: 'The product is 280 eDPI. At 1600 DPI, a sensitivity of 0.175 preserves that same value.',
      },
      {
        question: 'Does lower VALORANT eDPI guarantee better aim?',
        answer: 'No. It increases the mouse distance needed to turn, but aiming comfort and performance depend on the player and available mouse space.',
      },
      {
        question: 'Can I share my VALORANT eDPI calculation?',
        answer: 'The Share button copies a URL containing DPI, sensitivity and target eDPI so the inputs can be restored on another visit.',
      },
    ],
  }),
  'valorant/scoped-sensitivity-calculator': c({
    name: 'VALORANT Scoped Sensitivity Calculator',
    reviewed: '2026-09-25',
    methodSummary: 'Shows base eDPI and the arithmetic product of base sensitivity with an entered scope or ADS multiplier, without claiming zoom-distance equivalence.',
    intro: 'The VALORANT scoped sensitivity calculator helps inspect the settings you have entered for a scope or ADS multiplier. Its main output is a settings product. It deliberately leaves scoped turn distance unestimated because zoom behavior requires more than multiplying the base setting.',
    useCases: ['Compare two scope multiplier entries', 'Record hipfire eDPI alongside a zoom setting', 'Understand how a multiplier scales the base sensitivity number'],
    steps: ['Enter mouse DPI and the base VALORANT sensitivity.', 'Copy the scope or ADS multiplier from the setting you are comparing.', 'Read the product as configuration arithmetic and test the actual zoom in the practice range.'],
    mechanics: 'Hipfire eDPI equals DPI × base sensitivity. The scoped setting product equals base sensitivity × multiplier. A relative multiplier of one leaves that product unchanged, but it does not establish identical screen-space motion or full-turn distance when the weapon changes field of view.',
    example: 'With 800 DPI, base sensitivity 0.35 and multiplier 0.8, hipfire eDPI is 280 and the setting product is 0.28. Raising the multiplier to one returns a product of 0.35; the page does not label either number as a measured scoped cm/360.',
    result: 'Use the output to check which setting changed when a scope feels too fast or slow. Keep weapon, zoom level and test target consistent during comparison. The displayed hipfire distance remains a base reference and should not be used as a scoped distance.',
    limits: 'The tool does not apply a weapon-specific zoom formula, monitor-distance matching or field-of-view compensation. Different scope and ADS options must be tested individually. A numerical multiplier comparison cannot determine which setting a player will prefer.',
    sources: [aim],
    faqs: [
      {
        question: 'Is the VALORANT scoped result a true scoped cm/360 value?',
        answer: 'No. It is the base sensitivity multiplied by the entered scope setting. The displayed cm/360 is explicitly hipfire only.',
      },
      {
        question: 'Does a VALORANT scope multiplier of one preserve screen motion?',
        answer: 'Not necessarily. Zoom changes field of view, so equal setting products do not establish equal apparent movement across the screen.',
      },
      {
        question: 'Can the VALORANT scoped tool compare ADS and sniper settings?',
        answer: 'You can enter each multiplier separately, but the arithmetic does not model weapon-specific zoom mechanics.',
      },
    ],
  }),
  'valorant/rank-progress-calculator': c({
    name: 'VALORANT Rank Progress Calculator',
    reviewed: '2026-09-25',
    methodSummary: 'Estimates a linear RR gap across Iron–Ascendant tiers and divides it by expected net RR from your win rate and average awards.',
    intro: 'The VALORANT rank progress calculator estimates the match volume implied by a chosen win rate and average RR changes. It covers the ordinary Iron through Ascendant tier ladder. It does not predict opponents, hidden MMR or the result of the next match.',
    useCases: ['Translate an RR goal into a rough match budget', 'Find whether an assumed win rate produces positive progress', 'Compare an all-win scenario with an average-rate estimate'],
    steps: ['Choose the current and target tier, then enter current RR.', 'Use realistic average RR gains and losses from recent matches.', 'Enter the expected win percentage and inspect the net RR before trusting a game-count estimate.'],
    mechanics: 'The linear gap is max(0, 100 × tier difference − current RR). Expected net RR per match is win probability × average gain − loss probability × average loss. For positive net progress, estimated games is the ceiling of gap ÷ net RR. Zero or negative net progress has no finite expected climb in this model.',
    example: 'Gold 1 at 40 RR to Gold 2 has a linear gap of 60 RR. With +20 for wins, −18 for losses and a 55% win rate, net progress is 2.9 RR per game. The estimate rounds 60 ÷ 2.9 up to 21 games; three consecutive wins is the all-win comparison.',
    result: 'Review the assumptions before using the match count to plan a session. If the estimate is very long, small changes in average RR or win rate have large effects. A losing streak has no guaranteed finite recovery time, so the all-win scenario is not a promise.',
    limits: 'Promotion cushions, demotion protection, double promotions, penalties, draws and changing MMR are excluded. Immortal and Radiant use additional regional or leaderboard rules and are not available as targets. Fractional expected progress is planning arithmetic, not a Riot forecast.',
    sources: [
      {
        label: 'Riot — Rank Rating for Iron through Ascendant',
        url: 'https://support-valorant.riotgames.com/hc/en-us/articles/4404096596371-Rank-Rating-RR-for-Iron-through-Ascendant-Ranks',
      },
    ],
    faqs: [
      {
        question: 'Why does the VALORANT RR calculator show no positive climb?',
        answer: 'The entered win rate and average awards produce zero or negative expected net RR per game, so dividing the gap cannot give a finite positive estimate.',
      },
      {
        question: 'Can the VALORANT rank calculator predict Radiant promotion?',
        answer: 'No. Radiant depends on regional RR requirements and leaderboard placement, which are outside the linear Iron–Ascendant model.',
      },
      {
        question: 'Why can my actual VALORANT promotion happen sooner?',
        answer: 'Real progression includes mechanics such as promotion cushions and changing RR awards. The displayed estimate uses a simplified fixed-average gap.',
      },
    ],
  }),
});
