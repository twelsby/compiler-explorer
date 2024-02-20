import path from 'path';

import fs from 'fs-extra';

import {BaseTool} from './base-tool.js';

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
        const clangargs = ['-S', '-emit-llvm', '-o-', inputFilepath];

        try {
            const cresult = await this.exec('/usr/bin/clang-11', clangargs, execOptions);
            execOptions.input = cresult.stdout;
            const result = await this.exec(this.tool.exe, args, execOptions);
            return this.convertResult(result);
        } catch (e) {
            return this.createErrorResponse('Error while running tool');
        }
    }
}
