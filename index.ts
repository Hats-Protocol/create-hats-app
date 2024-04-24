import { Command } from 'commander';
import prompts, { PromptObject } from 'prompts';
import fs from 'fs-extra';
import path from 'path';
import { templates } from './templates'; // Make sure this path is correct

interface Responses {
  projectName: string;
  template: string;
}

const program = new Command();

program
  .name('create-hats-app')
  .description(
    'CLI to scaffold Hats ecosystem projects using pre-defined templates with common frameworks.'
  )
  .version('1.0.0');

program
  .command('new')
  .description('Create a new project')
  .action(async () => {
    const questions: PromptObject<string>[] = [
      {
        type: 'text',
        name: 'projectName',
        message: 'What is your project name?',
        validate: (name) => (name ? true : 'Project name is required'),
      },
      {
        type: 'select',
        name: 'template',
        message: 'Choose a template to use',
        choices: templates.map((template) => ({
          title: template.display,
          value: template.name,
        })),
        initial: 0,
      },
    ];

    console.log('Welcome to create-hats-app! Let’s set up your new project.');
    const responses: Responses = await prompts(questions);

    const templatesDir = path.join(__dirname, 'templates');
    const sourceDir = path.join(templatesDir, responses.template);
    const targetDir = path.join(process.cwd(), responses.projectName);

    if (!fs.existsSync(sourceDir)) {
      console.error(
        `The requested template "${responses.template}" does not exist.`
      );
      return;
    }

    try {
      await fs.copy(sourceDir, targetDir);
      console.log(
        `Project ${responses.projectName} created successfully in ${targetDir}`
      );
    } catch (error) {
      console.error('Error creating project:', error);
    }
  });

program.parse(process.argv);
