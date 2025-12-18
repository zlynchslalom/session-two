# Coding Guidelines

## Overview

This document defines the coding standards and best practices for the TODO application. Consistent code style and quality principles ensure maintainability, readability, and collaboration across the development team.

## Code Quality Principles

### SOLID Principles

#### Single Responsibility Principle (SRP)
- Each function, class, or module should have one clear purpose
- If a function does multiple things, split it into separate functions
- Components should focus on a single concern

```javascript
// Bad: Function doing too much
function handleUserData(user) {
  validateUser(user);
  saveToDatabase(user);
  sendEmail(user);
  updateUI(user);
}

// Good: Separate concerns
function processUser(user) {
  validateUser(user);
  saveUser(user);
}

function notifyUser(user) {
  sendEmail(user);
}

function refreshUserInterface(user) {
  updateUI(user);
}
```

#### Open/Closed Principle
- Code should be open for extension but closed for modification
- Use composition and configuration over conditional logic

#### Dependency Inversion
- Depend on abstractions, not concrete implementations
- Use dependency injection for better testability

### DRY (Don't Repeat Yourself)

Avoid code duplication by extracting common logic into reusable functions or components.

```javascript
// Bad: Duplicated logic
function addTodo(title) {
  if (!title || title.trim() === '') {
    throw new Error('Title cannot be empty');
  }
  // Add todo logic
}

function updateTodo(id, title) {
  if (!title || title.trim() === '') {
    throw new Error('Title cannot be empty');
  }
  // Update todo logic
}

// Good: Extract validation
function validateTodoTitle(title) {
  if (!title || title.trim() === '') {
    throw new Error('Title cannot be empty');
  }
}

function addTodo(title) {
  validateTodoTitle(title);
  // Add todo logic
}

function updateTodo(id, title) {
  validateTodoTitle(title);
  // Update todo logic
}
```

### KISS (Keep It Simple, Stupid)

Write simple, straightforward code that is easy to understand and maintain.

```javascript
// Bad: Overly complex
const isValid = !!(user && user.name && user.name.length > 0 && user.email && /\S+@\S+\.\S+/.test(user.email));

// Good: Clear and simple
function isValidUser(user) {
  if (!user) return false;
  if (!user.name || user.name.trim().length === 0) return false;
  if (!user.email || !isValidEmail(user.email)) return false;
  return true;
}

function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}
```

### YAGNI (You Aren't Gonna Need It)

Don't add functionality until it's actually needed. Avoid premature optimization and over-engineering.

```javascript
// Bad: Adding unnecessary abstraction
class TodoRepositoryFactory {
  createRepository(type) {
    if (type === 'memory') return new InMemoryTodoRepository();
    if (type === 'database') return new DatabaseTodoRepository();
    // We only use one type currently
  }
}

// Good: Simple and direct
class TodoRepository {
  // Implement what we need now
}
```

## Code Formatting

### General Rules

- **Indentation**: Use 2 spaces for indentation (no tabs)
- **Line Length**: Maximum 100 characters per line
- **Semicolons**: Always use semicolons in JavaScript
- **Quotes**: Use single quotes for strings, except to avoid escaping
- **Trailing Commas**: Use trailing commas in multi-line objects and arrays
- **Whitespace**: Use consistent spacing around operators and keywords

### Prettier Configuration

The project uses Prettier for automatic code formatting:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### Formatting Examples

```javascript
// Good formatting
const todoItem = {
  id: 1,
  title: 'Complete project',
  completed: false,
  createdAt: new Date(),
};

function calculateTotal(items, discount = 0) {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  return subtotal - discount;
}

// Proper line breaks for long statements
const filteredTodos = todos
  .filter((todo) => !todo.completed)
  .map((todo) => todo.title)
  .join(', ');
```

## Import Organization

### Import Order

Organize imports in the following order, with blank lines between groups:

1. External dependencies (npm packages)
2. Internal modules (absolute imports)
3. Relative imports from parent directories
4. Relative imports from current directory
5. Type imports (TypeScript)
6. Style imports (CSS, SCSS)

```javascript
// External dependencies
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Internal modules
import { TodoService } from 'services/TodoService';
import { useAuth } from 'hooks/useAuth';

// Relative imports
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';

// Styles
import './TodoList.css';
```

### Import Naming

```javascript
// Default imports: PascalCase for components, camelCase for utilities
import TodoList from './TodoList';
import { formatDate } from './utils';

// Named imports: Preserve original names
import { getTodos, addTodo, deleteTodo } from './api';

// Namespace imports: Use sparingly
import * as TodoUtils from './todoUtils';
```

### Avoid Barrel Exports Overuse

```javascript
// Bad: Deep barrel exports can slow build times
export * from './components';

// Good: Explicit exports
export { TodoList } from './TodoList';
export { TodoItem } from './TodoItem';
export { TodoForm } from './TodoForm';
```

## Naming Conventions

### Variables and Functions

```javascript
// camelCase for variables and functions
const todoCount = 5;
const isCompleted = false;

function calculateTotal() {}
function handleSubmit() {}

// UPPER_CASE for constants
const MAX_TODO_LENGTH = 500;
const API_BASE_URL = 'https://api.example.com';

// Boolean variables: use is/has/should prefix
const isLoading = true;
const hasError = false;
const shouldValidate = true;
```

### Components and Classes

```javascript
// PascalCase for React components and classes
class TodoService {}
function TodoList() {}
const TodoItem = () => {};
```

### Private Variables

```javascript
// Prefix with underscore (convention, not enforced)
class TodoRepository {
  _cache = new Map();
  
  _invalidateCache() {
    this._cache.clear();
  }
}
```

### Event Handlers

```javascript
// Prefix with "handle" for event handlers
function handleClick() {}
function handleSubmit() {}
function handleInputChange() {}

// Prefix with "on" for callback props
<TodoItem onClick={handleClick} onDelete={handleDelete} />
```

### File Naming

```javascript
// Components: PascalCase
TodoList.js
TodoItem.jsx
UserProfile.js

// Utilities and services: camelCase
todoService.js
dateUtils.js
apiClient.js

// Tests: Match source file with .test suffix
TodoList.test.js
todoService.test.js

// Styles: Match component name
TodoList.css
TodoItem.module.css
```

## Linting and Code Quality

### ESLint Configuration

The project uses ESLint to enforce code quality standards:

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "no-var": "error",
    "prefer-const": "error",
    "prefer-arrow-callback": "warn",
    "no-duplicate-imports": "error",
    "eqeqeq": ["error", "always"]
  }
}
```

### Code Quality Rules

#### Use const and let (Never var)

```javascript
// Bad
var count = 0;

// Good
let count = 0;
const MAX_COUNT = 100;
```

#### Prefer Arrow Functions

```javascript
// Bad
const numbers = [1, 2, 3].map(function(n) {
  return n * 2;
});

// Good
const numbers = [1, 2, 3].map((n) => n * 2);
```

#### Use Strict Equality

```javascript
// Bad
if (value == null) {}

// Good
if (value === null || value === undefined) {}
// Or
if (value == null) {} // Only when explicitly checking for null OR undefined
```

#### Avoid Console Statements in Production

```javascript
// Development only
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}

// Production: Use proper logging
logger.info('User action', { userId, action });
```

## Function Guidelines

### Function Length

- Keep functions small and focused (ideally under 20 lines)
- If a function is too long, break it into smaller functions
- Each function should do one thing well

### Function Parameters

```javascript
// Bad: Too many parameters
function createTodo(title, description, priority, dueDate, assignee, category) {}

// Good: Use object parameter for multiple options
function createTodo({ title, description, priority, dueDate, assignee, category }) {}

// Even better: With defaults and destructuring
function createTodo({ 
  title, 
  description = '', 
  priority = 'medium',
  dueDate = null,
  assignee = null,
  category = 'general'
}) {}
```

### Return Early

```javascript
// Bad: Nested conditions
function processUser(user) {
  if (user) {
    if (user.isActive) {
      if (user.hasPermission) {
        // Process user
        return true;
      }
    }
  }
  return false;
}

// Good: Early returns
function processUser(user) {
  if (!user) return false;
  if (!user.isActive) return false;
  if (!user.hasPermission) return false;
  
  // Process user
  return true;
}
```

### Avoid Side Effects

```javascript
// Bad: Unexpected side effects
let total = 0;
function addToTotal(value) {
  total += value; // Modifies external state
  return total;
}

// Good: Pure function
function calculateTotal(currentTotal, value) {
  return currentTotal + value;
}
```

## React Best Practices

### Component Structure

```javascript
// Recommended component structure
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './TodoItem.css';

function TodoItem({ todo, onToggle, onDelete }) {
  // 1. Hooks
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    // Effect logic
  }, [todo]);
  
  // 2. Event handlers
  const handleToggle = () => {
    onToggle(todo.id);
  };
  
  const handleDelete = () => {
    if (window.confirm('Delete this todo?')) {
      onDelete(todo.id);
    }
  };
  
  // 3. Render helpers
  const renderActions = () => (
    <div className="actions">
      <button onClick={handleToggle}>Toggle</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
  
  // 4. Main render
  return (
    <div className="todo-item">
      <span>{todo.title}</span>
      {renderActions()}
    </div>
  );
}

// 5. PropTypes
TodoItem.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
  }).isRequired,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TodoItem;
```

### Use Functional Components

```javascript
// Prefer functional components with hooks
function TodoList() {
  const [todos, setTodos] = useState([]);
  
  return <div>{/* Component JSX */}</div>;
}
```

### Destructure Props

```javascript
// Good: Destructure props for clarity
function TodoItem({ todo, onToggle, onDelete }) {
  return <div>{todo.title}</div>;
}

// Avoid: Using props object throughout
function TodoItem(props) {
  return <div>{props.todo.title}</div>;
}
```

### Key Props in Lists

```javascript
// Good: Use stable, unique keys
{todos.map((todo) => (
  <TodoItem key={todo.id} todo={todo} />
))}

// Bad: Using index as key
{todos.map((todo, index) => (
  <TodoItem key={index} todo={todo} />
))}
```

## Error Handling

### Try-Catch for Async Operations

```javascript
async function fetchTodos() {
  try {
    const response = await api.get('/todos');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch todos:', error);
    throw new Error('Unable to load todos. Please try again.');
  }
}
```

### Graceful Degradation

```javascript
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    loadTodos().catch((err) => setError(err.message));
  }, []);
  
  if (error) {
    return <ErrorMessage message={error} />;
  }
  
  return <div>{/* Todo list */}</div>;
}
```

### Validate Input

```javascript
function validateTodoTitle(title) {
  if (typeof title !== 'string') {
    throw new TypeError('Title must be a string');
  }
  
  if (title.trim().length === 0) {
    throw new Error('Title cannot be empty');
  }
  
  if (title.length > 500) {
    throw new Error('Title cannot exceed 500 characters');
  }
  
  return title.trim();
}
```

## Comments and Documentation

### When to Comment

```javascript
// Good: Explain WHY, not WHAT
// Use debounce to avoid excessive API calls during rapid typing
const debouncedSearch = debounce(searchTodos, 300);

// Bad: Obvious comment
// Increment counter by 1
counter += 1;
```

### JSDoc for Public APIs

```javascript
/**
 * Creates a new todo item
 * @param {Object} todoData - The todo data
 * @param {string} todoData.title - The todo title
 * @param {boolean} [todoData.completed=false] - Whether the todo is completed
 * @returns {Promise<Todo>} The created todo object
 * @throws {Error} If title is empty or invalid
 */
async function createTodo({ title, completed = false }) {
  // Implementation
}
```

### TODO Comments

```javascript
// TODO: Add pagination support
// FIXME: Handle race condition when deleting multiple items
// NOTE: This workaround is temporary until API v2 is released
```

## Performance Considerations

### Memoization

```javascript
// Use React.memo for expensive components
const TodoItem = React.memo(({ todo, onToggle }) => {
  return <div>{todo.title}</div>;
});

// Use useMemo for expensive computations
const sortedTodos = useMemo(() => {
  return todos.sort((a, b) => a.title.localeCompare(b.title));
}, [todos]);

// Use useCallback for stable function references
const handleToggle = useCallback((id) => {
  setTodos((prev) => prev.map((todo) => 
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  ));
}, []);
```

### Avoid Premature Optimization

Only optimize when you have identified a real performance bottleneck through profiling.

## Git Commit Messages

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```
feat(todos): add filter by completion status

- Add filter dropdown to header
- Implement filtering logic in reducer
- Update tests for new functionality

Closes #123
```

```
fix(api): handle empty response from server

When the server returns an empty response, the app now displays
a friendly message instead of crashing.

Fixes #456
```

## Code Review Checklist

Before submitting code for review:

- [ ] Code follows formatting guidelines (run Prettier)
- [ ] No linting errors (run ESLint)
- [ ] All tests pass
- [ ] New features have tests
- [ ] No console.log statements in production code
- [ ] Functions are small and focused
- [ ] Variable and function names are descriptive
- [ ] Comments explain WHY, not WHAT
- [ ] No duplicate code (DRY principle)
- [ ] Error handling is implemented
- [ ] PropTypes defined for React components
- [ ] Imports are organized correctly

## Summary

Following these coding guidelines ensures:

- **Consistency**: Code looks like it was written by one person
- **Readability**: Code is easy to understand and maintain
- **Quality**: Fewer bugs and better performance
- **Collaboration**: Easier for team members to work together
- **Maintainability**: Faster to add features and fix issues

Remember: Clean code is not just about making it work—it's about making it work well and making it easy for others (and your future self) to understand and modify.
