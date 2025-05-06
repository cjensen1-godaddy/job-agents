// Commands for Action Flows project in Cursor
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execPromise = promisify(exec);

// Path to the code mode file
const CODE_MODE_FILE = path.join(process.cwd(), '.github', 'code-mode.md');
const TODO_FILE = path.join(process.cwd(), '.github', 'TODO.md');

// Helper to ensure directories exist
function ensureDirExists(filePath) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

// Helper to read current mode
function getCurrentMode() {
  if (!fs.existsSync(CODE_MODE_FILE)) {
    return {
      modeName: 'Code Monkey',
      modeShortname: 'monkey',
      fenced: false,
      fencedDirectory: 'N/A'
    };
  }

  const content = fs.readFileSync(CODE_MODE_FILE, 'utf8');
  const modeMatch = content.match(/Mode: (.+) \((.+)\)/);
  const fencedMatch = content.match(/Fenced: (Yes|No)/);
  const dirMatch = content.match(/Fenced Directory: (.+)/);

  return {
    modeName: modeMatch ? modeMatch[1] : 'Code Monkey',
    modeShortname: modeMatch ? modeMatch[2] : 'monkey',
    fenced: fencedMatch ? fencedMatch[1] === 'Yes' : false,
    fencedDirectory: dirMatch ? dirMatch[1] : 'N/A'
  };
}

// Helper to update mode file
function updateModeFile(modeName, modeShortname, fenced, fencedDirectory) {
  ensureDirExists(CODE_MODE_FILE);

  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const content = `# Current Mode

Mode: ${modeName} (${modeShortname})
Fenced: ${fenced ? 'Yes' : 'No'}
Fenced Directory: ${fenced ? fencedDirectory : 'N/A'}

Last updated: ${today}
`;

  fs.writeFileSync(CODE_MODE_FILE, content, 'utf8');
}

// Helper to ensure TODO.md exists
function ensureTodoExists() {
  if (!fs.existsSync(TODO_FILE)) {
    ensureDirExists(TODO_FILE);
    const initialContent = `# TODO Tasks

## MUST - Critical Requirements

## SHOULD - Important Requirements

## COULD - Desirable Features

## WON'T - Out of Scope for Current Work

`;
    fs.writeFileSync(TODO_FILE, initialContent, 'utf8');
  }
}

// Mode switching commands
module.exports.enable_code_monkey_mode = async ({ cursor, terminal }) => {
  const currentMode = getCurrentMode();
  updateModeFile('Code Monkey', 'monkey', currentMode.fenced, currentMode.fencedDirectory);

  await cursor.chat.sendText("Please switch to Code Monkey mode.");
};

module.exports.enable_quality_angel_mode = async ({ cursor, terminal }) => {
  const currentMode = getCurrentMode();
  updateModeFile('Quality Angel', 'angel', currentMode.fenced, currentMode.fencedDirectory);

  await cursor.chat.sendText("Please switch to Quality Angel mode.");
};

module.exports.enable_requirements_guru_mode = async ({ cursor, terminal }) => {
  const currentMode = getCurrentMode();
  updateModeFile('Requirements Guru', 'guru', currentMode.fenced, currentMode.fencedDirectory);
  ensureTodoExists();

  await cursor.chat.sendText("Please switch to Requirements Guru mode.");
};

module.exports.enable_task_rabbit_mode = async ({ cursor, terminal }) => {
  const currentMode = getCurrentMode();
  updateModeFile('Task Rabbit', 'rabbit', currentMode.fenced, currentMode.fencedDirectory);
  ensureTodoExists();

  await cursor.chat.sendText("Please switch to Task Rabbit mode.");
};

module.exports.enable_code_review_coach_mode = async ({ cursor, terminal }) => {
  const currentMode = getCurrentMode();
  updateModeFile('Code Review Coach', 'coach', currentMode.fenced, currentMode.fencedDirectory);

  await cursor.chat.sendText("Please switch to Code Review Coach mode.");
};

// Fencing commands
module.exports.fence_to_directory = async ({ cursor, terminal }) => {
  const currentMode = getCurrentMode();

  // Ask the user for the directory to fence to
  const response = await cursor.chat.sendText("Please specify which directory you'd like to fence me to.");

  // Wait for user response
  const message = await cursor.chat.waitForNextMessage();
  const directory = message.content.trim();

  // Update the mode file with the new fencing
  updateModeFile(currentMode.modeName, currentMode.modeShortname, true, directory);

  await cursor.chat.sendText(`I'm now fenced to the ${directory} directory.`);
};

module.exports.remove_fencing = async ({ cursor, terminal }) => {
  const currentMode = getCurrentMode();

  // Update the mode file to remove fencing
  updateModeFile(currentMode.modeName, currentMode.modeShortname, false, 'N/A');

  await cursor.chat.sendText("Fencing has been removed. I can now make changes across the entire codebase.");
};

// Quality check commands
module.exports.run_quality_checks = async ({ cursor, terminal }) => {
  await cursor.chat.sendText("I'll run the quality checks for the Action Flows project.");
};

module.exports.check_code_coverage = async ({ cursor, terminal }) => {
  await cursor.chat.sendText("I'll check the code coverage for the Action Flows project.");
};
