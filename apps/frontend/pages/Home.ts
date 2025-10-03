/*
 * Licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC-BY-NC-SA 4.0).
 * See the LICENSE file in the project root for the full license text.
 */

import { html, body, head, meta, img, main, classNames } from "@project/template-fns";
import Title from "./common/Title";
import { NODE_ENV } from "@project/common-configs";
import StyleFile from "./common/StyleFile";
import {VERSION} from "@project/common-configs";
type PageProps = {
  response: string;
};

export default function Home({ response }: PageProps) {
  return html([
    head([
      meta([], { charset: "utf-8" }),
      Title({
        Fotaza: true,
        DEVELOPMENT: NODE_ENV === "development",
      }),
      StyleFile("./static/index.css", { inline: NODE_ENV==='development'})
    ]),
    body([
      main([
        img([], { src: "./static/marmota+camara.png" })
      ],{class:classNames("hero","home-page")})
    ]),
  ], {
    lang:"es-AR",
    "data-page":"home-page",
    "data-page-rev": VERSION
  });
}






