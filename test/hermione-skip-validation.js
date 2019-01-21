'use strict';

const proxyquire = require('proxyquire');

describe('skip-reason-validator', () => {
    let validationStub, hermioneValidation;

    const _mkStubTest = (title, skipReason, pending = true, silentSkip = false) => ({
        fullTitle: () => title,
        silentSkip,
        skipReason,
        pending,
        browserId: 'browser'
    });

    const _mkHermioneTests = (tests = [{}]) => {
        return {
            eachTest: (cb) => tests.forEach((test) => cb(test))
        };
    };

    beforeEach(() => {
        validationStub = sinon.stub();

        hermioneValidation = proxyquire('../lib/validation/hermione-invalid-skips', {
            './validation': validationStub
        });
    });

    it('should return found tests with invalid skip reason', () => {
        const patternList = ['banana'];
        const tests = [_mkStubTest('valid', 'banana'), _mkStubTest('notvalid', 'notbanana')];

        validationStub.withArgs('banana', patternList).returns(true);

        const actual = hermioneValidation(_mkHermioneTests(tests), patternList);

        assert.deepEqual(actual, [{title: 'notvalid', browserId: 'browser', skipReason: 'notbanana'}]);
    });

    it('should not validate not pending tests', () => {
        const patternList = ['banana'];

        validationStub.withArgs('banana', patternList).returns(true);

        assert.notCalled(validationStub);
    });

    it('should return empty array if all tests are valid', () => {
        const patternList = ['banana'];
        const tests = [_mkStubTest('valid', 'banana'), _mkStubTest('also valid', 'banana')];

        validationStub.withArgs('banana', patternList).returns(true);

        const actual = hermioneValidation(_mkHermioneTests(tests), patternList);

        assert.isEmpty(actual);
    });

    it('should return empty array on empty tests set', () => {
        const patternList = ['banana'];

        validationStub.withArgs('banana', patternList).returns(true);

        const actual = hermioneValidation(_mkHermioneTests(), patternList);

        assert.isEmpty(actual);
    });
});
