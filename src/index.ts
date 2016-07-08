import {log, PluginError, File} from 'gulp-util';
import * as through from 'through2';

export interface IForemanConfig {
    cwd: string;
    procFile: string;
    envFile: string;
    port: number;
};

export function Foreman (config: IForemanConfig): void | File {
    return;
};
