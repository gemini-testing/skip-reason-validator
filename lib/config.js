'use strict';

const _ = require('lodash');
const {root, section, option} = require('gemini-configparser');

const ENV_PREFIX = 'skip-reason-validator-';

module.exports = (options) => getParser()({options, env: process.env, argv: process.argv});

function validatePettern(value) {
    const validPattern = _.isRegExp(value) || (_.isArray(value) && value.every(_.isRegExp));

    if (!validPattern) {
        throw new TypeError(`Option "pattern" must be regexp or array, got ${typeof value}`);
    }
}

function validateEnabled(value) {
    if (!_.isBoolean(value)) {
        throw new TypeError(`Option "enabled" must be boolean, got ${typeof value}`);
    }
}

function getParser() {
    return root(section({
        enabled: option({
            defaultValue: true,
            parseEnv: JSON.parse,
            parseCli: JSON.parse,
            validate: validateEnabled
        }),
        pattern: option({
            defaultValue: {},
            parseEnv: JSON.parse,
            parseCli: JSON.parse,
            validate: validatePettern
        })
    }), {envPrefix: ENV_PREFIX});
}
