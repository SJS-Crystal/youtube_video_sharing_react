import { render, screen, waitFor } from '@testing-library/react';
import React, { Dispatch, SetStateAction } from 'react'
import Notification from '../../components/Notification';

type NotificationType = {
  id: number;
  title: string;
  shared_by: string;
  youtube_id: string;
};
const realUseState: <T>(initialState: T | (() => T)) => [T, Dispatch<SetStateAction<T>>] = React.useState;

describe('Notification', () => {
  test('Should render no notification when there is no notification', async () => {

    jest
      .spyOn(React, 'useState')
      .mockImplementation(() => realUseState([]) as [unknown, Dispatch<SetStateAction<unknown>>])

    render(<Notification isLoggedIn={true} />);

    await waitFor(() => {
      expect(screen.queryByText('Shared by')).not.toBeInTheDocument();
      expect(document.querySelector('.notification-wrapper')).not.toBeInTheDocument();
    })
  });

  test('Should render notification when notification exist', async () => {
    const mockNotifications: NotificationType[] = [
      {
        id: 1,
        title: 'Notification 1',
        shared_by: 'User 1',
        youtube_id: 'abc123',
      }
    ];

    jest
      .spyOn(React, 'useState')
      .mockImplementation(() => realUseState(mockNotifications) as [unknown, Dispatch<SetStateAction<unknown>>])

    render(<Notification isLoggedIn={true} />);

    await waitFor(() => {
      expect(screen.queryByText('Shared by')).toBeInTheDocument();
      expect(screen.getByText(mockNotifications[0]['title'])).toBeInTheDocument();
      const notification_wrapper = document.querySelector('.notification-wrapper');
      expect(notification_wrapper).toBeInTheDocument();
      mockNotifications.forEach((notification) => {
        expect(screen.getByText(mockNotifications[0]['shared_by'])).toBeInTheDocument();
        expect(screen.getByAltText('thumbnail')).toHaveAttribute(
          'src',
          `https://i.ytimg.com/vi/${mockNotifications[0]['youtube_id']}/default.jpg`
        );
      });
    })
  });

  test('Should render many notifications when there are many notifications', async () => {
    const mockNotifications: NotificationType[] = [
      {
        id: 1,
        title: 'Notification 1',
        shared_by: 'User 1',
        youtube_id: 'abc123',
      },
      {
        id: 2,
        title: 'Notification 2',
        shared_by: 'User 2',
        youtube_id: 'afdkjf',
      }
    ];

    jest
      .spyOn(React, 'useState')
      .mockImplementation(() => realUseState(mockNotifications) as [unknown, Dispatch<SetStateAction<unknown>>])

    render(<Notification isLoggedIn={true} />);

    await waitFor(() => {
      expect(document.querySelector('.notification-wrapper')).toBeInTheDocument();
      expect(screen.getAllByText(`Shared by`).length).toBe(2);
      expect(screen.getAllByAltText('thumbnail').length).toBe(2);
      expect(screen.getByText(mockNotifications[0]['title'])).toBeInTheDocument();
      expect(screen.getByText(mockNotifications[1]['title'])).toBeInTheDocument();
    })
  });
});
