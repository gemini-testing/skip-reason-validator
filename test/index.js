'use strict';

const proxyquire = require('proxyquire').noCallThru();

const EventEmitter = require('events').EventEmitter;

describe('skip-reason-validator/index', () => {
    let validationStub, hermioneValidation, hermione;

    const _mkValidationResults = (result = [{browserId: 'bro', skipReason: 'reason', title: 'ololo'}]) => validationStub.returns(result);

    const _mkHermione = () => {
        hermione = new EventEmitter();
        hermione.events = {
            INIT: 'fooBarInit',
            AFTER_TESTS_READ: 'fooBarAfterTestsRead',
            TEST_PENDING: 'fooBarTestPending',
            TEST_FAIL: 'fooBarTestFail',
            TEST_PASS: 'fooBarTestPass',
            RETRY: 'fooBarRetry',
            RUNNER_END: 'fooBarRunnerEnd'
        };
    };

    const _mkCollection = (tests = [{}]) => ({
        eachTest: (cb) => tests.forEach((test) => cb(test))
    });

    const emitAfterTestRead = (collection = _mkCollection()) => {
        hermione.emit(hermione.events.AFTER_TESTS_READ, collection);
    };

    beforeEach(() => {
        _mkHermione();
        validationStub = sinon.stub();

        hermioneValidation = proxyquire('../lib/index', {
            './validation/hermione-invalid-skips': validationStub,
            './config': (conf) => conf,
            'chalk': {red: (text) => text}
        });

        sinon.stub(console, 'error');
        sinon.stub(process, 'exit');
    });

    afterEach(() => {
        console.error.restore();
        process.exit.restore();
    });

    it('should call validation with valid pattern', () => {
        const testsCollection = _mkCollection();

        hermioneValidation(hermione, {enabled: true, pattern: ['banana']});
        _mkValidationResults();
        emitAfterTestRead(testsCollection);
        assert.calledWith(validationStub, testsCollection, ['banana']);
    });

    it('should do nothing if plugin is disabled', () => {
        hermioneValidation(hermione, {enabled: false, pattern: ['banana']});
        _mkValidationResults();
        emitAfterTestRead('banana');

        assert.notCalled(console.error);
    });

    it('should do nothing on empty invalid skip list', () => {
        _mkValidationResults([]);

        hermioneValidation(hermione, {enabled: true, pattern: ['banana']});
        emitAfterTestRead('banana');

        assert.notCalled(console.error);
    });

    it('should write error message if invalid skips found', () => {
        const testsCollection = _mkCollection();

        hermioneValidation(hermione, {enabled: true, pattern: ['banana']});
        _mkValidationResults();
        emitAfterTestRead(testsCollection);

        assert.calledWith(console.error, 'Skipped tests do not match the pattern: banana\nololo [bro]: "reason"');
    });
});
