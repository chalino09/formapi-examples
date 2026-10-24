import { fileURLToPath } from "node:url";
const config = { turbopack: { root: fileURLToPath(new URL(".", import.meta.url)), rules: {"*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" }} } };
export default config;
