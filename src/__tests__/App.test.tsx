import { render, screen } from '@testing-library/react';
import { MemoryRouter, BrowserRouter } from 'react-router-dom';
import App from '../App';

jest.mock('../components/Header', () => () => <div>Mocked Header</div>);
jest.mock('../components/ErrorMessage', () => () => <div>Mocked ErrorMessage</div>);
jest.mock('../components/Notification', () => () => <div>Mocked Notification</div>);
jest.mock('../pages/Timeline', () => () => <div>Mocked Timeline</div>);
jest.mock('../pages/ShareVideo', () => () => <div>Mocked ShareVideo</div>);

describe('App', () => {
  const renderWithMemoryRouter = (initialEntries: string[] = ['']) => {
    render(
      <MemoryRouter initialEntries={initialEntries}>
        <App />
      </MemoryRouter>
    );
  };

  test('Should renders Header component', async () => {
    renderWithMemoryRouter();
    expect(screen.getByText('Mocked Header')).toBeInTheDocument();
  });

  test('Should renders ErrorMessage component', async () => {
    renderWithMemoryRouter();
    expect(screen.getByText('Mocked ErrorMessage')).toBeInTheDocument();
  });

  test('Should renders Notification component', async () => {
    renderWithMemoryRouter();
    expect(screen.getByText('Mocked Notification')).toBeInTheDocument();
  });

  test('Should navigate to share page when access /share path', () => {
    renderWithMemoryRouter(['/share']);
    expect(screen.getByText('Mocked ShareVideo')).toBeInTheDocument();
  });

  test('Should navigate to home page for unknown routes', () => {
    renderWithMemoryRouter(['/unknown']);
    expect(screen.getByText('Mocked Timeline')).toBeInTheDocument();
  });
});
