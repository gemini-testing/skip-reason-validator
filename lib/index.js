'use strict';
const chalk = require('chalk');

const parsePluginConfig = require('./config');
const findInvalidHermioneSkipReasons = require('./validation/hermione-invalid-skips');

module.exports = (hermione, config) => {
    const {enabled, pattern} = parsePluginConfig(config);

    if (!enabled) {
        return;
    }

    hermione.on(hermione.events.AFTER_TESTS_READ, testCollection => {
        const invalidSkips = findInvalidHermioneSkipReasons(testCollection, pattern);

        if (!invalidSkips.length) {
            return;
        }

        const skipsDescription = invalidSkips.map(invalidSkip =>
            `${invalidSkip.title} [${invalidSkip.browserId}]: "${invalidSkip.skipReason}"`).join('\n');

        const errorMessage = [
            `Skipped tests do not match the pattern: ${pattern.join(', ')}`,
            skipsDescription
        ].join('\n');

        console.error(chalk.red(errorMessage));
        process.exit(1);
    });
};
