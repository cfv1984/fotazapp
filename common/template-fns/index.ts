/*
 * Licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC-BY-NC-SA 4.0).
 * See the LICENSE file in the project root for the full license text.
 */

import prettify from 'pretty';

export type MaybePromise<T> = T | Promise<T>;
export type Primitive = string | number | Date | object;

export type TagNames = (typeof HTMLElements)[number];

export type AttributesOf<Name extends TagNames> = Partial<{
  [K in keyof HTMLElementTagNameMap[Name]]: HTMLElementTagNameMap[Name][K];
}>;

export type Extras = {
  class?: string;
  className?: string;
  style?: string | Partial<CSSStyleDeclaration>;
};

export type WithAliases<T> = T & Extras;

export type Children = Tag | Tag[] | Primitive;

export type Tag<Name extends TagNames = TagNames> = {
  tag: Name;
  children: Children;
  attributes: WithAliases<AttributesOf<Name>>;
};

export type Tree = Tag | Tag[];
export type AsyncTree = MaybePromise<Tag> | Array<MaybePromise<Tag>>;

export type Component<T extends unknown[] = []> = (
  ...params: T
) => Tree | AsyncTree;

type TagFunction<Name extends TagNames> = (
  children?: Children,
  attributes?: WithAliases<AttributesOf<Name>>,
) => Tag<Name>;

export type TagFunctionMap = { [K in TagNames]: TagFunction<K> };

export const HTMLElements = [
  'a',
  'abbr',
  'address',
  'area',
  'article',
  'aside',
  'audio',
  'b',
  'base',
  'bdi',
  'bdo',
  'blockquote',
  'body',
  'br',
  'button',
  'canvas',
  'caption',
  'cite',
  'code',
  'col',
  'colgroup',
  'data',
  'datalist',
  'dd',
  'del',
  'details',
  'dfn',
  'dialog',
  'div',
  'dl',
  'dt',
  'em',
  'embed',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'head',
  'header',
  'hr',
  'html',
  'i',
  'iframe',
  'img',
  'input',
  'ins',
  'kbd',
  'label',
  'legend',
  'li',
  'link',
  'main',
  'map',
  'mark',
  'menu',
  'meta',
  'meter',
  'nav',
  'noscript',
  'object',
  'ol',
  'optgroup',
  'option',
  'output',
  'p',
  'picture',
  'pre',
  'progress',
  'q',
  'rp',
  'rt',
  'ruby',
  's',
  'samp',
  'script',
  'section',
  'select',
  'slot',
  'small',
  'source',
  'span',
  'strong',
  'style',
  'sub',
  'summary',
  'sup',
  'table',
  'tbody',
  'td',
  'template',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'time',
  'title',
  'tr',
  'track',
  'u',
  'ul',
  'var',
  'video',
  'wbr',
] as const;

export const selfClosingTags = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
];

const make =
  <N extends TagNames>(name: N): TagFunction<N> =>
  (
    children: Children = [],
    attributes: WithAliases<AttributesOf<N>> = {},
  ): Tag<N> => ({
    tag: name,
    children: Array.isArray(children) ? children : [children],
    attributes,
  });

const elementsEntries = HTMLElements.map(
  <N extends TagNames>(name: N) => [name, make(name)] as const,
);

export const Elements: TagFunctionMap = Object.fromEntries(
  elementsEntries,
) as unknown as TagFunctionMap;

export const {
  a,
  abbr,
  address,
  area,
  article,
  aside,
  audio,
  b,
  base,
  bdi,
  bdo,
  blockquote,
  body,
  br,
  button,
  canvas,
  caption,
  cite,
  code,
  col,
  colgroup,
  data,
  datalist,
  dd,
  del,
  details,
  dfn,
  dialog,
  div,
  dl,
  dt,
  em,
  embed,
  fieldset,
  figcaption,
  figure,
  footer,
  form,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  head,
  header,
  hr,
  html,
  i,
  iframe,
  img,
  input,
  ins,
  kbd,
  label,
  legend,
  li,
  link,
  main,
  map,
  mark,
  menu,
  meta,
  meter,
  nav,
  noscript,
  object,
  ol,
  optgroup,
  option,
  output,
  p,
  picture,
  pre,
  progress,
  q,
  rp,
  rt,
  ruby,
  s,
  samp,
  script,
  section,
  select,
  slot,
  small,
  source,
  span,
  strong,
  style,
  sub,
  summary,
  sup,
  table,
  tbody,
  td,
  template,
  textarea,
  tfoot,
  th,
  thead,
  time,
  title,
  tr,
  track,
  u,
  ul,
  var: htmlVar,
  video,
  wbr,
} = Elements;

type ToStringOptions = { pretty: boolean };

function renderAttrs(attrs: Record<string, any>): string {
  return Object.entries(attrs)
    .filter(([_, v]) => v === true || ['string', 'number'].includes(typeof v))
    .map(([k, v]) => (v === true ? k : `${k}="${v}"`))
    .join(' ');
}

function renderTag(tag: Tag): string {
  const attrs = renderAttrs(tag.attributes);
  const open = `<${tag.tag}${attrs ? ' ' + attrs : ''}`;
  if (selfClosingTags.includes(tag.tag)) {
    return `${open} />`;
  }
  const children = (Array.isArray(tag.children) ? tag.children : [tag.children])
    .map((c) => (isTag(c) ? renderTag(c) : String(c ?? '')))
    .join('');

  return `${open}>${children}</${tag.tag}>`;
}

export function toString(
  tree: Tree,
  { pretty = false }: Partial<ToStringOptions> = {},
): string {
  const rendered = Array.isArray(tree)
    ? tree.map(renderTag).join('\n')
    : renderTag(tree);
  const doc = rendered.startsWith('<html')
    ? `<!DOCTYPE html>${rendered}`
    : rendered;

  return pretty ? prettify(doc, { ocd: true }) : doc;
}

async function renderTagAsync(tag: Tag): Promise<string> {
  const attrs = renderAttrs(tag.attributes);
  const open = `<${tag.tag}${attrs ? ' ' + attrs : ''}`;
  if (selfClosingTags.includes(tag.tag)) {
    return `${open} />`;
  }
  const children = await Promise.all(
    (Array.isArray(tag.children) ? tag.children : [tag.children]).map(
      async (c) => {
        const v = await c;
        return isTag(v) ? renderTagAsync(v) : String(v ?? '');
      },
    ),
  );

  return `${open}>${children.join('')}</${tag.tag}>`;
}

export async function toStringAsync(
  tree: AsyncTree,
  { pretty = false }: Partial<ToStringOptions> = {},
): Promise<string> {
  const nodes = Array.isArray(tree) ? await Promise.all(tree) : [await tree];
  const rendered = (await Promise.all(nodes.map(renderTagAsync))).join('\n');
  const doc = rendered.startsWith('<html')
    ? `<!DOCTYPE html>${rendered}`
    : rendered;
  return pretty ? prettify(doc, { ocd: true }) : doc;
}

export type ClassValue =
  | string
  | Record<string, boolean | (() => boolean)>
  | ClassValue[];

export function classNames(...args: ClassValue[]): string {
  function walk(v: ClassValue): string[] {
    if (typeof v === 'string') {
      return [v];
    }
    if (Array.isArray(v)) {
      return v.flatMap(walk);
    }

    if (v && (v as any).constructor === Object) {
      return Object.entries(v as Record<string, boolean | (() => boolean)>)
        .filter(([, val]) => (typeof val === 'function' ? val() : val))
        .map(([k]) => k);
    }

    return [];
  }

  return args.flatMap(walk).join(' ');
}

export default Elements;

function isTag(obj: unknown): obj is Tag {
  return Boolean(
    obj && (obj as any).tag && (obj as any).attributes && (obj as any).children,
  );
}






