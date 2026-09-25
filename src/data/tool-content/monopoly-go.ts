import { compactToolContent as c, defineToolContent } from './types';
import { monopolySources as s } from '../monopoly-go/topics';
export const monopolyGoToolContent = defineToolContent({
  'monopoly-go/events': c({
    name: 'MONOPOLY GO Events',
    reviewed: '2026-09-25',
    methodSummary: 'A source-dated schedule compares confirmed UTC start and end times with the device clock. Ended entries remain explicitly archived.',
    intro: 'MONOPOLY GO events can overlap, but their points, currencies and deadlines are separate. This schedule shows only events with documented timing. An empty active section means this snapshot has no confirmed current entry; it does not mean nothing is happening in the game.',
    useCases: ['Check whether a recorded event has ended', 'Translate UTC event times into your local timezone', 'Separate historical rewards from available offers'],
    steps: ['Read the event status before examining rewards.', 'Use the displayed local start and finish times to plan your session.', 'Open the source announcement to verify participation requirements.'],
    mechanics: 'An event is LIVE when start ≤ device time < end. A future start less than 24 hours away receives STARTING SOON; later starts are UPCOMING. At the exact ending instant the event becomes ENDED. Timezone conversion changes the label, not the underlying deadline.',
    example: 'Paws in the Park ran from March 13, 2026 at 11:00 UTC to March 20 at 18:00 UTC. A visit after March 20 at 18:00 UTC therefore shows ENDED, even if the browser is in a timezone where the calendar date differs.',
    result: 'Use the archive to understand the difference between community milestones and personal tournament rewards. A community reward cap is not an automatic reward for every account: the source can require signup and participation.',
    limits: 'Schedules are static snapshots and may lag new announcements. This collection is not a complete tournament calendar. Device-clock errors can affect status display, and reward delivery can happen after an event closes.',
    sources: [
      {
        label: 'Official Paws in the Park announcement',
        url: 'https://www.monopolygo.com/news/155/paws-in-the-park-trade-play-repeat',
      },
    ],
    faqs: [
      {
        question: 'Why does the MONOPOLY GO schedule show an archived event?',
        answer: 'Confirmed past records remain labeled ENDED so their dates and participation conditions are not mistaken for new offers.',
      },
      {
        question: 'Are MONOPOLY GO event times shown in my timezone?',
        answer: 'After the page loads, the browser formats the stored UTC instants using your device timezone. The underlying start and finish stay unchanged.',
      },
      {
        question: 'Does an empty MONOPOLY GO schedule mean no events are running?',
        answer: 'No. It means the local dataset has no confirmed active entry. Newly announced or account-specific events may still appear inside the game.',
      },
    ],
  }),
  'monopoly-go/golden-blitz': c({
    name: 'MONOPOLY GO Golden Blitz',
    reviewed: '2026-09-25',
    methodSummary: 'Reports confirmed Gold Sticker trading windows separately from general sticker exchanges, without predicting unannounced dates.',
    intro: 'MONOPOLY GO Golden Blitz temporarily unlocks trading for selected Gold Stickers. Owning a duplicate gold does not make it eligible for every Blitz. This reference helps you check the selected sticker pair and prepare an exchange when a confirmed announcement becomes available.',
    useCases: ['Distinguish event-eligible Gold Stickers from locked ones', 'Prepare a duplicate for an agreed exchange', 'Check whether an announced trading window is actually confirmed'],
    steps: ['Read the current confirmation status.', 'Match the announced sticker names against your album.', 'Review the return sticker in the in-game exchange before approving it.'],
    mechanics: 'Ordinary sticker trading and Golden Blitz eligibility are different rules. The publisher describes a Blitz as an opportunity to exchange two preselected Gold Stickers. A different gold from the same album is not automatically included. Community voting can influence selected Blitz pairs but does not itself establish a start time.',
    example: 'Suppose your album contains three copies of one selected Gold Sticker and one copy of the other. You have two extras of the first sticker, but owning a single copy of the second does not give you a duplicate to send. Recheck the actual event names before arranging a swap.',
    result: 'Treat the status panel as a confirmation check. If no upcoming window is confirmed, keep useful duplicates and follow the official announcements. The site does not name an invented next pair or display a countdown to a speculative date.',
    limits: 'No current Blitz or recent verified history was available in this review. Album changes can make older sticker pairs irrelevant. Availability and exchange limits must be read from the live event interface.',
    sources: [s.trading],
    faqs: [
      {
        question: 'Can any MONOPOLY GO Gold Sticker be traded during Golden Blitz?',
        answer: 'No. Eligibility is limited to the Gold Stickers selected for that particular Blitz.',
      },
      {
        question: 'Why is there no next MONOPOLY GO Golden Blitz date here?',
        answer: 'A confirmed source has not established an upcoming window in this snapshot. A speculative date would give an unreliable deadline.',
      },
      {
        question: 'Does voting confirm a MONOPOLY GO Golden Blitz schedule?',
        answer: 'A vote can help select stickers, but a schedule still needs a separate announcement with the event timing.',
      },
    ],
  }),
  'monopoly-go/tycoon-club': c({
    name: 'MONOPOLY GO Tycoon Club',
    reviewed: '2026-09-25',
    methodSummary: 'A local checklist records your own Daily Wheel and shop-gift collection times and shows a 24-hour reminder from each mark.',
    intro: 'The MONOPOLY GO Tycoon Club checklist keeps two recurring checks together: the Daily Wheel and the shop gift. Collection happens on the official publisher website. GamesCalculators only remembers the time you mark each activity as completed in this browser.',
    useCases: ['Remember whether you checked both Tycoon Club rewards', 'Record separate collection times for the wheel and gift', 'Find the official website from a clear outbound link'],
    steps: ['Open the official Tycoon Club website.', 'Collect any reward your account is eligible to receive.', 'Return here and mark the matching checklist card; clear a mistaken mark to restore it.'],
    mechanics: 'Each checkmark stores a timestamp under a local browser key. The reminder is max(0, recorded time + 24 hours − current time). It does not request an account token, inspect your reward balance, or synchronize with the publisher. The wheel and gift have independent entries.',
    example: 'If you mark the shop gift at 09:00 and the wheel at 11:00, their reminders reach zero at 09:00 and 11:00 the following day. That difference helps avoid assuming both rewards were collected at the same moment.',
    result: 'Use a remaining-hours label as a personal reminder to revisit the official page. If the game timer disagrees, follow the official timer. A checkmark confirms only your own note; it does not confirm successful delivery to the game.',
    limits: 'Clearing browser data removes these timestamps. Other devices have separate checklists. Reward availability and account eligibility are controlled by the publisher, and a missed checkmark cannot be reconstructed automatically.',
    sources: [s.club, s.partners],
    faqs: [
      {
        question: 'Where do I collect MONOPOLY GO Tycoon Club rewards?',
        answer: 'Use the official monopolygo.com website. The buttons on this page store a checklist entry and do not collect the actual reward.',
      },
      {
        question: 'Does the MONOPOLY GO Tycoon Club reminder read my account?',
        answer: 'No. It counts 24 hours from your manual checkmark and has no connection to your account or official reward timer.',
      },
      {
        question: 'Can I undo a MONOPOLY GO Tycoon Club checkmark?',
        answer: 'Yes. Clear the individual checkmark to remove that collection timestamp without affecting the other reward card.',
      },
    ],
  }),
  'monopoly-go/wiki': c({
    name: 'MONOPOLY GO Wiki',
    reviewed: '2026-09-25',
    methodSummary: 'Searches a concise local glossary of supported board, sticker, reward and event topics, with direct links to the relevant utilities.',
    intro: 'This MONOPOLY GO wiki is a practical topic finder for the systems covered by GamesCalculators. Search for a term such as stars, Partners or Golden Blitz to find the relevant explanation and tool. It is an independent reference, with publisher sources attached to the underlying mechanics.',
    useCases: ['Find the difference between Partner points and currency', 'Locate the sticker-star planning tool', 'Understand the role of timed trading events'],
    steps: ['Type a mechanic or resource into the topic search.', 'Read the matching definition and its context.', 'Follow the topic link for the associated calculator or detailed reference.'],
    mechanics: 'Search matches the topic name and explanation without requiring exact capitalization. The initial collection covers ten supported topics rather than every board, sticker or event. Topic cards point to utilities with distinct purposes: a point planner, star shortfall calculation, reward checklist or event reference.',
    example: 'Searching “currency” surfaces Partners because its explanation separates wheel currency from attraction points. Follow that result before entering a progress total: 1,000 currency is not the same input as 1,000 attraction points.',
    result: 'The topic finder is most useful when the same screen contains several resources. Identify which quantity you have, then open the linked utility. Definitions provide orientation; dated announcements remain the authority for limited-time rewards and deadlines.',
    limits: 'The glossary does not claim complete album or board coverage. Individual offers and tournament rewards can vary, and references to a reward mechanism do not establish that a particular event is active now.',
    sources: [s.partners, s.trading, s.club],
    faqs: [
      {
        question: 'Does the MONOPOLY GO wiki list every sticker album?',
        answer: 'No. This first collection concentrates on supported mechanics and utility links. Seasonal sticker lists require their own complete, dated datasets.',
      },
      {
        question: 'Can I search MONOPOLY GO wiki descriptions as well as titles?',
        answer: 'Yes. The filter checks both the topic name and explanation, so a resource name can find a topic with a different heading.',
      },
      {
        question: 'Is the MONOPOLY GO wiki an official Scopely website?',
        answer: 'No. GamesCalculators writes independent explanations and links to the publisher sources used for the reviewed mechanics.',
      },
    ],
  }),
  'monopoly-go/sticker-safe-calculator': c({
    name: 'MONOPOLY GO Sticker Safe Calculator',
    reviewed: '2026-09-25',
    methodSummary: 'Subtracts the displayed star balance from an entered safe cost and divides the remaining stars by your estimated daily earnings.',
    intro: 'The MONOPOLY GO Sticker Safe Calculator answers how many more stars you need for the safe you are considering. Enter the star balance and safe cost shown in your current album. A daily star estimate adds a planning timeline without assigning a monetary value to stickers.',
    useCases: ['Measure a star shortfall before exchanging duplicates', 'Estimate how many collection days a target needs', 'Compare safe targets displayed in your current album'],
    steps: ['Copy your current sticker-star balance.', 'Enter the cost of the safe you actually want.', 'Add a realistic daily star rate and read the rounded-up number of days.'],
    mechanics: 'Stars remaining equals max(0, safe cost − current stars). Progress is current stars ÷ safe cost × 100, capped at 100%. Days required is the ceiling of remaining stars ÷ daily stars. A zero daily rate leaves the date estimate unavailable unless the target is already met.',
    example: 'For an illustrative 700-star target with 350 stars saved and 50 stars earned per day, the shortfall is 350 stars. Progress is 50%, and 350 ÷ 50 gives seven days. The entered 700-star cost is an example rather than a claim about every album.',
    result: 'Use the shortfall to decide which duplicates you can afford to spend. The timeline assumes you keep adding stars at the entered rate; it does not predict pack contents or future trading success. Raising the target should be weighed against the rewards visible in your album.',
    limits: 'Safe thresholds and rewards can change with albums. Pack randomness, duplicate availability and stars spent elsewhere all affect the daily-rate estimate. This tool does not choose stickers automatically or calculate cash prices.',
    sources: [s.help, s.trading],
    faqs: [
      {
        question: 'Why is the MONOPOLY GO safe cost editable?',
        answer: 'The cost must match the safe offered in your current album. A fixed universal threshold could become inaccurate after a seasonal change.',
      },
      {
        question: 'Why does the MONOPOLY GO Sticker Safe Calculator round days up?',
        answer: 'A remaining fraction of a day still needs another daily earning period to reach the target under the entered average rate.',
      },
      {
        question: 'What happens if my MONOPOLY GO stars already exceed the safe cost?',
        answer: 'The result shows zero stars remaining, 100% progress and zero additional days. It does not spend any stars in your game.',
      },
    ],
  }),
  'monopoly-go/partner-event': c({
    name: 'MONOPOLY GO Partner Event Planner',
    reviewed: '2026-09-25',
    methodSummary: 'Adds two attraction point contributions, calculates the shortfall to your entered target, and compares your contribution with half the target.',
    intro: 'The MONOPOLY GO Partner Event planner helps two players agree how much attraction progress remains. Enter the actual point target from your event and both contributions. The example target is editable because milestones and rewards can change between Partner events.',
    useCases: ['Check the remaining points on one attraction', 'Discuss a voluntary half-and-half contribution plan', 'Avoid confusing wheel currency with attraction progress'],
    steps: ['Read the attraction target from the event screen.', 'Enter the point contribution credited to each partner.', 'Review the attraction shortfall and the separate amount to your half share.'],
    mechanics: 'Remaining attraction points equals max(0, target − your points − partner points). Your half-share gap equals max(0, target ÷ 2 − your points). The half-share comparison is an agreement aid, not a rule imposed by the game. Wheel spins award points using event-dependent outcomes.',
    example: 'With an example target of 80,000 points, your 25,000 and a partner contribution of 30,000 total 55,000. The attraction needs 25,000 more points. Your gap to an agreed 40,000-point half share is 15,000.',
    result: 'Share the remaining point total when coordinating the next session. If your partner plans to contribute more, the attraction can finish before you reach half. A completed attraction and an equal contribution split are separate goals.',
    limits: 'The planner does not forecast wheel results, required dice or Partner Currency. No current Partner event is confirmed in the local snapshot, so the example does not establish active milestones, rewards or a deadline.',
    sources: [s.partners],
    faqs: [
      {
        question: 'Does the MONOPOLY GO Partner planner predict currency needed?',
        answer: 'No. Currency buys wheel attempts, while the entered values are attraction points. Random wheel outcomes prevent a fixed conversion.',
      },
      {
        question: 'Must MONOPOLY GO Partners each supply exactly half?',
        answer: 'The half-share result is optional planning arithmetic. The attraction total can be reached with unequal contributions.',
      },
      {
        question: 'Is the MONOPOLY GO Partner target of 80,000 confirmed for every event?',
        answer: 'No. It is a clearly labeled example. Replace it with the actual target displayed by the attraction you are planning.',
      },
    ],
  }),
});
