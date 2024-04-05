import { render } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useCheckLogin } from '../../hooks/useCheckLogin';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('js-cookie', () => ({
  get: jest.fn(),
}));

const TestComponent = () => {
  useCheckLogin();
  return null;
};

describe('useCheckLogin', () => {
  let navigate = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(navigate);
  });

  test('should navigate to / when token is not present', () => {
    (Cookies.get as jest.Mock).mockReturnValue(undefined);
    render(<TestComponent />);

    expect(navigate).toHaveBeenCalledWith('/');
  });

  test('should not navigate when token is present', () => {
    (Cookies.get as jest.Mock).mockReturnValue('abc123');
    render(<TestComponent />);

    expect(navigate).not.toHaveBeenCalled();
  });
});
