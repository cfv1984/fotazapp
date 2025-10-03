/*
 * Licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC-BY-NC-SA 4.0).
 * See the LICENSE file in the project root for the full license text.
 */

import { link, style } from "@project/template-fns";
import { compileAsync } from "sass";

type StyleFileProps = {
  inline: boolean;
};

export default async function StyleFile(
  path: string,
  { inline }: Partial<StyleFileProps> = {}
) {
  const file = Bun.file(path, { type: "text/plain" });
  const isSass = path.endsWith("scss");

  if (inline) {
    let contents = await file.text();
    if (isSass) {
      contents = (await compileAsync(contents)).css;
    }

    return style(contents, {
      type: "text/css",
    });
    
  } else {
    return link([], {
      rel: "stylesheet",
      href: path,
    });
  }
}






