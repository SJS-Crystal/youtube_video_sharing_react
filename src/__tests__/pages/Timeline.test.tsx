import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import Timeline from '../../pages/Timeline';

jest.mock('axios');

global.IntersectionObserver = class IntersectionObserver {
  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {}
  root: Element | null = null;
  rootMargin: string = '';
  thresholds: number[] = [];
  takeRecords: () => IntersectionObserverEntry[] = () => [];
  disconnect() {}
  observe(element: Element) {}
  unobserve(element: Element) {}
};

describe('Timeline', () => {
  test('Should render the timeline component with videos', async () => {
    const mockResponse = {
      data: {
        data: [
          {
            youtube_id: 'DHKeufhJD-2',
            title: 'Video 1',
            shared_by: 'User 1',
            description: 'Description 1',
          },
          {
            youtube_id: 'DHKHJufh566',
            title: 'Video 2',
            shared_by: 'User 2',
            description: 'Description 2',
          },
        ],
      },
    };
    (axios.get as jest.Mock).mockResolvedValue(mockResponse);

    render(<Timeline />);

    await waitFor(() => {
      expect(screen.getByText('Video 1')).toBeInTheDocument();
      expect(screen.getByText('Shared by: User 1')).toBeInTheDocument();
      expect(screen.getByText('Description 1')).toBeInTheDocument();
      expect(screen.getByText('Video 2')).toBeInTheDocument();
      expect(screen.getByText('Shared by: User 2')).toBeInTheDocument();
      expect(screen.getByText('Description 2')).toBeInTheDocument();
    });
  });

  test('Should load more videos when scrolling to the end of the timeline', async () => {
    const mockResponse3 = {
      data: {
        data: [
          {
            youtube_id: 'DHKeufhJD-3',
            title: 'Video 3',
            shared_by: 'User 3',
            description: 'Description 3',
          },
        ],
      }
    };
    const mockResponse4 = {
      data: {
        data: [
          {
            youtube_id: 'DHKeufhJD-4',
            title: 'Video 4',
            shared_by: 'User 4',
            description: 'Description 4',
          },
        ],
      }
    };
    (axios.get as jest.Mock)
      .mockResolvedValueOnce(mockResponse3)
      .mockResolvedValueOnce(mockResponse4);

    render(<Timeline />);

    await waitFor(() => {
      expect(screen.getByText('Video 3')).toBeInTheDocument();
      expect(screen.getByText('Shared by: User 3')).toBeInTheDocument();
      expect(screen.getByText('Description 3')).toBeInTheDocument();
    });

    const timelineElement = document.querySelector('.timeline');
    if (timelineElement) {
      timelineElement.scrollTop = timelineElement.scrollHeight;
    }

    render(<Timeline />);

    await waitFor(() => {
      expect(screen.getByText('Video 4')).toBeInTheDocument();
      expect(screen.getByText('Shared by: User 4')).toBeInTheDocument();
      expect(screen.getByText('Description 4')).toBeInTheDocument();
    });
  });
});
