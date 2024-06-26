import { ListrTask, ListrRendererFactory } from 'listr2';
import { Context } from '../types.js'
import { captureScreenshots } from '../lib/screenshot.js'
import chalk from 'chalk';
import { updateLogContext } from '../lib/logger.js'

export default (ctx: Context): ListrTask<Context, ListrRendererFactory, ListrRendererFactory>  =>  {
    return {
        title: 'Capturing screenshots',
        task: async (ctx, task): Promise<void> => {
            try {
                ctx.task = task;
                updateLogContext({task: 'capture'});

                let { capturedScreenshots, output } = await captureScreenshots(ctx);
                if (capturedScreenshots != ctx.webStaticConfig.length) {
                    throw new Error(output)
                }
                task.title = 'Screenshots captured successfully'
            } catch (error: any) {
                ctx.log.debug(error);
                task.output = chalk.gray(`${error.message}`);
                throw new Error('Capturing screenshots failed');
            }
        },
        rendererOptions: { persistentOutput: true },
        exitOnError: false
    }
}