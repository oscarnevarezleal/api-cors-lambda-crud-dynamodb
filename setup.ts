import * as childProcess from 'child_process';
import * as fs from 'fs-extra';
import * as os from 'os';

export const NODE_LAMBDA_LAYER_DIR = `./bundle`;
export const NODE_LAMBDA_LAYER_RUNTIME_DIR_NAME = `nodejs`;


export const bundleNpm = () => {
  // create bundle directory
  copyPackageJson();

  // install package.json (production)
  // -f because of the name conflicts
  childProcess.execSync(`npm install --production -f`, {
    stdio: ['ignore', 'inherit', 'inherit'],
    env: {...process.env},
    cwd: getModulesInstallDirName(),
    shell: os.platform() === 'win32' ? 'powershell.exe' : 'bash'
  });
};

const copyPackageJson = () => {

  // copy package.json and package.lock.json
  fs.mkdirsSync(getModulesInstallDirName());
  ['package.json'] //, 'package-lock.json'
    .map(file => fs.copyFileSync(`${process.cwd()}/${file}`, `${getModulesInstallDirName()}/${file}`));

};

const getModulesInstallDirName = (): string => {
  return `${NODE_LAMBDA_LAYER_DIR}/${NODE_LAMBDA_LAYER_RUNTIME_DIR_NAME}`;
};
