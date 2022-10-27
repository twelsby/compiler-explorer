import path from 'path';

import fs from 'fs-extra';

import {BaseTool} from './base-tool';
import {logger} from '../logger';

export class LLVMTool extends BaseTool {
    static get key() {
        return 'llvm-tool';
    }

    constructor(toolInfo, env) {
        super(toolInfo, env);

        this.addOptionsToToolArgs = false;
    }

    async runTool(
        compilationInfo: Record<any, any>,
        inputFilepath?: string,
        args?: string[],
        stdin?: string,
        supportedLibraries?: Record<string, Library>,
    ) {
        if (this.tool.name) {
            toolCounter.inc({
                language: compilationInfo.compiler.lang,
                name: this.tool.name,
            });
        }
        const execOptions = this.getDefaultExecOptions();
        if (inputFilepath) execOpt
        ions.customCwd = path.dirname(inputFilepath);
        execOptions.input = stdin;

        args = ['-S', '-emit-llvm', '-x', '-o /dev/stdout', '|', this.tool.exe, '-o /dev/stdout'].concat(args);
        if (this.addOptionsToToolArgs) args = this.tool.options.concat(args);
        if (inputFilepath) args.push(inputFilepath);

        const exeDir = path.dirname(this.tool.exe);

        try {
            const result = await this.exec('/usr/bin/clang-11', args, execOptions);
            return this.convertResult(result, inputFilepath, exeDir);
        } catch (e) {
            logger.error('Error while running tool: ', e);
            return this.createErrorResponse('Error while running tool');
        }
    }
}
