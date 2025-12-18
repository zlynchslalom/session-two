# Testing Guidelines

## Overview

This document outlines the testing requirements and best practices for the TODO application. Comprehensive testing is essential to ensure code quality, prevent regressions, and maintain a reliable application.

## Testing Philosophy

### Core Principles

1. **Test-Driven Development (TDD)**: Write tests before or alongside implementation code
2. **Test Coverage**: All new features must include appropriate tests
3. **Maintainability**: Tests should be clear, concise, and easy to maintain
4. **Reliability**: Tests should be deterministic and not flaky
5. **Fast Feedback**: Tests should run quickly to enable rapid development cycles

### Testing Pyramid

The application follows the testing pyramid approach:
- **70%** Unit Tests - Fast, isolated component testing
- **20%** Integration Tests - Component interaction testing
- **10%** End-to-End Tests - Full user flow testing

## Unit Testing

### Requirements

- **Mandatory Coverage**: All new functions, components, and modules must have unit tests
- **Minimum Coverage**: 80% code coverage for new code
- **Isolation**: Tests should not depend on external services or databases
- **Speed**: Unit tests should execute in milliseconds

### Best Practices

#### Test Structure
- Follow the **Arrange-Act-Assert (AAA)** pattern:
  ```javascript
  // Arrange: Set up test data and conditions
  const input = 'test data';
  
  // Act: Execute the function/method under test
  const result = functionUnderTest(input);
  
  // Assert: Verify the expected outcome
  expect(result).toBe('expected output');
  ```

#### Naming Conventions
- Use descriptive test names that explain what is being tested
- Format: `should [expected behavior] when [condition]`
- Example: `should return empty array when no todos exist`

#### Test Organization
```javascript
describe('TodoService', () => {
  describe('addTodo', () => {
    it('should add a new todo to the list', () => {
      // Test implementation
    });
    
    it('should throw error when todo title is empty', () => {
      // Test implementation
    });
  });
  
  describe('deleteTodo', () => {
    it('should remove todo by id', () => {
      // Test implementation
    });
  });
});
```

#### What to Test
- **Happy Paths**: Normal, expected use cases
- **Edge Cases**: Boundary conditions, empty inputs, null values
- **Error Handling**: Invalid inputs, error conditions
- **State Changes**: Component state updates, data mutations
- **User Interactions**: Click handlers, form submissions

#### What NOT to Test
- Third-party library code
- Framework internals (React, Express)
- Configuration files
- Trivial code (getters/setters without logic)

### Frontend Unit Testing

#### Component Testing Requirements
- Test component rendering with different props
- Test user interactions (clicks, input changes)
- Test conditional rendering logic
- Test state management
- Mock external dependencies (API calls, context)

#### Example Component Test
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import TodoItem from './TodoItem';

describe('TodoItem', () => {
  const mockTodo = {
    id: 1,
    title: 'Test Todo',
    completed: false
  };
  
  it('should render todo title', () => {
    render(<TodoItem todo={mockTodo} />);
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
  });
  
  it('should call onToggle when checkbox is clicked', () => {
    const mockOnToggle = jest.fn();
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} />);
    
    fireEvent.click(screen.getByRole('checkbox'));
    expect(mockOnToggle).toHaveBeenCalledWith(1);
  });
});
```

### Backend Unit Testing

#### API Route Testing Requirements
- Test request handling and response formatting
- Test validation logic
- Test error handling and status codes
- Mock database operations

#### Example API Test
```javascript
import request from 'supertest';
import app from '../src/app';

describe('POST /api/todos', () => {
  it('should create a new todo', async () => {
    const newTodo = { title: 'New Task' };
    
    const response = await request(app)
      .post('/api/todos')
      .send(newTodo)
      .expect(201);
    
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('New Task');
  });
  
  it('should return 400 for empty title', async () => {
    const response = await request(app)
      .post('/api/todos')
      .send({ title: '' })
      .expect(400);
    
    expect(response.body.error).toBeDefined();
  });
});
```

## Integration Testing

### Requirements

- **Component Interaction**: Test how multiple components work together
- **API Integration**: Test frontend-backend communication
- **Database Operations**: Test data persistence and retrieval
- **Coverage**: Critical user flows must have integration tests

### Best Practices

#### Frontend Integration Tests
- Test feature modules as a whole
- Test data flow between parent and child components
- Test routing and navigation
- Use real state management (Redux, Context)
- Mock only external APIs

#### Backend Integration Tests
- Test full request-response cycles
- Use test database or in-memory database
- Test middleware chains
- Test authentication and authorization flows
- Clean up test data after each test

#### Example Integration Test
```javascript
describe('Todo Feature Integration', () => {
  beforeEach(() => {
    // Set up test database
  });
  
  afterEach(() => {
    // Clean up test data
  });
  
  it('should create, retrieve, and delete a todo', async () => {
    // Create todo
    const createResponse = await request(app)
      .post('/api/todos')
      .send({ title: 'Integration Test Todo' })
      .expect(201);
    
    const todoId = createResponse.body.id;
    
    // Retrieve todo
    const getResponse = await request(app)
      .get(`/api/todos/${todoId}`)
      .expect(200);
    
    expect(getResponse.body.title).toBe('Integration Test Todo');
    
    // Delete todo
    await request(app)
      .delete(`/api/todos/${todoId}`)
      .expect(204);
    
    // Verify deletion
    await request(app)
      .get(`/api/todos/${todoId}`)
      .expect(404);
  });
});
```

## End-to-End (E2E) Testing

### Requirements

- **User Flows**: Test complete user journeys through the application
- **Critical Paths**: All major features must have E2E tests
- **Real Environment**: Tests should run against a production-like environment
- **Frequency**: Run E2E tests before releases and deployments

### Best Practices

#### What to Test
- Complete user workflows (add todo → mark complete → delete)
- Cross-browser compatibility
- Responsive design on different screen sizes
- Navigation flows
- Form submissions
- Error scenarios

#### E2E Testing Tools
- **Cypress**: Recommended for frontend E2E tests
- **Playwright**: Alternative for cross-browser testing
- **Puppeteer**: For programmatic browser control

#### Example E2E Test (Cypress)
```javascript
describe('Todo Management Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  
  it('should complete full todo lifecycle', () => {
    // Add a new todo
    cy.get('[data-testid="todo-input"]').type('Buy groceries');
    cy.get('[data-testid="add-todo-button"]').click();
    
    // Verify todo appears in list
    cy.contains('Buy groceries').should('be.visible');
    
    // Mark todo as complete
    cy.get('[data-testid="todo-checkbox"]').first().check();
    cy.contains('Buy groceries').should('have.class', 'completed');
    
    // Delete todo
    cy.get('[data-testid="delete-todo-button"]').first().click();
    cy.contains('Buy groceries').should('not.exist');
  });
  
  it('should filter todos by status', () => {
    // Create completed and active todos
    cy.addTodo('Active Task');
    cy.addTodo('Completed Task');
    cy.markTodoComplete('Completed Task');
    
    // Filter to active todos
    cy.get('[data-testid="filter-active"]').click();
    cy.contains('Active Task').should('be.visible');
    cy.contains('Completed Task').should('not.be.visible');
    
    // Filter to completed todos
    cy.get('[data-testid="filter-completed"]').click();
    cy.contains('Active Task').should('not.be.visible');
    cy.contains('Completed Task').should('be.visible');
  });
});
```

## Test Maintainability

### Code Quality Standards

#### DRY Principle (Don't Repeat Yourself)
- Extract common test setup into helper functions
- Use `beforeEach` and `afterEach` hooks for shared setup/teardown
- Create custom test utilities and matchers

#### Test Data Management
```javascript
// Good: Use test data factories
const createTestTodo = (overrides = {}) => ({
  id: 1,
  title: 'Test Todo',
  completed: false,
  ...overrides
});

// Use in tests
const todo = createTestTodo({ title: 'Custom Title' });
```

#### Mock Management
```javascript
// Good: Centralize mock definitions
// __mocks__/api.js
export const mockTodoService = {
  getTodos: jest.fn(() => Promise.resolve([])),
  addTodo: jest.fn((todo) => Promise.resolve({ id: 1, ...todo })),
  deleteTodo: jest.fn(() => Promise.resolve())
};
```

#### Clear Assertions
```javascript
// Bad: Unclear assertion
expect(result).toBe(true);

// Good: Descriptive assertion with message
expect(todo.completed).toBe(true);
expect(todos).toHaveLength(3);
expect(response.status).toBe(201);
```

### Test Documentation

- Add comments for complex test scenarios
- Document test data and fixtures
- Explain non-obvious mocking strategies
- Keep tests simple enough to not need extensive comments

### Refactoring Tests

- Refactor tests when code changes
- Remove obsolete tests
- Update tests for new requirements
- Keep test code as clean as production code

## Code Coverage

### Coverage Requirements

- **Overall Coverage**: Minimum 80% for new code
- **Branch Coverage**: Minimum 75%
- **Function Coverage**: Minimum 85%
- **Line Coverage**: Minimum 80%

### Coverage Reports

- Generate coverage reports with `npm test -- --coverage`
- Review coverage reports before submitting pull requests
- Focus on meaningful coverage, not just hitting percentages
- Exclude generated code and configuration from coverage

### Coverage Tools

- **Jest**: Built-in coverage reporting
- **Istanbul/nyc**: Coverage for Node.js applications
- **Codecov/Coveralls**: CI integration and coverage tracking

## Testing Tools & Frameworks

### Frontend Testing Stack

- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing utilities
- **MSW (Mock Service Worker)**: API mocking
- **Cypress**: E2E testing framework

### Backend Testing Stack

- **Jest**: Test runner and assertion library
- **Supertest**: HTTP assertion library
- **node-mocks-http**: HTTP request/response mocking
- **Sinon**: Mocking and stubbing library

## Continuous Integration

### CI/CD Requirements

- All tests must pass before merging to main branch
- Run tests automatically on every pull request
- Block deployment if tests fail
- Run E2E tests in staging environment before production

### Pre-commit Hooks

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm test -- --onlyChanged",
      "pre-push": "npm test"
    }
  }
}
```

## Test Review Checklist

Before submitting code for review, ensure:

- [ ] All new features have corresponding unit tests
- [ ] Integration tests cover component interactions
- [ ] E2E tests cover critical user flows
- [ ] All tests pass locally
- [ ] Code coverage meets minimum requirements
- [ ] Tests are clear, concise, and maintainable
- [ ] No commented-out test code
- [ ] No `.only` or `.skip` in test files
- [ ] Test names are descriptive
- [ ] Mocks are properly cleaned up
- [ ] Test data is realistic and representative

## Common Testing Pitfalls

### Avoid These Mistakes

1. **Testing Implementation Details**: Test behavior, not internal implementation
2. **Overmocking**: Mock only what's necessary; test real interactions when possible
3. **Flaky Tests**: Ensure tests are deterministic and don't depend on timing
4. **Slow Tests**: Optimize slow tests; consider moving to integration/E2E
5. **Unclear Failures**: Test failures should clearly indicate what went wrong
6. **Tight Coupling**: Tests shouldn't break when refactoring without changing behavior

### Example: Testing Behavior vs Implementation

```javascript
// Bad: Testing implementation details
it('should call setState with new value', () => {
  const component = new Component();
  const spy = jest.spyOn(component, 'setState');
  component.handleClick();
  expect(spy).toHaveBeenCalled();
});

// Good: Testing behavior
it('should update displayed count when button is clicked', () => {
  render(<Counter />);
  fireEvent.click(screen.getByText('Increment'));
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

## Resources

### Documentation
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Cypress Documentation](https://docs.cypress.io/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

### Learning Resources
- [Test-Driven Development by Example](https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530)
- [Testing JavaScript Applications](https://testingjavascript.com/)
- [Frontend Testing Strategies](https://martinfowler.com/articles/practical-test-pyramid.html)

## Summary

Quality testing is not optional—it's an integral part of the development process. By following these guidelines, we ensure:

- **Reliability**: Confidence that features work as expected
- **Maintainability**: Easier refactoring and code changes
- **Documentation**: Tests serve as living documentation
- **Quality**: Fewer bugs reach production
- **Speed**: Faster development cycles with quick feedback

Remember: **If it's not tested, it's broken.**
