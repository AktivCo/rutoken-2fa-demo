import path from 'path';

const NODE_PATH = path.join(process.argv[1], '..');
const APP_ID = process.env.APP_ID || 'localhost';
const JWT_SECRET = process.env.JWT_SECRET || 'worldisfullasdfdevelopers';
const USE_HTTPS = process.env.USE_HTTPS || false;

export { NODE_PATH, APP_ID, JWT_SECRET, USE_HTTPS };
