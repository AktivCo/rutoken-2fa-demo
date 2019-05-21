import pg from 'pg';
import { pbkdf2Sync, randomBytes } from 'crypto';
import databaseConf from '../database.json';


const pool = new pg.Pool({ connectionString: databaseConf.connectionStringWithDBName });

function hashPassword(password) {
    const pwd = password.toLowerCase();
    const salt = randomBytes(128).toString('base64');
    const iterations = 10000;
    const hash = pbkdf2Sync(pwd, salt, iterations, 32, 'sha512').toString('base64');

    return {
        salt,
        hash,
        iterations,
    };
}

function isPasswordCorrect(savedHash, savedSalt, savedIterations, passwordAttempt) {
    const password = passwordAttempt.toLowerCase();
    const iterations = Number(savedIterations);
    return savedHash === pbkdf2Sync(password, savedSalt, iterations, 32, 'sha512').toString('base64');
}

function executeQuery(text, params) {
    return new Promise((resolve, reject) => {
        pool.query(text, params)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            });
    });
}


const getById = async (userId) => {
    const query = 'SELECT * FROM users WHERE "userId" = $1';
    const params = [userId];

    const res = await executeQuery(query, params);

    const user = res.rows[0];

    return user;
};

const login = async (username, password) => {
    const query = 'SELECT * FROM users WHERE "username" = $1';

    const params = [username];

    const res = await executeQuery(query, params);

    if (res.rows.length === 0) return null;

    const user = res.rows[0];
    if (user.otpBlocked) return null;
    if (!isPasswordCorrect(user.hash, user.salt, user.iterations, password)) return null;

    return user;
};

const register = async (username, password) => {
    let query = 'SELECT * FROM users WHERE username = $1';
    let params = [username];

    let res = await executeQuery(query, params);

    if (res.rows.length !== 0) return null;

    const hashedPassword = hashPassword(password);

    query = 'INSERT INTO users(username, password, hash, salt, iterations) '
        + 'VALUES ($1, $2, $3, $4, $5) RETURNING "userId";';
    params = [username, password, hashedPassword.hash, hashedPassword.salt, hashedPassword.iterations];

    res = await executeQuery(query, params);

    const { userId } = res.rows[0];

    return userId;
};

const registerU2F = async (user, publicKey, keyHandle) => {
    const query = 'UPDATE users '
        + 'SET "publicKey" = $1, "keyHandle" = $2, "otpSecret" = $3, "otpCounter" = $4, "otpAttempt" = 0 '
        + 'WHERE "userId" = $5';

    const params = [publicKey, keyHandle, null, null, user.userId];

    await executeQuery(query, params);
};

const registerOTP = async (user, otpSecret) => {
    const query = 'UPDATE users '
        + 'SET "publicKey" = $1, "keyHandle" = $2, "otpSecret" = $3, "otpCounter" = $4, "otpAttempt" = 0 '
        + 'WHERE "userId" = $5';
    const params = [null, null, otpSecret, 0, user.userId];

    await executeQuery(query, params);
};

const unregister = async (user) => {
    const query = 'UPDATE users '
        + 'SET "publicKey" = $1, "keyHandle" = $2, "otpSecret" = $3, "otpCounter" = $4, "otpAttempt" = 0 '
        + 'WHERE "userId" = $5';
    const params = [null, null, null, null, user.userId];

    await executeQuery(query, params);
};

const saveOTPCounter = async (user, otpCounter) => {
    const query = 'UPDATE users SET "otpCounter" = $1, "otpAttempt" = 0 WHERE "userId" = $2';
    const params = [otpCounter, user.userId];

    await executeQuery(query, params);
};

const saveOTPAttempt = async (user) => {
    const query = 'UPDATE users SET "otpAttempt" = $1 WHERE "userId" = $2';
    const params = [user.otpAttempt + 1, user.userId];

    await executeQuery(query, params);
};

export default { getById, login, register, registerU2F, registerOTP, saveOTPCounter, saveOTPAttempt, unregister };
