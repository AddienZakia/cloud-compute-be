module.exports = {
  "**/*.{ts,tsx,js}": "pnpm check:write",
  "**/*.{md,json}": "biome format --write",
};
