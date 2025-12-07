# Commit Message Format

Commit message format should follow this structure:

```
Commit message title.

Closes #<issue number>

Functionality completed in this issue.
```

Example:
```
Add authentication with JWT tokens.

Closes #6

- Implemented password hashing with bcryptjs
- Added JWT token generation and verification
- Created auth routes for register and login
- Added authentication middleware
```

**Related:** Use with `commit-close.md` when committing and closing an issue.

