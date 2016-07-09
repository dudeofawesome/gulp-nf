'use strict';

if (process.env.TEST_ENV_VAR !== 'true' && process.env.TEST_ENV_VAR !== true) {
    throw new Error('TEST_ENV_VAR not found');
}
