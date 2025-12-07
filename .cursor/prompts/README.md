# Reusable Prompts

This directory contains reusable prompt templates for common development tasks.

## Quick Reference

### Workflow Prompts
- **start-work.md** - Start working on an issue (create branch and begin work)
- **add-branch-todo.md** - Add branch creation to the top of todos
- **run-dev.md** - Run dev server, backend server, and Prisma Studio
- **commit-close.md** - Commit changes and close issue when complete
- **push-branch.md** - Push code to issue-specific branch
- **cleanup.md** - Checkout main, pull, and delete issue branch
- **delete-branch.md** - Delete issue-specific branch

### Creation Prompts
- **create-milestone.md** - Create detailed milestone for a problem
- **create-issue.md** - Create issue for solving a problem

### Format Templates
- **commit-format.md** - Commit message format template
- **issue-format.md** - Issue creation format template
- **milestone-format.md** - Milestone format template

## Usage

Reference these files in your prompts like:
- "Use the prompt from `.cursor/prompts/start-work.md`"
- "Follow the format in `.cursor/prompts/commit-format.md`"

Or simply copy the content and paste it into your conversation.

## Workflow Examples

### Starting Work on an Issue
1. Use `start-work.md` to create branch and begin work
2. Optionally use `add-branch-todo.md` to add branch creation to todos

### Completing an Issue
1. Use `commit-close.md` (references `commit-format.md`)
2. Use `push-branch.md` to push changes
3. Use `cleanup.md` to clean up (references `delete-branch.md`)

### Creating New Items
- Use `create-issue.md` with `issue-format.md`
- Use `create-milestone.md` with `milestone-format.md`
