/*
 * Licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC-BY-NC-SA 4.0).
 * See the LICENSE file in the project root for the full license text.
 */

const ENV = {
  NODE_ENV: process.env.NODE_ENV ?? "production",
  FRONTEND_PORT: Number(process.env.FRONTEND_PORT ?? 8080),
  BACKEND_PORT: Number(process.env.BACKEND_PORT ?? 8081),
  BACKEND_URL: String(
    process.env.BACKEND_URL ??
      `http://localhost:${process.env.BACKEND_PORT ?? 8081}`
  ),
  DATA_DIR: String(process.env.DATA_DIR ?? "./data"),
  FRONTEND_ASSET_PATH:String(process.env.FRONTEND_ASSET_PATH??'./static')
};

export const { NODE_ENV, FRONTEND_PORT, BACKEND_PORT, BACKEND_URL, DATA_DIR, FRONTEND_ASSET_PATH } = ENV;
export default ENV;





