import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../logo.svg';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface User {
  id: string;
  email: string;
  token: string;
}

function Header({ setErrorMessage }: { setErrorMessage: (errorMessage: any) => void }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
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

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://e1dc06b594ce46c98593aca2d663a3b0.api.mockbin.io/', {
      // const response = await axios.post('https://febcaaa116734ffcabd08028c87b883c.api.mockbin.io/', { //TODO: failed to login
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

  const handleLogout = async () => {
    try {
      await axios.post('https://e1dc06b594ce46c98593aca2d663a3b0.api.mockbin.io/');
      // await axios.post('https://febcaaa116734ffcabd08028c87b883c.api.mockbin.io/'); // TODO: failed to logout
      setUser(null);
      setIsLoggedIn(false);
      Cookies.remove('id');
      Cookies.remove('email');
      Cookies.remove('token');
      navigate('/');
    } catch (e: any) {
      setErrorMessage(e.response.data.message);
    }
  };

  return (
    <header>
      <Link to="/" className='home-link'>
        <img src={logo} className='logo' />
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
            <button className='btn btn-login' onClick={handleLogin}>Login/Register</button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
