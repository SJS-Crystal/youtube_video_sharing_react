import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header';
import Cookies from 'js-cookie';

jest.mock('axios');
(axios.post as jest.Mock).mockReset();

let setErrorMessage: jest.Mock;
setErrorMessage = jest.fn();

const HeaderWrapper = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <MemoryRouter>
      <Header setErrorMessage={setErrorMessage} setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />
    </MemoryRouter>
  );
}

describe('Header', () => {

  beforeEach(() => {
    Cookies.remove('id');
    Cookies.remove('email');
    Cookies.remove('token');
  });

  const renderHeader = () => {
    render(
      <HeaderWrapper/>
    );
  };

  test('Should render the header component', () => {
    renderHeader();

    expect(screen.getByText('Funny Movies')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  test('Should login successfully when the login API returns OK', async () => {
    const mockResponse = {
      data: {
        data: {
          id: '123',
          email: 'test@example.com',
          token: 'abc123',
        },
      },
    };
    (axios.post as jest.Mock).mockResolvedValue(mockResponse);
    renderHeader();

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:1234/api/user/v1/users/login', {
        email: 'test@example.com',
        password: 'password123',
      });
      expect(setErrorMessage).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Welcome test@example.com')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Share Video' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
    });
  });

  test('Should login failed when the login API responds with a failure', async () => {
    const mockError = {
      response: {
        status: 401,
        data: {
          message: "Login failed"
        }
      }
    };
    (axios.post as jest.Mock).mockRejectedValue(mockError);

    renderHeader();

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:1234/api/user/v1/users/login', {
        email: 'test@example.com',
        password: 'password123',
      });
      expect(setErrorMessage).toHaveBeenCalledWith('Login failed');
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    });
  });

  test('Should register successfully when the register API returns OK', async () => {
    const mockResponse = {
      data: {
        data: {
          id: '123',
          email: 'test@example.com',
          token: 'abc123',
        },
      },
    };
    (axios.post as jest.Mock).mockResolvedValue(mockResponse);
    renderHeader();

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:1234/api/user/v1/users', {
        email: 'test@example.com',
        password: 'password123',
      });
      expect(setErrorMessage).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Welcome test@example.com')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Share Video' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
    });
  });

  test('Should register failed when the register API responds with a failure', async () => {
    const mockError = {
      response: {
        status: 422,
        data: {
          message: "Login failed"
        }
      }
    };
    (axios.post as jest.Mock).mockRejectedValue(mockError);

    renderHeader();

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:1234/api/user/v1/users/login', {
        email: 'test@example.com',
        password: 'password123',
      });
      expect(setErrorMessage).toHaveBeenCalledWith('Login failed');
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    });
  });

  test('Should logout when the logout API response is successful', async () => {
    const mockResponse = {
      status: 200,
    };
    (axios.delete as jest.Mock).mockResolvedValue(mockResponse);

    Cookies.set('id', '123');
    Cookies.set('email', 'test@example.com');
    Cookies.set('token', 'abc123');

    renderHeader();

    fireEvent.click(screen.getByRole('button', { name: 'Logout' }));

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith('http://localhost:1234/api/user/v1/users/logout', {
        headers: {
          Authorization: 'abc123',
        },
      });
      expect(setErrorMessage).toHaveBeenCalledTimes(0);
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
    });
  });

  test('Should not log out when the logout API returns a failure', async () => {
    const mockError = {
      response: {
        status: 500,
        data: {
          message: "Internal server error"
        }
      }
    };

    (axios.delete as jest.Mock).mockRejectedValue(mockError);

    Cookies.set('id', '123');
    Cookies.set('email', 'test@example.com');
    Cookies.set('token', 'abc123');

    renderHeader();

    fireEvent.click(screen.getByRole('button', { name: 'Logout' }));

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith('http://localhost:1234/api/user/v1/users/logout', {
        headers: {
          Authorization: 'abc123',
        },
      });
      expect(setErrorMessage).toHaveBeenCalledTimes(0);
      expect(screen.getByText('Welcome test@example.com')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Share Video' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
    });
  });
});
