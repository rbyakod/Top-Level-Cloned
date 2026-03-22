#!/usr/bin/env node
/**
 * Session Check (Stop Hook)
 *
 * Runs at the end of each Claude response.
 * Periodic reminders for wrap-up and learning capture.
 * Based on Twitter thread: "DevOps agent with /wrap-up command"
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

function getTempDir() {
  return path.join(os.tmpdir(), 'pro-workflow');
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function log(msg) {
  console.error(msg);
}

async function main() {
  const tempDir = getTempDir();
  ensureDir(tempDir);

  const sessionId = process.env.CLAUDE_SESSION_ID || process.ppid || 'default';
  const responseCountFile = path.join(tempDir, `response-count-${sessionId}`);
  const lastReminderFile = path.join(tempDir, `last-reminder-${sessionId}`);

  let count = 1;

  if (fs.existsSync(responseCountFile)) {
    count = parseInt(fs.readFileSync(responseCountFile, 'utf8').trim(), 10) + 1;
  }

  fs.writeFileSync(responseCountFile, String(count));

  // Check if we should show a reminder (every 20 responses)
  const shouldRemind = count % 20 === 0;

  // Alternate between different reminders
  if (shouldRemind) {
    const reminderType = Math.floor(count / 20) % 3;

    switch (reminderType) {
      case 0:
        log('[ProWorkflow] Consider /wrap-up if ending session soon');
        break;
      case 1:
        log('[ProWorkflow] Any corrections to capture? Use /learn-rule');
        break;
      case 2:
        log('[ProWorkflow] Good checkpoint for /compact if context is heavy');
        break;
    }
  }

  // At 50 responses, stronger reminder
  if (count === 50) {
    log('[ProWorkflow] Long session - strongly consider:');
    log('[ProWorkflow]   /wrap-up - capture learnings');
    log('[ProWorkflow]   /compact - preserve context');
  }

  process.exit(0);
}

main().catch(err => {
  console.error('[ProWorkflow] Error:', err.message);
  process.exit(0);
});
