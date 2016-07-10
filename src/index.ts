import {spawn, SpawnOptions, ChildProcess} from 'child_process';
import * as stream from 'stream';
import * as Promise from 'bluebird';
import {log, PluginError, File} from 'gulp-util';
import * as Through from 'through2';
import * as Chalk from 'chalk';

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

export interface IForemanConfig {
    cwd?: string;
    procFile?: string;
    envFile?: string;
    port?: number;
    procs?: string | Array<string>;
};

export interface ForemanProcess extends ChildProcess {
    // public pid: number;
    // public stdin:  stream.Writable;
    // public stdout: stream.Readable;
    // public stderr: stream.Readable;
    // public stdio: [stream.Writable, stream.Readable, stream.Readable];
    //
    // constructor (
    //     private process
    // ) {}
    //
    // public disconect () {
    //
    // }
    //
    // public kill (signal?: string) {
    //
    // }
    //
    // public send (message: any, sendHandle?: any, options?: any): Promise<void | Error> {
    //     return new Promise<void | Error>((resolve, reject) => {
    //         resolve();
    //     });
    // }
}

export function Foreman (config?: IForemanConfig, saveOld: boolean = false): NodeJS.ReadWriteStream | ForemanProcess {
    if (!proc) {
        process.on('exit', cleanup);
        process.on('SIGINT', cleanup);
    }

    if (!config || (config && typeof config === 'object')) {
        // set config defaults
        if (config) {
            if (!config.cwd) {
                config.cwd = __dirname;
            }
            if (!config.procFile) {
                config.procFile = `${__dirname}/Procfile`;
            }
            if (!config.envFile) {
                config.envFile = `${__dirname}/.env`;
            }
        } else {
            config = {
                cwd: __dirname,
                procFile: `${__dirname}/Procfile`,
                envFile: `${__dirname}/.env`
            };
        }

        if (!saveOld && proc) {
            proc.kill('SIGHUP');
            proc = undefined;
        }

        const options: SpawnOptions = {
            cwd: config.cwd
        };
        const commands: Array<string> = [];

        commands.push('start');
        if (config.procFile) {
            commands.push('-j');
            commands.push(config.procFile);
        }
        if (config.envFile) {
            commands.push('-e');
            commands.push(config.envFile);
        }
        if (config.port) {
            commands.push('-p');
            commands.push(config.port.toString());
        }

        proc = spawn('nf', commands, options);

        proc.stderr.on('data', (data) => {
            process.stderr.write(`[${Chalk.gray(getDate())}] [${Chalk.green('Proc')}] ${Chalk.red(data)}`);
        });
        proc.stdout.on('data', (data) => {
            process.stdout.write(`[${Chalk.gray(getDate())}] [${Chalk.green('Proc')}] ${data}`);
        });

        return proc;
    } else {
        return Through.obj((file, encoding, callback) => {
            const foremanConf: IForemanConfig = {
                cwd: __dirname
            };

            callback(null, Foreman(foremanConf));
        });
    }
};

function cleanup () {
    if (proc) {
        proc.kill('SIGHUP');
    }
}
