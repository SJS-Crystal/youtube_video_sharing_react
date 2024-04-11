import { useEffect, useState } from 'react';
import { createConsumer } from "@rails/actioncable";
import '../assets/css/Notification.css';
import { trimString } from '../utils/string';
import Cookies from 'js-cookie';

const websocketUrl = process.env.REACT_APP_WEBSOCKET_URL;
interface Notification {
  id: number;
  title: string;
  shared_by: string;
  youtube_id: string;
}

function Notification({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [id, setId] = useState(0);

  useEffect(() => {
    if (!isLoggedIn) return;
    const token = Cookies.get('token')
    try {
      const consumer = createConsumer(`${websocketUrl}?token=${token}`);
      const subscription = consumer.subscriptions.create({ channel: 'NotificationChannel'}, {
        received: (data: any) => {
          const newNotification = { id: id, title: data.title, shared_by: data.shared_by, youtube_id: data.youtube_id};
          setNotifications((notifications: Notification[]) => [...notifications, newNotification]);

          setTimeout(() => {
            setNotifications((notifications: Notification[]) => notifications.filter(notification => notification.id !== newNotification.id));
          }, 10000);

          setId(id + 1);
        }
      });

      return () => {
        if (subscription) subscription.unsubscribe();
      };
    } catch (error) {

    }
  }, [id, isLoggedIn]);

  if (notifications.length === 0) return <></>;

  return (
    <div className='notification-wrapper'>
      {notifications.map((notification) => (
        <div key={notification.id} className='notification-item'>
          <div className='noti-thumbnail'>
            <img src={`https://i.ytimg.com/vi/${notification.youtube_id}/default.jpg`} alt='thumbnail' />
          </div>
          <div className='noti-detail'>
            <div className='noti-shareby'>Shared by <b>{trimString(notification.shared_by, 20)}</b></div>
            <div>{trimString(notification.title, 125)}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notification;
