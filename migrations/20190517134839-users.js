'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = function (db) {
    return db.createTable('users', {
        userId: {
            type: 'int',
            notNull: true,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: 'string',
            length: 100,
        },
        password: {
            type: 'string',
            length: 100
        },
        hash: {
            type: 'string',
            length: 100
        },
        salt: {
            type: 'string',
            length: 200
        },
        iterations: {
            type: 'string',
            length: 100
        },
        registerDate: {
            type: 'timestamp',
            notNull: true,
            defaultValue: new String('CURRENT_TIMESTAMP')
        },
        publicKey: {
            type: 'string',
            length: 1000
        },
        keyHandle: {
            type: 'string',
            length: 1000
        },
        otpSecret: {
            type: 'string',
            length: 1000
        },
        otpCounter: {
            type: 'int',
            notNull: false,
        },
        otpAttempt: {
            type: 'int',
            notNull: false,
        },
    });
};

exports.down = function (db) {
    return null;
};

exports._meta = {
    "version": 1
};
