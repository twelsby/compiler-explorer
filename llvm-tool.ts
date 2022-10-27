import path from 'path';

import fs from 'fs-extra';

import {BaseTool} from './base-tool';

export class ClangQueryTool extends BaseTool {
    static get key() {
        return 'clang-query-tool';
    }

    constructor(toolInfo, env) {
        super(toolInfo, env);

        this.addOptionsToToolArgs = false;
    }

    async runTool(compilationInfo, inputFilepath, args, stdin) {
        const sourcefile = inputFilepath;
        const compilerExe = compilationInfo.compiler.exe;
        const options = compilationInfo.options;
        const dir = path.dirname(sourcefile);

        const compileFlags = options.filter(option => option !== sourcefile);
        if (!compilerExe.includes('clang++')) {
            compileFlags.push(this.tool.options);
        }

        const query_commands_file = this.getUniqueFilePrefix() + 'query_commands.txt';

        await fs.writeFile(path.join(dir, 'compile_flags.txt'), compileFlags.join('\n'));
        await fs.writeFile(path.join(dir, query_commands_file), stdin);
        args.push('-f', query_commands_file);
        const toolResult = await super.runTool(compilationInfo, sourcefile, args);

        if (toolResult.stdout.length > 0) {
            const lastLine = toolResult.stdout.length - 1;
            toolResult.stdout[lastLine].text = toolResult.stdout[lastLine].text.replace(/(clang-query>\s)/gi, '');
        }

        return toolResult;
    }
}
