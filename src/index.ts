import { execSync } from 'child_process';
import { existsSync, readdirSync, readFileSync, writeFileSync, statSync, unlinkSync, rmSync } from 'fs';
import { join, resolve } from 'path';
import { createInterface } from 'readline';

const TEMPLATE_REPO = 'https://github.com/raulgcode/monolith.git';

const COLORS = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function log(msg: string) {
  console.log(msg);
}

function success(msg: string) {
  log(`${COLORS.green}✔${COLORS.reset} ${msg}`);
}

function info(msg: string) {
  log(`${COLORS.cyan}ℹ${COLORS.reset} ${msg}`);
}

function error(msg: string) {
  log(`${COLORS.red}✖${COLORS.reset} ${msg}`);
}

function step(num: number, total: number, msg: string) {
  log(`\n${COLORS.cyan}[${num}/${total}]${COLORS.reset} ${COLORS.bold}${msg}${COLORS.reset}`);
}

function ask(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((res) => {
    rl.question(`${COLORS.cyan}?${COLORS.reset} ${question} `, (answer) => {
      rl.close();
      res(answer.trim());
    });
  });
}

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

function run(cmd: string, cwd: string) {
  execSync(cmd, { stdio: 'inherit', cwd });
}

function getAllFiles(dir: string, files: string[] = []): string[] {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    if (entry === 'node_modules' || entry === '.git' || entry === 'pnpm-lock.yaml') continue;
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      getAllFiles(fullPath, files);
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

function replaceInFile(filePath: string, replacements: [string, string][]) {
  try {
    let content = readFileSync(filePath, 'utf-8');
    let changed = false;
    for (const [search, replace] of replacements) {
      const regex = new RegExp(escapeRegExp(search), 'g');
      const newContent = content.replace(regex, replace);
      if (newContent !== content) {
        content = newContent;
        changed = true;
      }
    }
    if (changed) {
      writeFileSync(filePath, content);
    }
  } catch {
    // Skip binary files
  }
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parseArgs(): { projectName?: string; yes: boolean; noSetup: boolean } {
  const args = process.argv.slice(2);
  let projectName: string | undefined;
  let yes = false;
  let noSetup = false;

  for (const arg of args) {
    if (arg === '-y' || arg === '--yes') {
      yes = true;
    } else if (arg === '--no-setup') {
      noSetup = true;
    } else if (!arg.startsWith('-')) {
      projectName = arg;
    }
  }

  return { projectName, yes, noSetup };
}

export async function main() {
  log('');
  log(`${COLORS.bold}${COLORS.cyan}  create-monolith-app${COLORS.reset}`);
  log(`${COLORS.dim}  Full-stack monorepo scaffolder${COLORS.reset}`);
  log('');

  const { projectName: argName, yes: useDefaults, noSetup } = parseArgs();

  // Get project name
  let projectName = argName;
  if (!projectName) {
    projectName = await ask('What is your project name?');
  }

  if (!projectName) {
    error('Project name is required.');
    log(`  Usage: ${COLORS.cyan}npx create-monolith-app${COLORS.reset} <project-name> [--yes] [--no-setup]`);
    process.exit(1);
  }

  const kebabName = toKebabCase(projectName);
  const pascalName = toPascalCase(projectName);
  const projectPath = resolve(process.cwd(), kebabName);

  if (existsSync(projectPath)) {
    error(`Directory "${kebabName}" already exists.`);
    process.exit(1);
  }

  let dbUser: string;
  let dbPassword: string;
  let dbName: string;
  let shouldSetup: boolean;

  if (useDefaults) {
    dbUser = kebabName;
    dbPassword = `${kebabName}_dev`;
    dbName = `${kebabName}_db`;
    shouldSetup = !noSetup;

    info(`Using defaults:`);
    log(`  Project:  ${COLORS.bold}${kebabName}${COLORS.reset}`);
    log(`  DB User:  ${dbUser}`);
    log(`  DB Pass:  ${dbPassword}`);
    log(`  DB Name:  ${dbName}`);
    log(`  Setup:    ${shouldSetup ? 'yes' : 'no'}`);
  } else {
    dbUser = (await ask(`Database user? ${COLORS.dim}(${kebabName})${COLORS.reset}`)) || kebabName;
    dbPassword =
      (await ask(`Database password? ${COLORS.dim}(${kebabName}_dev)${COLORS.reset}`)) ||
      `${kebabName}_dev`;
    dbName =
      (await ask(`Database name? ${COLORS.dim}(${kebabName}_db)${COLORS.reset}`)) ||
      `${kebabName}_db`;

    if (noSetup) {
      shouldSetup = false;
    } else {
      const runSetupAnswer = (await ask(`Run setup after scaffolding? (Y/n)`)) || 'Y';
      shouldSetup = runSetupAnswer.toLowerCase() !== 'n';
    }
  }

  log('');
  info(`Creating ${COLORS.bold}${kebabName}${COLORS.reset} ...`);
  log('');

  // Step 1: Clone template
  const totalSteps = shouldSetup ? 5 : 4;
  step(1, totalSteps, 'Downloading template...');
  try {
    execSync(`git clone --depth 1 ${TEMPLATE_REPO} "${projectPath}"`, { stdio: 'pipe' });
  } catch {
    error('Failed to clone template. Make sure git is installed and you have internet access.');
    process.exit(1);
  }
  success('Template downloaded.');

  // Step 2: Remove .git and reinitialize
  step(2, totalSteps, 'Initializing git...');
  const gitPath = join(projectPath, '.git');
  if (existsSync(gitPath)) {
    rmSync(gitPath, { recursive: true, force: true });
  }
  execSync('git init', { stdio: 'pipe', cwd: projectPath });
  success('Git initialized.');

  // Step 3: Replace all references
  step(3, totalSteps, `Renaming to "${kebabName}"...`);

  const files = getAllFiles(projectPath);
  const replacements: [string, string][] = [
    // Package scoped names
    ['@monolith/', `@${kebabName}/`],
    // Docker container name
    ['monolith-postgres', `${kebabName}-postgres`],
    // DB credentials in docker-compose
    ['POSTGRES_USER: monolith', `POSTGRES_USER: ${dbUser}`],
    ['POSTGRES_PASSWORD: monolith_dev', `POSTGRES_PASSWORD: ${dbPassword}`],
    ['POSTGRES_DB: monolith_db', `POSTGRES_DB: ${dbName}`],
    ['pg_isready -U monolith', `pg_isready -U ${dbUser}`],
    // DATABASE_URL
    [
      'postgresql://monolith:monolith_dev@localhost:5432/monolith_db',
      `postgresql://${dbUser}:${dbPassword}@localhost:5432/${dbName}`,
    ],
    // Root package name
    ['"name": "monolith"', `"name": "${kebabName}"`],
    // Navbar brand
    ['Monolith', pascalName],
    // Admin email
    ['admin@monolith.dev', `admin@${kebabName}.dev`],
  ];

  for (const filePath of files) {
    replaceInFile(filePath, replacements);
  }

  // Remove lockfile so pnpm install runs fresh
  const lockFile = join(projectPath, 'pnpm-lock.yaml');
  if (existsSync(lockFile)) {
    unlinkSync(lockFile);
  }

  success(`Project renamed to "${kebabName}".`);

  // Step 4: Configure environment
  step(4, totalSteps, 'Configuring environment...');
  const envExamplePath = join(projectPath, '.env.example');
  if (existsSync(envExamplePath)) {
    let envContent = readFileSync(envExamplePath, 'utf-8');
    envContent = envContent.replace(
      /DATABASE_URL="[^"]*"/,
      `DATABASE_URL="postgresql://${dbUser}:${dbPassword}@localhost:5432/${dbName}"`,
    );
    writeFileSync(envExamplePath, envContent);
  }
  success('Environment configured.');

  // Step 5: Run setup
  if (shouldSetup) {
    step(5, totalSteps, 'Running setup...');
    log('');
    try {
      run('pnpm setup', projectPath);
    } catch {
      log('');
      error('Setup failed. You can run it manually later with: pnpm setup');
    }
  }

  // Done
  log('');
  log(`${COLORS.green}${COLORS.bold}  ✔ Project created successfully!${COLORS.reset}`);
  log('');
  log(`  ${COLORS.dim}Next steps:${COLORS.reset}`);
  log(`  ${COLORS.cyan}cd${COLORS.reset} ${kebabName}`);
  if (!shouldSetup) {
    log(`  ${COLORS.cyan}pnpm setup${COLORS.reset}`);
  }
  log(`  ${COLORS.cyan}pnpm dev${COLORS.reset}`);
  log('');
  log(`  ${COLORS.dim}Default credentials:${COLORS.reset}`);
  log(`  Email:    admin@${kebabName}.dev`);
  log(`  Password: Admin123!`);
  log('');
}
