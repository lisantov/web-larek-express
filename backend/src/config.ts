export const accessTokenExpiry = process.env.AUTH_ACCESS_TOKEN_EXPIRY || '1m';
export const refreshTokenExpiry = process.env.AUTH_REFRESH_TOKEN_EXPIRY || '7d';
export const accessTokenSecret = process.env.AUTH_ACCESS_TOKEN_SECRET;
export const refreshTokenSecret = process.env.AUTH_REFRESH_TOKEN_SECRET;
