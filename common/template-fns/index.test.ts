/*
 * Licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC-BY-NC-SA 4.0).
 * See the LICENSE file in the project root for the full license text.
 */


import { expect, test } from 'bun:test';
import type { Tag } from './index';
import {
  a,
  b,
  button,
  div,
  html,
  img,
  input,
  toString,
  toStringAsync,
} from './index';

test('Anchors return an anchor object', () => {
  const reference = JSON.stringify({
    tag: 'a',
    children: ['Test'],
    attributes: {},
  });
  const anchor = a('Test');

  expect(JSON.stringify(anchor)).toEqual(reference);
});

test('You can render an anchor object', () => {
  const reference = '<a>Test</a>';
  const anchor = a('Test');
  expect(toString(anchor)).toEqual(reference);
});

test('You can render an anchor object asynchronously', async () => {
  const reference = '<a>Test</a>';
  const anchor = a('Test');
  expect(await toStringAsync(anchor)).toEqual(reference);
});

test('The HTML tag gets a doctype glued to it', () => {
  const reference = '<!DOCTYPE html><html></html>';
  const htmlTag = html();
  expect(toString(htmlTag)).toEqual(reference);
});

test('You can render more than one tag at once', () => {
  const reference = '<a>Test</a>\n<b>Test</b>';
  const tags: [Tag, Tag] = [a('Test'), b('Test')];
  expect(toString(tags)).toEqual(reference);
});

test("Tags don't NEED to be all synchronous", async () => {
  const Content = (child: string) => Promise.resolve().then(() => div(child));
  const reference = '<b><div>test</div></b>';
  const withAsyncComponent = async () => b(await Content('test'));
  expect(await toStringAsync(withAsyncComponent())).toEqual(reference);
});

test('Anchor renders common attributes', () => {
  const el = a('Go', { href: '#', target: '_blank', rel: 'noopener' } as any);
  expect(toString(el)).toEqual(
    '<a href="#" target="_blank" rel="noopener">Go</a>',
  );
});

test('Boolean attributes render bare when true', () => {
  const el = button('Click', { disabled: true } as any);
  expect(toString(el)).toEqual('<button disabled>Click</button>');
});

test('Self-closing tags render with trailing slash', () => {
  const el = img('', { src: '/x.png', alt: 'x' } as any);
  expect(toString(el)).toEqual('<img src="/x.png" alt="x" />');
});

test('Numeric attributes render as strings', () => {
  const el = input('', { maxLength: 10 } as any);
  const rendered = toString(el);
  expect(rendered).toContain('maxLength="10"');
  expect(rendered.startsWith('<input')).toBe(true);
});

test('Class alias is preserved in attributes', () => {
  const el = div('X', { class: 'box' } as any);
  expect(toString(el)).toEqual('<div class="box">X</div>');
});

test('Array children concatenate without separators', () => {
  const el = div(['A', 'B', 'C']);
  expect(toString(el)).toEqual('<div>ABC</div>');
});

test('toStringAsync supports array of async tags', async () => {
  const tags: Array<Promise<Tag>> = [
    Promise.resolve(a('X')),
    Promise.resolve(b('Y')),
  ];
  const html = await toStringAsync(tags);
  expect(html).toEqual('<a>X</a>\n<b>Y</b>');
});

test('Nested structures render correctly', () => {
  const el = div([a('link', { href: '#' } as any), b('bold')]);
  expect(toString(el)).toEqual('<div><a href="#">link</a><b>bold</b></div>');
});

test('Pretty output keeps the doctype for <html>', () => {
  const page = html();
  const rendered = toString(page, { pretty: true });
  expect(rendered.startsWith('<!DOCTYPE html>')).toBe(true);
  expect(rendered.includes('\n')).toBe(true);
});

test('Async children values are awaited and concatenated', async () => {
  const el = div([Promise.resolve('one'), 'two', Promise.resolve('three')]);
  const rendered = await toStringAsync(el);
  expect(rendered).toEqual('<div>onetwothree</div>');
});







