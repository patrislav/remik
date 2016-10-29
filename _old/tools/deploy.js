
import GitRepo from 'git-repository';
import run from './run';
import fs from './lib/fs';

const remote = {
  name: 'heroku',
  repoUrl: {
    production: 'https://git.heroku.com/remik.git',
    staging: 'https://git.heroku.com/remik-staging.git',
    development: 'https://git.heroku.com/remik-development.git'
  }
}

async function deploy() {
  const NODE_ENV = process.env.NODE_ENV;

  await fs.makeDir(`build/${NODE_ENV}`);

  // Initialize a new Git repository in the build directory if it doesn't exist
  const repo = await GitRepo.open(`build/${NODE_ENV}`, { init: true });
  await repo.setRemote(remote.name, remote.repoUrl[NODE_ENV]);

  // Fetch the remote repository if it exists
  if ((await repo.hasRef(remote.repoUrl[NODE_ENV], 'master'))) {
    await repo.fetch(remote.name);
    await repo.reset(`${remote.name}/master`, { hard: true });
    await repo.clean({ force: true });
  }

  // Build the project
  await run(require('./build'));

  // Push the contents of the build folder to the remote server via Git
  await repo.add('--all .');
  await repo.commit('Update');
  await repo.push(remote.name, 'master');
}

export default deploy;
