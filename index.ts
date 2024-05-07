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
              throw new Error(`${pc.red('✖')} Operation cancelled by user.`);
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

      const questions = [
        {
          type: 'select',
          name: 'template',
          message: 'Choose a template to use',
          choices: templates.map((template) => ({
            title: template.color(template.display),
            value: template.name,
          })),
          initial: 0,
        },
      ];

      const responses = await prompts(
        questions as prompts.PromptObject<string>[],
        {
          onCancel: () => {
            throw new Error(`\n ${pc.red('✖')} Operation cancelled by user.`);
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

      console.log(
        `\n ⚙️ ${responses.template} template being scaffolded in: ${targetDir}`
      );

      if (!fs.existsSync(templateDir)) {
        console.error(
          `The requested template "${responses.template}" does not exist.`
        );
        return;
      }

      await fs.promises.cp(templateDir, targetDir, { recursive: true });
      console.log(`\n 🧢 Scaffolding complete. Time to build!`);
      console.log(`\n 🧢 Project created successfully in ${targetDir}`);
      console.log(`\n 🧢 cd into ${targetDir} and run pnpm install`);
    } catch (error) {
      console.error((error as Error).message);
      return;
    }
  });

cli.help();
cli.parse();
