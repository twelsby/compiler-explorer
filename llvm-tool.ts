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
        inputFilepath?: string,
        args?: string[],
        stdin: string,
    ) {
        const execOptions = this.getDefaultExecOptions();
        execOptions.input = stdin;

        args = ['-S', '-emit-llvm', '-x', 'c++', '-o /dev/stdout', '|', this.tool.exe, '-o /dev/stdout'].concat(args);

        try {
            const result = await this.exec('/usr/bin/clang-11', args, execOptions);
            return this.convertResult(result);
        } catch (e) {
            logger.error('Error while running tool: ', e);
            return this.createErrorResponse('Error while running tool');
        }
    }
}
