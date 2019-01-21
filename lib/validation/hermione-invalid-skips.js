'use strict';

const validateSkipReason = require('./validation');

const getSkipReason = (test) => {
    const {skipReason, silentSkip} = test;
    const hasSkipInfo = skipReason || silentSkip;

    if (!hasSkipInfo && test.parent) {
        return getSkipReason(test.parent);
    }

    return {skipReason, silentSkip};
};

function buildInvalidSkipReasonList(testCollection, pattern) {
    const invalidSkipReasonTests = [];
    const undefinedSkipReason = 'No skip reason';

    testCollection.eachTest((test) => {
        const {skipReason, silentSkip} = getSkipReason(test);
        if (test.pending && !silentSkip && !validateSkipReason(skipReason, pattern)) {
            invalidSkipReasonTests.push({
                title: test.fullTitle(),
                browserId: test.browserId,
                skipReason: skipReason || undefinedSkipReason
            });
        }
    });

    return invalidSkipReasonTests;
}

module.exports = buildInvalidSkipReasonList;
