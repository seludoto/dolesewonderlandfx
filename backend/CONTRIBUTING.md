# Contributing to DoleSe Wonderland FX Backend

Thank you for your interest in contributing to DoleSe Wonderland FX Backend! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- Git
- Code editor (VS Code recommended)

### Setup Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/yourusername/dolesewonderlandfx.git
   cd dolesewonderlandfx/backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create `.env` file (see `.env.example`)
5. Run database migrations:
   ```bash
   npm run db:migrate
   ```
6. Start development server:
   ```bash
   npm run dev
   ```

## Development Workflow

### Branching Strategy

- `main` - production-ready code
- `develop` - development branch
- `feature/*` - new features
- `bugfix/*` - bug fixes
- `hotfix/*` - urgent production fixes

### Creating a Branch

```bash
git checkout -b feature/your-feature-name
```

### Making Changes

1. Write clean, readable code
2. Follow existing code style
3. Add comments for complex logic
4. Update documentation if needed
5. Write/update tests

### Commit Messages

Follow conventional commit format:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): add password reset functionality

fix(payments): resolve Stripe webhook timeout issue

docs(api): update authentication endpoints documentation
```

### Code Style

- Use ESLint and Prettier configurations
- Run `npm run lint:fix` before committing
- Use meaningful variable and function names
- Keep functions small and focused
- Use async/await over promises

### Testing

1. Write tests for new features:
   ```bash
   npm test
   ```

2. Ensure all tests pass:
   ```bash
   npm run test:coverage
   ```

3. Test coverage should be > 80%

## Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] No console.logs or debug code
- [ ] Commits are clean and descriptive

### Submitting Pull Request

1. Push your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Create Pull Request on GitHub

3. Fill out PR template completely

4. Link related issues

5. Request review from maintainers

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe testing performed

## Screenshots (if applicable)
Add screenshots

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests pass
```

## Coding Standards

### JavaScript/Node.js

```javascript
// Good
const getUserById = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    logger.error('Get user error:', error);
    throw error;
  }
};

// Bad
function getUser(id) {
  return User.findByPk(id).then(user => {
    return user;
  }).catch(err => console.log(err));
}
```

### API Endpoints

```javascript
// Good
router.post('/courses', [
  protect,
  authorize('instructor', 'admin'),
  body('title').notEmpty().trim(),
  body('description').notEmpty().trim(),
  body('price').isDecimal()
], asyncHandler(async (req, res) => {
  // Implementation
}));

// Bad
router.post('/courses', async (req, res) => {
  // No validation, no error handling
});
```

### Error Handling

```javascript
// Good
try {
  const result = await someAsyncOperation();
  logger.info('Operation successful');
  return result;
} catch (error) {
  logger.error('Operation failed:', error);
  throw new Error('Operation failed');
}

// Bad
someAsyncOperation().catch(() => {});
```

## Documentation

### Code Comments

```javascript
/**
 * Enroll a student in a course
 * @param {string} studentId - The student's UUID
 * @param {string} courseId - The course UUID
 * @returns {Promise<Enrollment>} The created enrollment
 * @throws {Error} If course not found or already enrolled
 */
async function enrollStudent(studentId, courseId) {
  // Implementation
}
```

### API Documentation

Update `docs/API_DOCUMENTATION.md` for:
- New endpoints
- Modified endpoints
- New request/response formats
- New error codes

### README Updates

Update README.md when:
- Adding new features
- Changing dependencies
- Modifying setup process
- Adding new environment variables

## Testing Guidelines

### Unit Tests

```javascript
describe('User Model', () => {
  it('should hash password before saving', async () => {
    const user = await User.create({
      email: 'test@example.com',
      password: 'password123'
    });
    expect(user.password).not.toBe('password123');
  });
});
```

### Integration Tests

```javascript
describe('POST /api/auth/register', () => {
  it('should register new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });
});
```

## Security

### Reporting Security Issues

**DO NOT** open public issues for security vulnerabilities.

Email security@dolesefx.com with:
- Description of vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Security Best Practices

- Never commit secrets or credentials
- Use environment variables
- Validate all user input
- Use parameterized queries
- Keep dependencies updated
- Follow OWASP guidelines

## Performance

### Optimization Guidelines

- Use database indexes
- Implement caching where appropriate
- Optimize database queries
- Use pagination for large datasets
- Lazy load when possible
- Monitor query performance

### Performance Testing

```bash
# Load testing with Apache Bench
ab -n 1000 -c 10 http://localhost:5000/api/courses

# Profiling
node --prof src/app.js
```

## Review Process

### What Reviewers Look For

- Code quality and readability
- Test coverage
- Performance implications
- Security considerations
- Documentation completeness
- Breaking changes

### Addressing Review Comments

- Respond to all comments
- Make requested changes
- Push updates to same branch
- Request re-review when ready

## Release Process

1. Version bump in package.json
2. Update CHANGELOG.md
3. Create release notes
4. Tag release
5. Deploy to production

## Getting Help

- GitHub Issues: Report bugs and request features
- Discussions: Ask questions and share ideas
- Email: support@dolesefx.com
- Documentation: https://docs.dolesefx.com

## License

By contributing, you agree that your contributions will be licensed under the ISC License.

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- Project documentation

Thank you for contributing! 🎉
