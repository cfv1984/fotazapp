/*
 * Licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC-BY-NC-SA 4.0).
 * See the LICENSE file in the project root for the full license text.
 */

import { title } from "@project/template-fns";

export default function Title(...bits:unknown[]) {
  if(bits[0] && bits[0].constructor===Object){
    return title(compileFromMap(<Record<string,unknown>>bits[0]))
  }
  else{
    return title((<string[]>bits).join(' | '));
  }
}

function compileFromMap(bits:Record<string,unknown>):string {
  let compiled:string[] = [];
  for(const [bit,value] of Object.entries(bits)){
    if(Boolean(value) === true){
      compiled.push(bit);
    }
  }

  return compiled.join(" | ");
}





