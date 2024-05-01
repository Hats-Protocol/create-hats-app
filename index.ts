#!/usr/bin/env node
import * as fs from 'node:fs';
import * as path from 'node:path';
import { cac } from 'cac';
import prompts from 'prompts';
import pc from 'picocolors';
import { templates } from './templates.js';

const cli = cac('create-hats-app');

cli
  .usage(`${pc.cyan('<project-directory>')} [options]`)
  .command('[project-directory]', 'Create a new project')
  .option('-t, --template [name]', 'Template to use. Options:', {
    default: 'next',
  })
  .action(async (projectDirectory = '.', options) => {
    const defaultTargetDir = 'my-hats-project';
    let targetDir;

    try {
      if (projectDirectory === '.' || projectDirectory === '') {
        const response = await prompts(
          {
            type: 'text',
            name: 'dir',
            message: 'Enter your project directory:',
            initial: 'my-hats-project',
          },
          {
            onCancel: () => {
              throw new Error('Operation cancelled by user.');
            },
          }
        );

        targetDir = path.resolve(
          process.cwd(),
          response.dir || defaultTargetDir
        );
      } else {
        targetDir = path.resolve(process.cwd(), projectDirectory);
      }

      console.log(`Creating project at: ${targetDir}`);

      const questions = [
        {
          type: 'select',
          name: 'template',
          message: 'Choose a template to use',
          choices: templates.map((t) => ({ title: t.display, value: t.name })),
          initial: 0,
        },
      ];

      const responses = await prompts(
        questions as prompts.PromptObject<string>[],
        {
          onCancel: () => {
            console.log(`${pc.red('✖')} Operation cancelled`);
            process.exit(1); // Exit with a non-zero status code
          },
        }
      );

      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      options.template = responses.template;

      const templateDir = path.resolve(
        process.cwd(),
        'templates',
        options.template
      );

      console.log(`Template chosen: ${responses.template}`);
      console.log(`Template directory being checked: ${templateDir}`);

      if (!fs.existsSync(templateDir)) {
        console.error(
          `The requested template "${responses.template}" does not exist.`
        );
        return;
      }

      await fs.promises.cp(templateDir, targetDir, { recursive: true });
      console.log(`Project created successfully in ${targetDir}`);
    } catch (error) {
      console.error((error as Error).message);
      return;
    }
  });

cli.help();
cli.parse();
