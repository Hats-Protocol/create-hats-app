import pc from 'picocolors';

// this is inspired by both create-wagmi and create-vite CLI tools

type ColorFunc = (str: string | number) => string;

type TemplateVariant = {
  name: string;
  display: string;
  color: ColorFunc;
  customCommand?: string;
};

export type Template = {
  name: string;
  display: string;
  color: ColorFunc;
};

// I don't think that we need to use the TemplateVariant approach since our templates are currently flat
// We can integrate this when we support multiple options per each template (and then we'd nest them as variants)

export const templates: readonly Template[] = [
  {
    name: 'next',
    display: 'Next (App Router)',
    color: pc.cyan,
  },
  {
    name: 'vite',
    display: 'Vite (React)',
    color: pc.magenta,
  },
  {
    name: 'remix-vite',
    display: 'Remix/Vite)',
    color: pc.yellow,
  },
];
