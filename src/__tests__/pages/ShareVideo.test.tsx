import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import ShareVideo from '../../pages/ShareVideo';
import * as router from 'react-router';
import Cookies from 'js-cookie';

jest.mock('axios');
const setErrorMessage = jest.fn();
const navigate = jest.fn();

const cookie_id = '123';
const cookie_email = 'test@example.com';
const cookie_token = 'abc123';
const assumeLoggedIn = () => {
  Cookies.set('id', cookie_id);
  Cookies.set('email', cookie_email);
  Cookies.set('token', cookie_token);
};

const assumeNotLoggedIn = () => {
  Cookies.remove('id');
  Cookies.remove('email');
  Cookies.remove('token');
};

beforeEach(() => {
  jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate);
});

describe('ShareVideo', () => {
  test('Should navigate to / when not logged in', async () => {
    assumeNotLoggedIn();
    render(
      <MemoryRouter>
        <ShareVideo setErrorMessage={setErrorMessage} />
      </MemoryRouter>
    );
    await waitFor(() => {
      const shareVideoElement = document.querySelector('.share-form');
      expect(shareVideoElement).toBeInTheDocument();
      expect(navigate).toHaveBeenCalledWith('/');
    });
  });

  test('Should render the ShareVideo component and not redirect to / path when logged in', () => {
    assumeLoggedIn();
    render(
      <MemoryRouter>
        <ShareVideo setErrorMessage={setErrorMessage} />
      </MemoryRouter>
    );
    const shareVideoElement = document.querySelector('.share-form');
    expect(shareVideoElement).toBeInTheDocument();
    expect(navigate).not.toHaveBeenCalled();
  });

  test('Should submit the form and navigates to the home page on success', async () => {
    assumeLoggedIn();
    (axios.post as jest.Mock).mockResolvedValue({});

    const { getByLabelText, getByRole } = render(
      <MemoryRouter>
        <ShareVideo setErrorMessage={setErrorMessage} />
      </MemoryRouter>
    );

    fireEvent.change(getByLabelText('Youtube URL'), { target: { value: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' } });
    fireEvent.click(getByRole('button', { name: 'Share' }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:1234/api/user/v1/videos', { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }, {
        headers: {
          Authorization: cookie_token
        }
      });
      expect(navigate).toHaveBeenCalledWith('/');
      expect(setErrorMessage).not.toHaveBeenCalled();
    });
  });

  test('Should set an error message on failure', async () => {
    assumeLoggedIn();
    (axios.post as jest.Mock).mockRejectedValue({
      response: {
      data: {
        message: 'Failed to submit URL. Please try again.'
      },
      status: 500
      }
    });

    const { getByLabelText, getByRole } = render(
      <MemoryRouter>
        <ShareVideo setErrorMessage={setErrorMessage} />
      </MemoryRouter>
    );

    fireEvent.change(getByLabelText('Youtube URL'), { target: { value: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' } });
    fireEvent.click(getByRole('button', { name: 'Share' }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:1234/api/user/v1/videos', { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }, {
        headers: {
          Authorization: cookie_token
        }
      });
      expect(navigate).not.toHaveBeenCalled();
      expect(setErrorMessage).toHaveBeenCalledWith('Failed to submit URL. Please try again.');
    });
  });

  test('Should set an error message when access token is invalid', async () => {
    assumeLoggedIn();
    (axios.post as jest.Mock).mockRejectedValue({
      response: {
      data: {
        message: 'error message'
      },
      status: 401
      }
    });

    const { getByLabelText, getByRole } = render(
      <MemoryRouter>
        <ShareVideo setErrorMessage={setErrorMessage} />
      </MemoryRouter>
    );

    fireEvent.change(getByLabelText('Youtube URL'), { target: { value: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' } });
    fireEvent.click(getByRole('button', { name: 'Share' }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:1234/api/user/v1/videos', { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }, {
        headers: {
          Authorization: cookie_token
        }
      });
      expect(navigate).not.toHaveBeenCalled();
      expect(setErrorMessage).toHaveBeenCalledWith('You need to re-login to continue');
    });
  });
});
