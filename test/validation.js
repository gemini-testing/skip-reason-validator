'use strict';

describe('skip-reason-validator/validation', () => {
    const validateSkipComment = require('../lib/validation/validation');
    const patterns = [/banana/, /42/];

    it('should return true if any of patterns matches', () => {
        const comments = /banana/;

        assert(validateSkipComment(comments, patterns));
    });

    it('should return false if none of patterns matches', () => {
        const comments = 'something';

        assert.isNotOk(validateSkipComment(comments, patterns));
    });

    it('should return false if none of patterns matches', () => {
        const comments = 'something';

        assert.isNotOk(validateSkipComment(comments, patterns));
    });

    it('should return false if none of patterns matches', () => {
        const comments = 'something';

        assert.isNotOk(validateSkipComment(comments, []));
    });
});
