import type { GameConfig, ToolConfig } from './games';
import { priorityToolContent } from './tool-content/priority';
import { economyToolContent } from './tool-content/economy';
import { survivalTradingToolContent } from './tool-content/survival-trading';
import { systemsToolContent } from './tool-content/systems';
import { gtaToolContent } from './tool-content/gta';
import { pokemonGoToolContent } from './tool-content/pokemon-go';
import { osrsToolContent } from './tool-content/osrs';
import { palworldToolContent } from './tool-content/palworld';

export type {
  CalculatorContent,
  CalculatorFaq,
  ContentSection,
  ReferenceTable,
} from './tool-content/types';
import type { CalculatorContent } from './tool-content/types';

export const calculatorContent: Record<string, CalculatorContent> = {
  ...priorityToolContent,
  ...economyToolContent,
  ...survivalTradingToolContent,
  ...systemsToolContent,
  ...gtaToolContent,
  ...pokemonGoToolContent,
  ...osrsToolContent,
  ...palworldToolContent,
};

export function buildCalculatorContent(game: GameConfig, tool: ToolConfig): CalculatorContent {
  const key = `${game.slug}/${tool.slug}`;
  const content = calculatorContent[key];

  if (!content) {
    throw new Error(`Missing page-specific calculator content for ${key}`);
  }

  return content;
}
