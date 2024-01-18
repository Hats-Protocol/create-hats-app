import { Command } from 'commander';
import prompts, { PromptObject } from 'prompts';
import git from 'simple-git';

type Responses = {
  projectName: string;
};

// const getRepositoryUrl = (responses: Responses): string => {
//   if (responses.optionOne) {
//     return 'git-template-url';
//   } else {
//     return 'git-template-url';
//   }
// };

async function cloneRepository(
  repoUrl: string,
  projectName: string
): Promise<void> {
  const simpleGit = git();
  await simpleGit.clone(repoUrl, projectName);
}

const program = new Command();

program.description('💾').action(async () => {
  const questions: PromptObject<string>[] = [
    {
      type: 'text',
      name: 'projectName',
      message: 'Greetings Hacker! What is your project name? 💾',
      validate: (name) => (name ? true : 'Please enter a project name'),
    },
    {
      type: 'toggle',
      name: 'optionOne',
      message: 'Would you like to use (x)?',
      initial: false,
      active: 'yes',
      inactive: 'no',
    },
  ];

  // Prompt the user
  console.log('Greetings Hacker! What is your project name? 💾');
  const responses = (await prompts(questions)) as Responses;
  // const repoUrl = getRepositoryUrl(responses);
  // await cloneRepository(repoUrl, responses.projectName);
  console.log('Building your app. LFG! 🪄');
});

// Parse arguments
program.parse(process.argv);
