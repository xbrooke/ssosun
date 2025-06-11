import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, jest } from '@jest/globals';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from './App';

describe('App', () => {
  it('renders without crashing', () => {
    const mockAuthContext = {
      isAuthenticated: false,
      setIsAuthenticated: jest.fn(),
      logout: jest.fn()
    };

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthContext.Provider>
    );
    
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});