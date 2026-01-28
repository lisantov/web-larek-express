export const accessTokenExpiry = process.env.AUTH_ACCESS_TOKEN_EXPIRY || '1m';
export const refreshTokenExpiry = process.env.AUTH_REFRESH_TOKEN_EXPIRY || '7d';
export const accessTokenSecret = process.env.AUTH_ACCESS_TOKEN_SECRET;
export const refreshTokenSecret = process.env.AUTH_REFRESH_TOKEN_SECRET;
export const tempDirectoryName = process.env.TEMP_DIRECTORY_NAME || 'uploads';
export const mainDirectoryName = process.env.MAIN_DIRECTORY_NAME || 'images';
