export interface GtaReferenceRecord {
  slug: string;
  name: string;
  category: string;
  rarity: string;
  value: number;
  rating: number;
  note: string;
  displayValue: string;
  sourceLabel: string;
  sourceUrl: string;
  reviewed: string;
  lastReviewed: string;
  ratingLabel: string;
}

const reviewed = '2026-08-31';
const rockstarPeople = 'https://www.rockstargames.com/VI/only-in-leonida';
const rockstarSupport = 'https://support.rockstargames.com/articles/4QfG4FmZCf5W1gS8jy4UVT/grand-theft-auto-vi-platform-editions-and-versions';
const rockstarExtended = 'https://www.rockstargames.com/VI/an-extended-look';
const dazedDeepDive = 'https://www.dazeddigital.com/life-culture/article/70859/1/gta-6-grand-theft-auto-vi-rockstar-exclusive-deep-dive-game-unparalleled-world';
const pcGamerBreakdown = 'https://www.pcgamer.com/games/grand-theft-auto/gta-6-gameplay-reveal-details-breakdown/';

const record = (
  slug: string,
  name: string,
  category: string,
  status: string,
  note: string,
  sourceLabel: string,
  sourceUrl: string,
  evidence: string,
): GtaReferenceRecord => ({
  slug,
  name,
  category,
  rarity: status,
  value: 0,
  rating: 0,
  note,
  displayValue: sourceLabel,
  sourceLabel,
  sourceUrl,
  reviewed,
  lastReviewed: reviewed,
  ratingLabel: evidence,
});

export const gtaCharacters: GtaReferenceRecord[] = [
  record('jason-duval', 'Jason Duval', 'protagonist', 'Official profile', 'An ex-Army drug runner from the Leonida Keys who becomes one half of the central playable couple.', 'Rockstar profile', rockstarPeople, 'Published directly by Rockstar'),
  record('lucia-caminos', 'Lucia Caminos', 'protagonist', 'Official profile', 'A fighter recently released from Leonida Penitentiary who is determined to change the odds for herself and her family.', 'Rockstar profile', rockstarPeople, 'Published directly by Rockstar'),
  record('cal-hampton', 'Cal Hampton', 'associate', 'Official profile', 'Jason’s friend and a fellow associate of Brian who monitors Coast Guard communications from home.', 'Rockstar profile', rockstarPeople, 'Published directly by Rockstar'),
  record('boobie-ike', 'Boobie Ike', 'entrepreneur', 'Official profile', 'A Vice City figure whose businesses span real estate, the Jack of Hearts club, and a recording studio.', 'Rockstar profile', rockstarPeople, 'Published directly by Rockstar'),
  record('dre-quan-priest', "Dre'Quan Priest", 'music', 'Official profile', 'A hustler building Only Raw Records and working to break into Vice City’s music scene.', 'Rockstar profile', rockstarPeople, 'Published directly by Rockstar'),
  record('real-dimez', 'Real Dimez', 'music', 'Official profile', 'The rap duo formed by Bae-Luxe and Roxy, signed to Only Raw Records after an earlier local hit.', 'Rockstar profile', rockstarPeople, 'Published directly by Rockstar'),
  record('bae-luxe', 'Bae-Luxe', 'music', 'Officially named', 'One of the two artists who make up Real Dimez; Rockstar’s profile identifies her alongside Roxy.', 'Rockstar profile', rockstarPeople, 'Named within an official Rockstar profile'),
  record('roxy', 'Roxy', 'music', 'Officially named', 'One of the two artists who make up Real Dimez; Rockstar’s profile identifies her alongside Bae-Luxe.', 'Rockstar profile', rockstarPeople, 'Named within an official Rockstar profile'),
  record('raul-bautista', 'Raul Bautista', 'robbery crew', 'Official profile', 'A confident, experienced bank robber who recruits people willing to take larger risks for larger rewards.', 'Rockstar profile', rockstarPeople, 'Published directly by Rockstar'),
  record('brian-heder', 'Brian Heder', 'smuggler', 'Official profile', 'A veteran Keys drug runner who lets Jason stay at one of his properties in exchange for help with local shakedowns.', 'Rockstar profile', rockstarPeople, 'Published directly by Rockstar'),
];

export const gtaLocations: GtaReferenceRecord[] = [
  record('vice-city', 'Vice City', 'major region', 'Official region', 'The neon-lit urban heart of Leonida and the primary city named in Rockstar’s story description.', 'Rockstar region', rockstarPeople, 'Official name; no invented boundary or coordinate'),
  record('leonida-keys', 'Leonida Keys', 'major region', 'Official region', 'The island-chain region tied to Jason, Brian’s boat yard, smuggling routes, and coastal life.', 'Rockstar region', rockstarPeople, 'Official name; no invented boundary or coordinate'),
  record('grassrivers', 'Grassrivers', 'major region', 'Official region', 'Leonida’s wetlands region, shown with fan boats, wildlife, waterways, and marshland travel.', 'Rockstar region', rockstarPeople, 'Official name; placement remains non-numeric'),
  record('port-gellhorn', 'Port Gellhorn', 'major region', 'Official region', 'A named coastal region included in Rockstar’s official Leonida destination set.', 'Rockstar region', rockstarPeople, 'Official name; exact playable limits unpublished'),
  record('ambrosia', 'Ambrosia', 'major region', 'Official region', 'A named Leonida region represented in Rockstar’s official people, places, screenshots, and artwork.', 'Rockstar region', rockstarPeople, 'Official name; exact playable limits unpublished'),
  record('mount-kalaga', 'Mount Kalaga National Park', 'major region', 'Official region', 'The northern wilderness area used by Rockstar to contrast Leonida’s cities, coasts, and wetlands.', 'Rockstar region', rockstarPeople, 'Official name; exact playable limits unpublished'),
  record('vice-beach', 'Vice Beach', 'Vice City district', 'Developer-interview context', 'Dazed’s Rockstar access feature describes crowds on Vice Beach while discussing the city’s range of people and places.', 'Dazed / Rockstar interview', dazedDeepDive, 'Attributed developer-access reporting'),
  record('little-cuba', 'Little Cuba', 'Vice City district', 'Developer-interview context', 'Named by Rockstar character-art leadership as one of the environments shaping local NPC appearance and clothing.', 'Dazed / Rockstar interview', dazedDeepDive, 'Attributed developer-access reporting'),
  record('stockyard', 'Stockyard', 'Vice City district', 'Developer-interview context', 'A Vice City mural district cited in Dazed’s Rockstar feature while discussing contributions from real street artists.', 'Dazed / Rockstar interview', dazedDeepDive, 'Attributed developer-access reporting'),
];

export const gtaGameplaySystems: GtaReferenceRecord[] = [
  record('duo-solo-play', 'Duo or Independent Free Roam', 'character system', 'Rockstar interview', 'Jason and Lucia can operate as a couple or separate and create trouble independently.', 'Dazed / Rockstar interview', dazedDeepDive, 'Developer interview; final restrictions not fully documented'),
  record('character-switching', 'Character Switching', 'character system', 'Official footage observed', 'The Extended Look showed control switching between Jason and Lucia during travel and action without a visible loading screen.', 'PC Gamer footage breakdown', pcGamerBreakdown, 'Observed in Rockstar-published footage'),
  record('relationship-consequences', 'Relationship Consequences', 'character system', 'Rockstar interview', 'Rockstar discussed choices affecting Jason and Lucia’s relationship more deeply than earlier honor-style systems.', 'Dazed / Rockstar interview', dazedDeepDive, 'Developer interview; no complete formula published'),
  record('weight-and-diet', 'Weight and Diet', 'body system', 'Rockstar interview', 'Food affects Jason and Lucia’s weight.', 'Dazed / Rockstar interview', dazedDeepDive, 'Developer interview; numerical thresholds unpublished'),
  record('exercise-and-muscle', 'Exercise and Muscle', 'body system', 'Rockstar interview', 'Exercise visibly builds and tones the protagonists’ muscles.', 'Dazed / Rockstar interview', dazedDeepDive, 'Developer interview; numerical thresholds unpublished'),
  record('sleep-and-exhaustion', 'Sleep and Exhaustion Appearance', 'body system', 'Rockstar interview', 'Long periods without sleep, police pressure, or multi-day excess can visibly affect the protagonists.', 'Dazed / Rockstar interview', dazedDeepDive, 'Developer interview; numerical thresholds unpublished'),
  record('phone-and-social-feeds', 'In-Game Phone and Social Feeds', 'world system', 'Rockstar interview', 'Players can use the in-game phone and encounter functioning social-media feeds inside Leonida.', 'Dazed / Rockstar interview', dazedDeepDive, 'Developer interview; complete app list unpublished'),
  record('reactive-open-world', 'Reactive Open World', 'world system', 'Rockstar interview', 'Rockstar says visible behavior such as carrying a rifle in public can provoke a reaction from the city.', 'Dazed / Rockstar interview', dazedDeepDive, 'Developer interview; response rules unpublished'),
  record('criminal-profile', 'Criminal Profile Feedback', 'crime system', 'Official footage observed', 'The presentation displayed moral or behavioral feedback tied to Jason and Lucia’s actions.', 'PC Gamer footage breakdown', pcGamerBreakdown, 'Observed interface; full scoring logic unpublished'),
  record('wanted-description', 'Suspect and Vehicle Descriptions', 'crime system', 'Official footage observed', 'Police feedback could include the suspect, car, clothing, and whether the pair were together.', 'PC Gamer footage breakdown', pcGamerBreakdown, 'Observed interface; exact detection formula unpublished'),
  record('disguise-swapping', 'Masks, Hats, Glasses, and Disguises', 'crime system', 'Official footage observed', 'The footage showed clothing and disguise elements being changed before or during criminal activity.', 'PC Gamer footage breakdown', pcGamerBreakdown, 'Observed in Rockstar-published footage'),
  record('six-star-wanted', 'Six-Star Wanted Display', 'crime system', 'Official footage observed', 'The Extended Look displayed a six-star wanted scale.', 'PC Gamer footage breakdown', pcGamerBreakdown, 'Observed HUD element; escalation rules unpublished'),
  record('body-part-targeting', 'Body-Part Targeting', 'combat system', 'Official footage observed', 'The aiming interface showed selectable body areas rather than only a single generic target point.', 'PC Gamer footage breakdown', pcGamerBreakdown, 'Observed in Rockstar-published footage'),
  record('robbery-roles', 'Robber and Getaway Roles', 'crime activity', 'Official footage observed', 'The presentation showed one protagonist entering a robbery while the other could support the escape.', 'PC Gamer footage breakdown', pcGamerBreakdown, 'Observed scenario; not proof every robbery supports free role choice'),
  record('fan-boats', 'Fan Boats', 'water activity', 'Official footage observed', 'Fan-boat travel was shown across the wetlands.', 'PC Gamer footage breakdown', pcGamerBreakdown, 'Observed in Rockstar-published footage'),
  record('kayaking', 'Kayaking', 'water activity', 'Official footage observed', 'Kayaks appeared as a Leonida water activity.', 'PC Gamer footage breakdown', pcGamerBreakdown, 'Observed in Rockstar-published footage'),
  record('scuba-diving', 'Scuba Diving', 'water activity', 'Official footage observed', 'Scuba diving was included in the Extended Look activity montage.', 'PC Gamer footage breakdown', pcGamerBreakdown, 'Observed in Rockstar-published footage'),
  record('jet-skiing', 'Jet Skiing', 'water activity', 'Rockstar interview', 'Dazed’s developer-access feature describes Jason and Lucia traveling together on a jet ski.', 'Dazed / Rockstar interview', dazedDeepDive, 'Attributed developer-access reporting'),
  record('basketball', 'Basketball', 'sport activity', 'Official footage observed', 'Basketball appeared among the activities shown in the Extended Look.', 'PC Gamer footage breakdown', pcGamerBreakdown, 'Observed in Rockstar-published footage'),
  record('weight-lifting', 'Weight Lifting', 'sport activity', 'Official footage observed', 'Weight training appeared in the presentation and connects to Rockstar’s separately described body system.', 'PC Gamer footage breakdown', pcGamerBreakdown, 'Observed footage plus developer interview context'),
  record('dirt-biking', 'Dirt Biking and Motocross', 'race activity', 'Official footage observed', 'Dirt-bike riding, motocross, and course racing were shown.', 'PC Gamer footage breakdown', pcGamerBreakdown, 'Observed in Rockstar-published footage'),
  record('skydiving', 'Skydiving / BASE Jumping', 'air activity', 'Official footage observed', 'The presentation showed parachute activity from height.', 'PC Gamer footage breakdown', pcGamerBreakdown, 'Observed in Rockstar-published footage'),
  record('shooting-gallery', 'Shooting Gallery Courses', 'combat activity', 'Official footage observed', 'Shooting-range course activity appeared in the Extended Look.', 'PC Gamer footage breakdown', pcGamerBreakdown, 'Observed in Rockstar-published footage'),
  record('dog-interaction', 'Dog Interaction', 'world activity', 'Official footage observed', 'The footage showed a positive interaction with a dog.', 'PC Gamer footage breakdown', pcGamerBreakdown, 'Observed example; broader pet system unconfirmed'),
];

export const gtaEditionContents: GtaReferenceRecord[] = [
  record('standard-game', 'Grand Theft Auto VI', 'Standard Edition', 'Official inclusion', 'The Standard Edition includes the base game.', 'Rockstar Support', rockstarSupport, 'Official edition contents'),
  record('ultimate-upgrade', 'GTAVI: Ultimate Edition Upgrade', 'Ultimate Edition', 'Official inclusion', 'The upgrade collection is included with Ultimate and can also be purchased separately by Standard owners.', 'Rockstar Support', rockstarSupport, 'Official edition contents'),
  record('95-grotti-cheetah', "'95 Grotti Cheetah", 'Ultimate vehicle', 'Official inclusion', 'Vehicle listed in the Ultimate Edition Upgrade.', 'Rockstar Support', rockstarSupport, 'Official item; unlock timing may follow story chapters'),
  record('morgan-revolvers', 'Hawk & Little Morgan Revolvers', 'Ultimate weapon', 'Official inclusion', 'Revolver set listed in the Ultimate Edition Upgrade.', 'Rockstar Support', rockstarSupport, 'Official item; gameplay stats unpublished'),
  record('weapon-variants', 'Personalized Weapon Variants', 'Ultimate weapon', 'Official inclusion', 'Personalized weapon variants listed in the Ultimate Edition Upgrade.', 'Rockstar Support', rockstarSupport, 'Official inclusion; complete variant list unpublished'),
  record('vice-city-styles', 'Vice City Styles', 'Ultimate fashion', 'Official inclusion', 'Style content listed in the Ultimate Edition Upgrade.', 'Rockstar Support', rockstarSupport, 'Official inclusion; full wardrobe list unpublished'),
  record('jason-safehouse-vehicles', "Jason's Safehouse Vehicles", 'Ultimate vehicle', 'Official inclusion', 'Safehouse vehicle content listed in the Ultimate Edition Upgrade.', 'Rockstar Support', rockstarSupport, 'Official inclusion; exact vehicle list unpublished'),
  record('ganado-retro-build', 'Ganado Retro Build', 'Ultimate vehicle', 'Official inclusion', 'Vehicle build listed in the Ultimate Edition Upgrade.', 'Rockstar Support', rockstarSupport, 'Official edition contents'),
  record('rideout-customs', 'Rideout Customs Mod Shop', 'Ultimate business', 'Official inclusion', 'Mod shop listed in the Ultimate Edition Upgrade.', 'Rockstar Support', rockstarSupport, 'Official inclusion; economic benefits unpublished'),
  record('saras-salon', "Sara's Unisex Salon", 'Ultimate business', 'Official inclusion', 'Salon listed in the Ultimate Edition Upgrade.', 'Rockstar Support', rockstarSupport, 'Official inclusion; service list unpublished'),
  record('shitzu-squalo', 'Shitzu Squalo', 'Ultimate vehicle', 'Official inclusion', 'Watercraft listed in the Ultimate Edition Upgrade.', 'Rockstar Support', rockstarSupport, 'Official edition contents'),
  record('stock-305', 'Stock 305 Clothing Store', 'Ultimate business', 'Official inclusion', 'Clothing store listed in the Ultimate Edition Upgrade.', 'Rockstar Support', rockstarSupport, 'Official inclusion; inventory unpublished'),
  record('67-dominator-buggy', "'67 Vapid Dominator Buggy and Garage", 'Ultimate vehicle', 'Official inclusion', 'Buggy and garage content listed in the Ultimate Edition Upgrade.', 'Rockstar Support', rockstarSupport, 'Official edition contents'),
  record('electric-fang', 'Electric Fang Tattoo Parlor', 'Ultimate business', 'Official inclusion', 'Tattoo parlor listed in the Ultimate Edition Upgrade.', 'Rockstar Support', rockstarSupport, 'Official inclusion; service list unpublished'),
  record('one-eyed-willies', "One-Eyed Willie's Mod Shop", 'Ultimate business', 'Official inclusion', 'Mod shop listed in the Ultimate Edition Upgrade.', 'Rockstar Support', rockstarSupport, 'Official inclusion; economic benefits unpublished'),
  record('goodtime-gear', 'Goodtime Gear', 'Ultimate business', 'Official inclusion', 'Gear location listed in the Ultimate Edition Upgrade.', 'Rockstar Support', rockstarSupport, 'Official inclusion; inventory unpublished'),
  record('ptt-youngins-compound', 'PTT Youngin$ Compound', 'Ultimate property', 'Official inclusion', 'Compound listed in the Ultimate Edition Upgrade.', 'Rockstar Support', rockstarSupport, 'Official inclusion; story function unpublished'),
  record('classic-car-collection', 'Classic Car Collection', 'Ultimate vehicle', 'Official inclusion', 'Collection listed in the Ultimate Edition Upgrade.', 'Rockstar Support', rockstarSupport, 'Official inclusion; complete car list unpublished'),
  record('55-vapid-stanier', "'55 Vapid Stanier Sedan and Garage", 'Vintage Vice City Pack', 'Official preorder bonus', 'Vehicle and garage included in the Vintage Vice City Pack.', 'Rockstar Support', rockstarSupport, 'Official preorder inclusion'),
  record('preorder-outfits', 'Outfits and Hairstyles', 'Vintage Vice City Pack', 'Official preorder bonus', 'Fashion content included in the Vintage Vice City Pack.', 'Rockstar Support', rockstarSupport, 'Official inclusion; complete list unpublished'),
  record('preorder-weapon-pattern', 'Exclusive Weapon Pattern', 'Vintage Vice City Pack', 'Official preorder bonus', 'Weapon pattern included in the Vintage Vice City Pack.', 'Rockstar Support', rockstarSupport, 'Official inclusion; weapon compatibility unpublished'),
  record('gta-plus-month', 'One Month of GTA+ Membership', 'Digital purchase bonus', 'Official limited offer', 'Included with eligible digital purchases made before November 20, 2026, subject to redemption terms.', 'Rockstar Support', rockstarSupport, 'Official offer; auto-renewal terms apply after redemption'),
];

export const gtaLaunchFacts: GtaReferenceRecord[] = [
  record('release-date', 'Release Date', 'release', 'Confirmed', 'November 19, 2026.', 'Rockstar Games', rockstarExtended, 'Official date'),
  record('ps5', 'PlayStation 5', 'platform', 'Confirmed', 'Preorder and launch platform listed by Rockstar.', 'Rockstar Support', rockstarSupport, 'Official platform'),
  record('xbox-series', 'Xbox Series X|S', 'platform', 'Confirmed', 'Preorder and launch platform listed by Rockstar.', 'Rockstar Support', rockstarSupport, 'Official platform'),
  record('pc-status', 'PC Version', 'platform', 'Not announced', 'Rockstar’s current official platform list does not include a PC release date.', 'Rockstar Support', rockstarSupport, 'Absence from current official list; not a claim of never'),
  record('preload', 'Preload Start', 'release', 'Confirmed', 'Eligible downloads begin preloading at local midnight on November 12, 2026.', 'Rockstar Support', rockstarSupport, 'Official support schedule'),
  record('physical-package', 'Physical Package', 'version', 'Code in box', 'Rockstar says the physical Standard package contains a digital download code and no game disc.', 'Rockstar Support', rockstarSupport, 'Official version detail'),
  record('physical-ultimate', 'Physical Ultimate Edition', 'version', 'Not offered', 'Rockstar Support says there is no physical Ultimate Edition; code-in-box Standard owners may buy the upgrade digitally.', 'Rockstar Support', rockstarSupport, 'Official version detail'),
  record('standard-upgrade', 'Standard-to-Ultimate Upgrade', 'edition', 'Available separately', 'Standard owners can purchase the Ultimate Edition Upgrade after redeeming the game code.', 'Rockstar Support', rockstarSupport, 'Official upgrade path'),
  record('playstation-code-region', 'PlayStation Code Region', 'activation', 'Region matched', 'PlayStation codes must match the supported country group of the platform account.', 'Rockstar Support', rockstarSupport, 'Official activation restriction'),
  record('xbox-code-region', 'Xbox Code Region', 'activation', 'Not region-locked', 'Rockstar Support states Xbox download codes are not region-locked.', 'Rockstar Support', rockstarSupport, 'Official activation detail'),
  record('download-size', 'Download / Install Size', 'storage', 'Not published here', 'The cited official pages do not supply one universal final size; use the platform store when available.', 'Rockstar Support', rockstarSupport, 'Unknown kept explicit'),
  record('online-roadmap', 'GTA Online Roadmap', 'online', 'Not announced in showcase', 'The Extended Look did not provide a complete online-mode roadmap.', 'PC Gamer footage breakdown', pcGamerBreakdown, 'Presentation omission; future announcements can change this'),
];
