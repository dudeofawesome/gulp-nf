import {spawn, SpawnOptions, ChildProcess} from 'child_process';
import * as stream from 'stream';
import * as Promise from 'bluebird';
import {log, PluginError, File} from 'gulp-util';
import * as Through from 'through2';
import * as Chalk from 'chalk';

export interface IForemanConfig {
    cwd?: string;
    procFile?: string;
    envFile?: string;
    port?: number;
    procs?: string | Array<string>;
};

export interface ForemanProcess extends ChildProcess {
//     public pid: number;
//     public stdin:  stream.Writable;
//     public stdout: stream.Readable;
//     public stderr: stream.Readable;
//     public stdio: [stream.Writable, stream.Readable, stream.Readable];
//
//     constructor (
//         private process
//     ) {}
//
//     public disconect () {
//
//     }
//
//     public kill (signal?: string) {
//
//     }
//
//     public send (message: any, sendHandle?: any, options?: any): Promise<void | Error> {
//         return new Promise<void | Error>((resolve, reject) => {
//             resolve();
//         });
//     }
}

export function Foreman (config: IForemanConfig): Promise<ForemanProcess> {
    return new Promise<ForemanProcess>((resolve, reject) => {
        proc = spawn('nf', ['start']);
        proc.stderr.on('data', (data) => {
            process.stdout.write(`[${Chalk.gray(getDate())}] [${Chalk.green('Proc')}] ${Chalk.red(data)}`);
        });
        proc.stdout.on('data', (data) => {
            process.stdout.write(`[${Chalk.gray(getDate())}] [${Chalk.green('Proc')}] ${data}`);
        });

        return proc;
    });
};





let proc: ForemanProcess;
function getDate (date?) {
    date = date || new Date();
    let hours = date.getHours();
    hours = hours < 10 ? '0' + hours : hours;
    let minutes = date.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let seconds = date.getSeconds();
    seconds = seconds < 10 ? '0' + seconds : seconds;
    return hours + ':' + minutes + ':' + seconds;
};

if (proc) {
    proc.kill('SIGHUP');
    proc = undefined;
}
