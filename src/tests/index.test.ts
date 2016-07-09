import 'source-map-support/register';

import {expect} from 'chai';
import * as Promise from 'bluebird';
import {ChildProcess} from 'child_process';

import {Foreman, ForemanProcess, IForemanConfig} from '../';

(() => {
    describe('Gulp NF', () => {
        it('should launch a process (default settings, no VFS)', (done) => {
            const child: ChildProcess = (Foreman() as ChildProcess);
            done();

            // const testMsg = 'test 001';
            // child.on('message', (msg) => {
            //     expect(msg).to.equal(`index: ${testMsg}`);
            //     done();
            // });
            // child.send(testMsg);
        });

        it('should launch a process (custom settings, no VFS)', (done) => {
            const child: ChildProcess = (Foreman({
                cwd: `${process.cwd()}/src/tests`,
                procFile: `${process.cwd()}/src/tests/Procfile`,
                envFile: `${process.cwd()}/src/tests/.env`
            }) as ChildProcess);

            child.stdout.on('data', (msg: string) => {
                if (msg.indexOf('Exited Successfully') >= 0) {
                    done();
                }
            });
            child.stderr.on('data', (msg: string) => {
                done(msg);
            });
        });
    });
})();
