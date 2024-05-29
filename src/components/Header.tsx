import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../logo.svg';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const apiUrl = process.env.REACT_APP_API_URL;

interface User {
  id: string;
  email: string;
  token: string;
}

interface HeaderProps {
  setErrorMessage: (errorMessage: any) => void;
  setIsLoggedIn: (isLoggedIn: any) => void;
  isLoggedIn: any;
}

function Header({
  setErrorMessage,
  setIsLoggedIn,
  isLoggedIn
}: HeaderProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  useEffect(() => {
    const token = Cookies.get('token');
    const email = Cookies.get('email');
    const id = Cookies.get('id');

    if (token && email && id) {
      setUser({ id, email, token });
      setIsLoggedIn(true);
    }
  }, []);

  const handleAuth = async (url: string) => {
    try {
      const response = await axios.post(url, {
        email,
        password,
      });
      const authRes: { id: string, email: string, token: string } = response.data.data;
      setUser({ id: authRes['id'], email: authRes['email'], token: authRes['token'] });
      setErrorMessage(null);
      setIsLoggedIn(true);
      Cookies.set('id', authRes['id'], { expires: 7 });
      Cookies.set('email', authRes['email'], { expires: 7 });
      Cookies.set('token', authRes['token'], { expires: 7 });
    } catch (e: any) {
      setErrorMessage(e.response.data.message);
    }
  };

  const handleLogin = async () => {
    await handleAuth(`${apiUrl}/api/user/v1/users/login`);
  };

  const handleRegister = async () => {
    await handleAuth(`${apiUrl}/api/user/v1/users`);
  };

  const handleLogout = async () => {
    const token = Cookies.get('token');
    try {
      await axios.delete(`${apiUrl}/api/user/v1/users/logout`, {
        headers: {
          Authorization: `${token}`,
        },
      });
    } catch (error) {
    }

    setUser(null);
    setIsLoggedIn(false);
    Cookies.remove('id');
    Cookies.remove('email');
    Cookies.remove('token');
    navigate('/');
  };

  return (
    <header>
      <Link to="/" className='home-link'>
        <img src={logo} className='logo' alt='' />
        <span>Funny Movies</span>
      </Link>
      <div className="user-info">
        {isLoggedIn ? (
          <>
            <span>Welcome {user?.email}</span>
            <Link to="/share" className='btn'>Share Video</Link>
            <button className='btn btn-logout' onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <input className='input' type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input className='input' type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            <button className='btn btn-login' onClick={handleLogin}>Login</button>/
            <button className='btn btn-login' onClick={handleRegister}>Register</button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
