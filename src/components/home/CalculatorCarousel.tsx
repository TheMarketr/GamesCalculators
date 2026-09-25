import { useEffect, useState } from 'preact/hooks';

const slides = [
  {
    game: 'Pokémon GO',
    category: 'Combat Power calculator',
    title: 'CP Calculator',
    href: '/pokemon-go/cp-calculator/',
    icon: '/images/games/pokemon-go/icon.webp',
    accent: 'sky',
    inputLabel: 'Species · level · IVs',
    inputValue: 'Charizard · L40 · 15/15/15',
    resultLabel: 'Calculated CP',
    resultValue: '2,889',
    bars: [38, 56, 74, 92, 78, 62, 46],
  },
  {
    game: 'Minecraft',
    category: 'Building calculator',
    title: 'Circle Generator',
    href: '/minecraft/circle-generator/',
    icon: '/images/games/minecraft-gameplay.png',
    accent: 'green',
    inputLabel: 'Diameter',
    inputValue: '21 blocks',
    resultLabel: 'Outline blocks',
    resultValue: '56',
    bars: [42, 64, 82, 100, 82, 64, 42],
  },
  {
    game: 'Fortnite',
    category: 'Progress calculator',
    title: 'XP Calculator',
    href: '/fortnite/xp-calculator/',
    icon: '/images/games/fortnite-gameplay.jpg',
    accent: 'blue',
    inputLabel: 'Target level',
    inputValue: 'Level 100',
    resultLabel: 'Plan remaining XP',
    resultValue: '6.2M',
    bars: [28, 38, 48, 58, 70, 84, 96],
  },
  {
    game: 'Adopt Me',
    category: 'Trading calculator',
    title: 'WFL Calculator',
    href: '/adopt-me/wfl-calculator/',
    icon: '/images/games/adopt-me/icon.png',
    accent: 'coral',
    inputLabel: 'Offer comparison',
    inputValue: '4 pets vs 3 pets',
    resultLabel: 'Planning verdict',
    resultValue: 'FAIR',
    bars: [70, 54, 82, 64, 92, 58, 76],
  },
];

export default function CalculatorCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 5200);
    return () => window.clearInterval(timer);
  }, [paused]);

  const slide = slides[active];

  return (
    <section
      class={`hero-calculator-carousel accent-${slide.accent}`}
      aria-roledescription="carousel"
      aria-label="Featured game calculators"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusIn={() => setPaused(true)}
      onFocusOut={() => setPaused(false)}
    >
      <div class="carousel-browser-bar"><span><i /><i /><i /></span><small>gamescalculators.com</small><b>G</b></div>
      <div class="carousel-slide" aria-live="polite">
        <div class="carousel-slide-heading"><span class="carousel-glyph"><img src={slide.icon} alt="" width="44" height="44" loading="eager" decoding="async" /></span><div><small>{slide.game} · {slide.category}</small><strong>{slide.title}</strong></div><span class="working-badge">WORKING</span></div>
        <div class="carousel-mini-tool"><div class="carousel-input"><span>{slide.inputLabel}</span><strong>{slide.inputValue}</strong></div><div class="carousel-bars" aria-hidden="true">{slide.bars.map((width) => <i style={{ width: `${width}%` }} />)}</div></div>
        <div class="carousel-result"><span><small>{slide.resultLabel}</small><strong>{slide.resultValue}</strong></span><a href={slide.href}>Use calculator <b aria-hidden="true">↗</b></a></div>
      </div>
      <div class="carousel-controls"><button type="button" aria-label="Previous calculator" onClick={() => setActive((active - 1 + slides.length) % slides.length)}>←</button><div>{slides.map((item, index) => <button type="button" class={index === active ? 'active' : ''} aria-label={`Show ${item.game} ${item.title}`} aria-current={index === active ? 'true' : undefined} onClick={() => setActive(index)}><span /></button>)}</div><button type="button" aria-label="Next calculator" onClick={() => setActive((active + 1) % slides.length)}>→</button></div>
    </section>
  );
}
