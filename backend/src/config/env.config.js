const DEFAULT_PORT = 3000;

function requireVariable(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name} (see .env.example)`);
  }
  return value;
}

function parseOrigins(rawOrigins) {
  return (rawOrigins ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

// Number of reverse proxies in front of the API (e.g. 1 for nginx). 0 = direct connections.
function parseTrustProxy(rawValue) {
  const hops = Number(rawValue);
  return Number.isInteger(hops) && hops >= 0 ? hops : 0;
}

export function loadConfig() {
  return Object.freeze({
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: Number(process.env.PORT) || DEFAULT_PORT,
    mongoUri: requireVariable('MONGODB_URI'),
    jwtSecret: requireVariable('JWT_SECRET'),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '2h',
    corsOrigins: parseOrigins(process.env.CORS_ORIGIN),
    trustProxy: parseTrustProxy(process.env.TRUST_PROXY),
  });
}
