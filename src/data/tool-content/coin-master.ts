import { compactToolContent as c, defineToolContent } from './types';
const rewards = {
  label: 'Coin Master — official free reward sources',
  url: 'https://support.coinmastergame.com/hc/en-us/articles/28407634992274-How-can-I-get-free-rewards',
};
const calendar = {
  label: 'Coin Master — Reward Calendar rules',
  url: 'https://support.coinmastergame.com/hc/en-us/articles/360019298160-Reward-Calendar',
};
const mania = {
  label: 'Coin Master — Village Mania offers',
  url: 'https://support.coinmastergame.com/hc/en-us/articles/360019297880-What-is-Village-Mania',
};
export const coinMasterToolContent = defineToolContent({
  'coin-master/free-spins': c({
    name: 'Coin Master Free Spins & Coins',
    reviewed: '2026-09-25',
    methodSummary: 'Displays publisher-sourced reward entry links, records URL checks, and stores your own claimed marks locally without asserting reward quantities.',
    intro: 'Find Coin Master free spins and coins through the official reward sources collected here. The current feed includes the publisher’s recurring daily-gift entry. Its amount depends on the offer shown in the game, so this page does not attach a made-up spin or coin quantity to the link.',
    useCases: ['Open a reward entry traced to the official Reward Center', 'Remember which entries you already checked', 'Compare the added date with the last URL check'],
    steps: ['Read the reward note and source before opening the destination.', 'Collect only if the game shows an eligible offer.', 'Mark the entry as claimed here and undo that mark when revisiting a recurring reward.'],
    mechanics: 'The local feed stores a claim URL and a separate publisher source URL. A recent discovery is labeled NEW for its first 24 hours, then RECENT through three days and OLDER afterward. These are age labels. An HTTP redirect can confirm a route exists but cannot prove that an account can redeem its offer.',
    example: 'The official daily-gift entry redirects from coin-master.co through a Coin Master-specific d10xl.com path into the game shop. This establishes an official entry route, but the response does not reveal a spin amount. Its card therefore says Official Coin Master Daily Gift and explains the missing quantity.',
    result: 'Use the claimed mark as a personal reminder. A recurring shop entry may lead to another offer later, so hiding it forever could conceal a future visit. Undo the mark to return it to the visible list; clearing browser storage also removes your local history.',
    limits: 'In-game redemption was not tested and rewards may depend on account eligibility or timing. The initial feed is a recurring gift entry, not a complete list of dated spin promotions. URL checks do not refresh the original discovery date.',
    sources: [
      rewards,
      {
        label: 'Official Coin Master Reward Center',
        url: 'https://coin-master.co/m/Reward-Center2',
      },
    ],
    faqs: [
      {
        question: 'How many Coin Master free spins does the daily-gift link provide?',
        answer: 'The public source does not state a fixed quantity. Check the actual offer inside the game; the card deliberately leaves spins and coins unspecified.',
      },
      {
        question: 'Does NEW mean a Coin Master reward is guaranteed to work?',
        answer: 'No. NEW describes when the link was discovered. Only the game can determine whether that account is eligible for the current reward.',
      },
      {
        question: 'Why can I undo a Coin Master claimed mark?',
        answer: 'A mark records your local visit to the entry. Recurring official links may be useful again later, so the entry can be restored.',
      },
    ],
  }),
  'coin-master/reward-calendar-tracker': c({
    name: 'Coin Master Reward Calendar Tracker',
    reviewed: '2026-09-25',
    methodSummary: 'Keeps the seven-reward daily position separate from the 30-point calendar bar, calculating the next daily position and claims to the final milestone.',
    intro: 'The Coin Master Reward Calendar tracker records the two progress paths shown by the calendar. The seven-position daily cycle can reset after a missed day while the 30-point bar remains. Enter both values separately so a daily reset does not erase your longer-term progress note.',
    useCases: ['Record calendar progress before leaving the game', 'Calculate claims remaining to the 30-point milestone', 'Keep the daily reward position distinct from monthly progress'],
    steps: ['Enter the last daily position collected, from one to seven.', 'Copy the 30-day bar progress and your last claim date.', 'Save the calendar in this browser and reconcile it with the game on your next visit.'],
    mechanics: 'Claims remaining is 30 minus the entered bar points. Percentage is bar points divided by 30, multiplied by 100. The next daily position increments from one through seven and wraps to one. The tracker does not advance automatically because opening a webpage is not evidence that an in-game reward was collected.',
    example: 'After collecting daily position seven with 18 points on the longer bar, the next daily position is one. The bar is 60% complete and needs 12 additional claims. If the game resets the daily cycle after a missed day, retain the bar value it actually displays.',
    result: 'Use the saved date to remember when you last reconciled the numbers. The publisher describes a 24-hour reward interval; a date-only note is not an exact claim countdown. Reach the final bar milestone by counting successful claims, not simply elapsed calendar dates.',
    limits: 'The Reward Calendar is documented as available from Village 11. This tracker does not list reward quantities or infer eligibility. Browser storage can be cleared or blocked, and another device will not automatically receive your saved progress.',
    sources: [calendar],
    faqs: [
      {
        question: 'Does missing a Coin Master daily reward erase the 30-day bar?',
        answer: 'The publisher says the daily reward position resets, while the separate 30-day progress bar is preserved. Enter the values shown by your game.',
      },
      {
        question: 'When does the Coin Master Reward Calendar unlock?',
        answer: 'The reviewed official help article places access at Village 11. Check your game interface for account-specific availability.',
      },
      {
        question: 'Does saving the Coin Master calendar claim a reward?',
        answer: 'No. Save writes a local progress note. You still collect the reward inside Coin Master and update the tracker yourself.',
      },
    ],
  }),
  'coin-master/how-to-get-free-spins': c({
    name: 'How to Get Free Spins in Coin Master',
    reviewed: '2026-09-25',
    methodSummary: 'Organizes publisher-documented spin sources by where you claim them and points to the official requirements for each method.',
    intro: 'To get free spins in Coin Master, start with rewards the publisher makes available through its own channels and the game. The useful distinction is between a direct gift, a daily progression reward and an activity with eligibility requirements. Opening a link alone does not satisfy every requirement.',
    useCases: ['Locate the official Reward Center', 'Build a repeatable daily reward routine', 'Check friend-invite requirements before expecting spins'],
    steps: ['Open the source-tracked free-spins page for available official entries.', 'Check your calendar and current in-game event rewards.', 'Read the publisher’s conditions for invitations, Teams or other activities before committing time.'],
    mechanics: 'Reward links lead to publisher-controlled destinations. Daily calendar claims follow the game’s schedule, while invitations require qualifying friends and the stated completion steps. Teams and events can offer further opportunities according to their current rules. These methods do not create spins outside the publisher’s reward system.',
    example: 'A player can check the Reward Center, collect an eligible daily gift, then record a calendar claim as a separate activity. If a friend already installed the game, that friend may not qualify for a new-player invitation reward; sending the link again does not change that condition.',
    result: 'Prioritize the visible free options you already qualify for. Keep each reward source separate when checking your balance, because a gift entry, calendar claim and event milestone can have different delivery conditions. Revisit the official source if the expected reward does not appear.',
    limits: 'Spin quantities and event availability change. The guide does not promise a daily total or guarantee an invitation will qualify. Loyalty Club access is account-dependent and the reviewed publisher page describes a Village 210 requirement.',
    sources: [
      rewards,
      {
        label: 'Coin Master — How do I get Spins?',
        url: 'https://support.coinmastergame.com/hc/en-us/articles/4404737856274-How-do-I-get-Spins',
      },
    ],
    faqs: [
      {
        question: 'Where should I start looking for Coin Master free spins?',
        answer: 'Start at the official Reward Center and the game’s visible daily rewards. The linked tracker keeps reviewed publisher entries together.',
      },
      {
        question: 'Do existing Coin Master players qualify as new invited friends?',
        answer: 'Not automatically. The official invitation method has new-player and completion requirements, so check those conditions before expecting a reward.',
      },
      {
        question: 'Can Coin Master events and Teams give the same spin amount every day?',
        answer: 'No fixed daily amount is established here. Current event milestones and Team activities determine their own available rewards.',
      },
    ],
  }),
  'coin-master/village-mania-guide': c({
    name: 'Coin Master Village Mania Guide',
    reviewed: '2026-09-25',
    methodSummary: 'Applies an entered discount only to its eligible building-cost portion, leaving the rest of the village at its original price.',
    intro: 'Coin Master Village Mania can reduce building prices, but the offer scope matters as much as its percentage. Some offers apply broadly and others affect a specific item. The savings tool lets you test either case using prices copied from your own village screen.',
    useCases: ['Compare full-village and single-item discounts', 'Estimate the coins needed to finish remaining buildings', 'Avoid applying an item promotion to unrelated upgrades'],
    steps: ['Enter the total remaining cost using the in-game prices.', 'Choose whether the discount covers the whole remainder or one item.', 'For an item offer, enter only the eligible item cost and compare the savings.'],
    mechanics: 'Savings equals eligible cost × discount percentage ÷ 100. Final remaining cost equals total cost minus savings. For a whole-village offer, eligible cost is the total. For an item offer, the eligible amount must not exceed the total remaining cost. No village-number price table is inferred.',
    example: 'Suppose remaining buildings cost 1,000,000 coins and a 20% offer covers the whole remainder. Savings is 200,000 coins, leaving 800,000. If the same percentage covers only a 200,000-coin item, savings drops to 40,000 and the final total is 960,000.',
    result: 'Compare the final cost with your available coins before starting a build. Use the actual offer wording to choose its scope. The publisher notes that even a very large advertised discount can apply to a single item, which makes a blanket village percentage misleading.',
    limits: 'The result assumes the entered prices are before discount and that the promotion applies to the eligible amount. Entering already-discounted prices applies the reduction twice. Event duration, repair costs and changing upgrade prices are not inferred from a village number.',
    sources: [
      mania,
      {
        label: 'Coin Master — Village building strategy',
        url: 'https://support.coinmastergame.com/hc/en-us/articles/29805992231058-How-can-I-strategically-best-build-my-Village',
      },
    ],
    faqs: [
      {
        question: 'Does Coin Master Village Mania always discount the entire village?',
        answer: 'No. The official explanation says offers can apply to the village or a specific item. Select the scope stated by your current offer.',
      },
      {
        question: 'Should I enter discounted Coin Master building prices?',
        answer: 'Enter the original prices before applying the percentage here. Otherwise the same promotion would be deducted a second time.',
      },
      {
        question: 'Why does the Coin Master Village Mania tool ask for my own prices?',
        answer: 'Published village-cost lists disagree and can lag account or game changes. Your displayed remaining building prices provide the relevant basis for this calculation.',
      },
    ],
  }),
});
