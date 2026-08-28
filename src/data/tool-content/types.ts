export interface CalculatorFaq {
  question: string;
  answer: string;
}

export interface ContentSection {
  title: string;
  body: string[];
  points?: string[];
}

export interface ReferenceTable {
  title: string;
  note: string;
  headers: string[];
  rows: string[][];
}

export interface CalculatorContent {
  reviewed?: string;
  methodSummary: string;
  intro: string[];
  useCases: string[];
  steps: string[];
  howItWorks: ContentSection;
  workedExample: ContentSection;
  howToUseResult: ContentSection;
  limitations: ContentSection;
  referenceData?: ReferenceTable;
  sources?: { label: string; url: string }[];
  faqs: CalculatorFaq[];
}

export type ToolContentMap = Record<string, CalculatorContent>;

export const defineToolContent = <T extends ToolContentMap>(content: T): T => content;

export interface CompactToolContent {
  name: string;
  reviewed?: string;
  methodSummary: string;
  intro: string | string[];
  useCases: string[];
  steps: string[];
  mechanics: string | string[];
  mechanicsPoints?: string[];
  example: string | string[];
  examplePoints?: string[];
  result: string | string[];
  resultPoints?: string[];
  limits: string | string[];
  limitPoints?: string[];
  referenceData?: ReferenceTable;
  sources?: { label: string; url: string }[];
  faqs: CalculatorFaq[];
}

const asArray = (value: string | string[]) => Array.isArray(value) ? value : [value];

export const compactToolContent = (input: CompactToolContent): CalculatorContent => ({
  reviewed: input.reviewed,
  methodSummary: input.methodSummary,
  intro: asArray(input.intro),
  useCases: input.useCases,
  steps: input.steps,
  howItWorks: { title: `How This ${input.name} Works`, body: asArray(input.mechanics), points: input.mechanicsPoints },
  workedExample: { title: `Worked Example for the ${input.name}`, body: asArray(input.example), points: input.examplePoints },
  howToUseResult: { title: `How to Use the ${input.name} Result`, body: asArray(input.result), points: input.resultPoints },
  limitations: { title: `${input.name} Accuracy and Limitations`, body: asArray(input.limits), points: input.limitPoints },
  referenceData: input.referenceData,
  sources: input.sources,
  faqs: input.faqs,
});
