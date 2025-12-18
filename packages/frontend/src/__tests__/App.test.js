import React, { act } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '../App';

// Mock server to intercept API requests
const server = setupServer(
  // GET /api/items handler
  rest.get('/api/items', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 1, name: 'Test Item 1', completed: 0, created_at: '2023-01-01T00:00:00.000Z' },
        { id: 2, name: 'Test Item 2', completed: 1, created_at: '2023-01-02T00:00:00.000Z' },
      ])
    );
  }),
  
  // POST /api/items handler
  rest.post('/api/items', (req, res, ctx) => {
    const { name } = req.body;
    
    if (!name || name.trim() === '') {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Item name is required' })
      );
    }
    
    return res(
      ctx.status(201),
      ctx.json({
        id: 3,
        name,
        completed: 0,
        created_at: new Date().toISOString(),
      })
    );
  }),

  // PATCH /api/items/:id handler
  rest.patch('/api/items/:id', (req, res, ctx) => {
    const { id } = req.params;
    const { completed } = req.body;
    
    return res(
      ctx.status(200),
      ctx.json({
        id: parseInt(id),
        name: `Test Item ${id}`,
        completed: completed ? 1 : 0,
        created_at: new Date().toISOString(),
      })
    );
  }),

  // DELETE /api/items/:id handler
  rest.delete('/api/items/:id', (req, res, ctx) => {
    const { id } = req.params;
    
    return res(
      ctx.status(200),
      ctx.json({ message: 'Item deleted successfully', id: parseInt(id) })
    );
  })
);

// Setup and teardown for the mock server
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('App Component', () => {
  test('renders the header', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText('To Do App')).toBeInTheDocument();
    expect(screen.getByText('Keep track of your tasks')).toBeInTheDocument();
  });

  test('loads and displays items', async () => {
    await act(async () => {
      render(<App />);
    });
    
    // Initially shows loading state
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
    
    // Wait for items to load
    await waitFor(() => {
      expect(screen.getByText('Test Item 1')).toBeInTheDocument();
      expect(screen.getByText('Test Item 2')).toBeInTheDocument();
    });
  });

  test('adds a new item', async () => {
    const user = userEvent.setup();
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for items to load
    await waitFor(() => {
      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    });
    
    // Fill in the form and submit
    const input = screen.getByPlaceholderText('What needs to be done?');
    await act(async () => {
      await user.type(input, 'New Test Item');
    });
    
    const submitButton = screen.getByText('Add TODO');
    await act(async () => {
      await user.click(submitButton);
    });
    
    // Check that the new item appears
    await waitFor(() => {
      expect(screen.getByText('New Test Item')).toBeInTheDocument();
    });
  });

  test('handles API error', async () => {
    // Override the default handler to simulate an error
    server.use(
      rest.get('/api/items', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch data/)).toBeInTheDocument();
    });
  });

  test('shows empty state when no items', async () => {
    // Override the default handler to return empty array
    server.use(
      rest.get('/api/items', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([]));
      })
    );
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for empty state message
    await waitFor(() => {
      expect(screen.getByText('No TODOs yet. Add one above!')).toBeInTheDocument();
    });
  });

  test('toggles item completion', async () => {
    const user = userEvent.setup();
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for items to load
    await waitFor(() => {
      expect(screen.getByText('Test Item 1')).toBeInTheDocument();
    });
    
    // Find and click the checkbox for the first item
    const checkboxes = screen.getAllByRole('checkbox');
    await act(async () => {
      await user.click(checkboxes[0]);
    });
    
    // The item should still be in the document (just toggled)
    expect(screen.getByText('Test Item 1')).toBeInTheDocument();
  });

  test('filters items by status', async () => {
    const user = userEvent.setup();
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for items to load
    await waitFor(() => {
      expect(screen.getByText('Test Item 1')).toBeInTheDocument();
      expect(screen.getByText('Test Item 2')).toBeInTheDocument();
    });
    
    // Click Active filter
    const activeButton = screen.getByText('Active');
    await act(async () => {
      await user.click(activeButton);
    });
    
    // Only active item should be visible
    expect(screen.getByText('Test Item 1')).toBeInTheDocument();
    
    // Click Completed filter
    const completedButton = screen.getByText('Completed');
    await act(async () => {
      await user.click(completedButton);
    });
    
    // Only completed item should be visible
    expect(screen.getByText('Test Item 2')).toBeInTheDocument();
  });

  test('displays active item count', async () => {
    await act(async () => {
      render(<App />);
    });
    
    // Wait for items to load
    await waitFor(() => {
      expect(screen.getByText('1 item left')).toBeInTheDocument();
    });
  });
});