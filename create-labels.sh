#!/bin/bash

# Script to create all labels for future-self-letters repository
REPO="Muadeel56/future-self-letters"

# Issue Type Labels
gh label create "bug" --repo $REPO --color d73a4a --description "Something isn't working" --force
gh label create "feature" --repo $REPO --color a2eeef --description "New feature or request" --force
gh label create "enhancement" --repo $REPO --color a2eeef --description "Improvement to existing feature" --force
gh label create "documentation" --repo $REPO --color 0075ca --description "Documentation improvements" --force
gh label create "question" --repo $REPO --color d876e3 --description "Further information is requested" --force
gh label create "refactor" --repo $REPO --color fbca04 --description "Code refactoring" --force
gh label create "chore" --repo $REPO --color 0e8a16 --description "Maintenance tasks" --force

# Priority Labels
gh label create "priority: critical" --repo $REPO --color b60205 --description "Blocks other work, urgent fix needed" --force
gh label create "priority: high" --repo $REPO --color d93f0b --description "Important, should be done soon" --force
gh label create "priority: medium" --repo $REPO --color fbca04 --description "Normal priority" --force
gh label create "priority: low" --repo $REPO --color 0e8a16 --description "Nice to have, can wait" --force

# Status Labels
gh label create "status: in progress" --repo $REPO --color 0052cc --description "Currently being worked on" --force
gh label create "status: blocked" --repo $REPO --color b60205 --description "Blocked by another issue" --force
gh label create "status: needs review" --repo $REPO --color fbca04 --description "Ready for review" --force
gh label create "status: on hold" --repo $REPO --color ededed --description "Temporarily paused" --force
gh label create "status: ready" --repo $REPO --color 0e8a16 --description "Ready to be worked on" --force

# Milestone Labels
gh label create "milestone: 1" --repo $REPO --color 1d76db --description "Project Setup & Foundation" --force
gh label create "milestone: 2" --repo $REPO --color 1d76db --description "Authentication" --force
gh label create "milestone: 3" --repo $REPO --color 1d76db --description "Write Letter Interface" --force
gh label create "milestone: 4" --repo $REPO --color 1d76db --description "Dashboard" --force
gh label create "milestone: 5" --repo $REPO --color 1d76db --description "Email Delivery System" --force
gh label create "milestone: 6" --repo $REPO --color 1d76db --description "Future Features" --force

# Component/Area Labels
gh label create "area: auth" --repo $REPO --color c5def5 --description "Authentication related" --force
gh label create "area: letters" --repo $REPO --color c5def5 --description "Letter creation/management" --force
gh label create "area: dashboard" --repo $REPO --color c5def5 --description "Dashboard features" --force
gh label create "area: email" --repo $REPO --color c5def5 --description "Email delivery system" --force
gh label create "area: database" --repo $REPO --color c5def5 --description "Database schema/queries" --force
gh label create "area: ui" --repo $REPO --color c5def5 --description "User interface" --force
gh label create "area: api" --repo $REPO --color c5def5 --description "API endpoints" --force
gh label create "area: security" --repo $REPO --color b60205 --description "Security related" --force
gh label create "area: performance" --repo $REPO --color fbca04 --description "Performance optimization" --force

# Contributor Labels
gh label create "good first issue" --repo $REPO --color 7057ff --description "Good for newcomers" --force
gh label create "help wanted" --repo $REPO --color 008672 --description "Extra attention is welcome" --force

# Special Labels
gh label create "duplicate" --repo $REPO --color cfd3d7 --description "This issue or pull request already exists" --force
gh label create "invalid" --repo $REPO --color e4e669 --description "This doesn't seem right" --force
gh label create "wontfix" --repo $REPO --color ffffff --description "This will not be worked on" --force
gh label create "needs-triage" --repo $REPO --color fbca04 --description "Needs to be triaged" --force

echo "All labels created successfully!"

