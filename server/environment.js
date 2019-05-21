import path from 'path';

const NODE_PATH = path.join(process.argv[1], '..');
const APP_ID = process.env.APP_ID || 'https://localhost';
const JWT_SECRET = process.env.JWT_SECRET || 'worldisfullasdfdevelopers';

export { NODE_PATH, APP_ID, JWT_SECRET };
