function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const config = {
  coingecko: {
    apiKey: requireEnv("COINGECKO_API_KEY"),
  },
} as const;
