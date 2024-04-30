#!/usr/bin/env node
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
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

    if (projectDirectory === '.' || projectDirectory === '') {
      // If no specific directory is provided, or it's the current directory, use the default directory name
      const response = await prompts({
        type: 'text',
        name: 'dir',
        message: 'Enter your project directory:',
        initial: 'my-hats-project',
      });

      targetDir = path.resolve(process.cwd(), defaultTargetDir);
    } else {
      // Otherwise, resolve the provided directory name relative to the current working directory
      targetDir = path.resolve(process.cwd(), projectDirectory);
    }

    console.log(`Creating project at: ${targetDir}`);

    const projectName = path.basename(targetDir);

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
      questions as prompts.PromptObject<string>[]
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

    console.log(`Template chosen: ${responses.template}`); // This will show what the user selected
    console.log(`Template directory being checked: ${templateDir}`); // This will show the path being checked

    if (!fs.existsSync(templateDir)) {
      console.error(
        `The requested template "${responses.template}" does not exist.`
      );
      return;
    }

    try {
      await fs.promises.cp(templateDir, targetDir, { recursive: true });
      console.log(`Project created successfully in ${targetDir}`);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  });

cli.help();
cli.parse();
