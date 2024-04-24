#!/usr/bin/env node
import * as fs from 'fs-extra';
import * as path from 'path';
import { cac } from 'cac';
import prompts from 'prompts';
import { templates } from './templates';

const cli = cac('create-hats-app');

cli
  .command('[project-directory]', 'Create a new project')
  .option('-t, --template [name]', 'Template to use. Options:')
  .action(async (projectDirectory = '.', options) => {
    const targetDir = path.resolve(projectDirectory);
    const projectName = path.basename(targetDir);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

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
    const templateDir = path.join(__dirname, 'templates', responses.template);

    if (!fs.existsSync(templateDir)) {
      console.error(
        `The requested template "${responses.template}" does not exist.`
      );
      return;
    }

    try {
      await fs.copy(templateDir, targetDir);
      console.log(`Project created successfully in ${targetDir}`);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  });

cli.help();
cli.parse();
