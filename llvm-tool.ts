import path from 'path';

import fs from 'fs-extra';

import {BaseTool} from './base-tool';
import {logger} from '../logger';

export class LLVMTool extends BaseTool {
    static get key() {
        return 'llvm-tool';
    }

    override async runTool(
        compilationInfo: Record<any, any>,
        inputFilepath: string,
        args: string[],
        stdin: string,
    ) {
        const execOptions = this.getDefaultExecOptions();
        execOptions.input = stdin;

        const clangargs = ['-S', '-emit-llvm', '-x', 'c++', '-o /dev/stdout', '-'];
        args = ['-o /dev/stdout'].concat(args);

        try {
            const cresult = await this.exec('/usr/bin/clang-11', clangargs, execOptions);
            const transformedFilepath = inputFilepath ? cresult.filenameTransform(inputFilepath) : undefined;
            execOptions.input = this.parseOutput(cresult.stdout, transformedFilepath, /usr/bin/');
            const result = await this.exec(this.tool.exe, args, execOptions);
            return this.convertResult(result);
        } catch (e) {
            logger.error('Error while running tool: ', e);
            return this.createErrorResponse('Error while running tool');
        }
    }
}
