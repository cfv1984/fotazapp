/*
 * Licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC-BY-NC-SA 4.0).
 * See the LICENSE file in the project root for the full license text.
 */

import {
  toStringAsync,
  type AsyncTree,
  type Tree,
} from "@project/template-fns";
import HomeTemplate from "./Home";
import { BACKEND_URL, NODE_ENV } from "@project/common-configs";

export const [Home] = [ async () => 
  respondWithPage(
    HomeTemplate({
      response: (await getData()).value,
    })
  ),
];

async function respondWithPage(page: Tree | AsyncTree): Promise<Response> {
  return respondWith(
    await toStringAsync(page, { pretty: NODE_ENV === "development" })
  );
}

function respondWith(content: unknown): Response {
  try {
    return new Response(String(content), {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  } catch (err) {
    return new Response(String(err ?? "error"), { status: 500 });
  }
}

async function getData() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/value?key=greeting`);
    return (await res.json()) as { value: string };
  } catch (cantFetch) {
    throw new Error("Cannot fetch from backend");
  }
}






