import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newItem, setNewItem] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/items');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data: ' + err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newItem }),
      });

      if (!response.ok) {
        throw new Error('Failed to add item');
      }

      const result = await response.json();
      setData([...data, result]);
      setNewItem('');
    } catch (err) {
      setError('Error adding item: ' + err.message);
      console.error('Error adding item:', err);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      setData(data.filter(item => item.id !== itemId));
      setError(null);
    } catch (err) {
      setError('Error deleting item: ' + err.message);
      console.error('Error deleting item:', err);
    }
  };

  const handleToggle = async (itemId) => {
    try {
      const item = data.find(i => i.id === itemId);
      const response = await fetch(`/api/items/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !item.completed }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle item');
      }

      const updatedItem = await response.json();
      setData(data.map(item => item.id === itemId ? updatedItem : item));
      setError(null);
    } catch (err) {
      setError('Error toggling item: ' + err.message);
      console.error('Error toggling item:', err);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditingText(item.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const handleSaveEdit = async (itemId) => {
    if (!editingText.trim()) return;

    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editingText }),
      });

      if (!response.ok) {
        throw new Error('Failed to update item');
      }

      const updatedItem = await response.json();
      setData(data.map(item => item.id === itemId ? updatedItem : item));
      setEditingId(null);
      setEditingText('');
      setError(null);
    } catch (err) {
      setError('Error updating item: ' + err.message);
      console.error('Error updating item:', err);
    }
  };

  const handleClearCompleted = async () => {
    const completedItems = data.filter(item => item.completed);
    
    try {
      await Promise.all(
        completedItems.map(item =>
          fetch(`/api/items/${item.id}`, { method: 'DELETE' })
        )
      );
      
      setData(data.filter(item => !item.completed));
      setError(null);
    } catch (err) {
      setError('Error clearing completed items: ' + err.message);
      console.error('Error clearing completed items:', err);
    }
  };

  const getFilteredData = () => {
    if (filter === 'active') {
      return data.filter(item => !item.completed);
    }
    if (filter === 'completed') {
      return data.filter(item => item.completed);
    }
    return data;
  };

  const activeCount = data.filter(item => !item.completed).length;
  const completedCount = data.filter(item => item.completed).length;
  const filteredData = getFilteredData();

  return (
    <div className="App">
      <header className="App-header">
        <h1>To Do App</h1>
        <p>Keep track of your tasks</p>
      </header>

      <main>
        <section className="add-item-section">
          <h2>Add New TODO</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="What needs to be done?"
            />
            <button type="submit">Add TODO</button>
          </form>
        </section>

        <section className="items-section">
          <div className="filter-section">
            <div className="filter-buttons">
              <button 
                className={filter === 'all' ? 'active' : ''}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button 
                className={filter === 'active' ? 'active' : ''}
                onClick={() => setFilter('active')}
              >
                Active
              </button>
              <button 
                className={filter === 'completed' ? 'active' : ''}
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
            </div>
            <div className="todo-count">
              {activeCount} {activeCount === 1 ? 'item' : 'items'} left
            </div>
          </div>

          {loading && <p>Loading data...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && (
            <>
              <ul className="todo-list">
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <li key={item.id} className={item.completed ? 'completed' : ''}>
                      {editingId === item.id ? (
                        <div className="edit-mode">
                          <input
                            type="text"
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSaveEdit(item.id);
                              } else if (e.key === 'Escape') {
                                handleCancelEdit();
                              }
                            }}
                            autoFocus
                          />
                          <button onClick={() => handleSaveEdit(item.id)}>Save</button>
                          <button onClick={handleCancelEdit}>Cancel</button>
                        </div>
                      ) : (
                        <div className="view-mode">
                          <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => handleToggle(item.id)}
                          />
                          <span 
                            className="todo-text"
                            onDoubleClick={() => handleEdit(item)}
                          >
                            {item.name}
                          </span>
                          <div className="actions">
                            <button 
                              onClick={() => handleEdit(item)}
                              className="edit-btn"
                              type="button"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(item.id)}
                              className="delete-btn"
                              type="button"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  ))
                ) : (
                  <p className="empty-state">
                    {filter === 'all' 
                      ? 'No TODOs yet. Add one above!' 
                      : filter === 'active'
                      ? 'No active TODOs. Great job!'
                      : 'No completed TODOs yet.'}
                  </p>
                )}
              </ul>
              {completedCount > 0 && (
                <button 
                  className="clear-completed"
                  onClick={handleClearCompleted}
                >
                  Clear Completed ({completedCount})
                </button>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;