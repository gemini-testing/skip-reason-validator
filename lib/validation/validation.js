'use strict';

module.exports = function validateSkipReason(comment, pattern) {
    return [].concat(pattern).some(reasonPattern => reasonPattern.test(comment));
};
