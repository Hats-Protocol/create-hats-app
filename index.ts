#!/usr/bin/env node
import * as fs from 'node:fs';
import * as path from 'node:path';
import { cac } from 'cac';
import prompts from 'prompts';
import pc from 'picocolors';
import { templates } from './templates.js';
import { fileURLToPath } from 'node:url';

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

      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const templateDir = path.resolve(
        __dirname,
        '..',
        'templates',
        options.template
      );

      const prettyTargetDirectory = targetDir.split('/').pop();

      console.log(
        `\n 🎓 ${
          responses.template.charAt(0).toUpperCase() +
          responses.template.slice(1)
        } template being scaffolded in: ${pc.blue(
          `./${prettyTargetDirectory}`
        )}`
      );

      if (!fs.existsSync(templateDir)) {
        console.error(
          `\n ${pc.red('✖')}The requested template "${
            responses.template
          }" does not exist.`
        );
        return;
      }

      await fs.promises.cp(templateDir, targetDir, { recursive: true });
      console.log(`\n 🧢 Scaffolding complete. Time to build!`);
      console.log(
        `\n 🧢 Project created successfully in ${pc.blue(
          `./${prettyTargetDirectory}`
        )}`
      );
      console.log('\n 🧢 Run the following command to get started:');
      // console.log(
      //   pc.bgBlack(
      //     pc.green(`\n     cd ${prettyTargetDirectory}\n    pnpm install`) // can add in spaces after the \n
      //   )
      // );
      console.log(
        pc.green(
          `\n    ${pc.bgBlack(`cd ${prettyTargetDirectory}`)}\n    ${pc.bgBlack(
            'pnpm install'
          )}`
        ) // can add in spaces after the \n
      );
    } catch (error) {
      console.error((error as Error).message);
      return;
    }
  });

cli.help();
cli.parse();
