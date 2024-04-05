import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import ShareVideo from '../../pages/ShareVideo';
import * as router from 'react-router';
import Cookies from 'js-cookie';

jest.mock('axios');
const setErrorMessage = jest.fn();
const navigate = jest.fn();

const assumeLoggedIn = () => {
  Cookies.set('id', '123');
  Cookies.set('email', 'test@example.com');
  Cookies.set('token', 'abc123');
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
      expect(axios.post).toHaveBeenCalledWith('https://e1dc06b594ce46c98593aca2d663a3b0.api.mockbin.io/', { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' });
      expect(navigate).toHaveBeenCalledWith('/');
      expect(setErrorMessage).not.toHaveBeenCalled();
    });
  });

  test('Should set an error message on failure', async () => {
    assumeLoggedIn();
    (axios.post as jest.Mock).mockRejectedValue(new Error());

    const { getByLabelText, getByRole } = render(
      <MemoryRouter>
        <ShareVideo setErrorMessage={setErrorMessage} />
      </MemoryRouter>
    );

    fireEvent.change(getByLabelText('Youtube URL'), { target: { value: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' } });
    fireEvent.click(getByRole('button', { name: 'Share' }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('https://e1dc06b594ce46c98593aca2d663a3b0.api.mockbin.io/', { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' });
      expect(navigate).not.toHaveBeenCalled();
      expect(setErrorMessage).toHaveBeenCalledWith('Failed to submit URL. Please try again.');
    });
  });
});
