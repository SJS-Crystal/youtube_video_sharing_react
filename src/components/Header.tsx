import { Link, useNavigate } from 'react-router-dom';
import logo from '../logo.svg';

function Header({ setErrorMessage }: { setErrorMessage: (errorMessage: any) => void }) {
  return (
    <header>
      <Link to="/" className='home-link'>
        <img src={logo} className='logo' />
        <span>Funny Movies</span>
      </Link>
      <div className="user-info">
        {false ? (
          <>
            <span>Welcome abc@gmail.com</span>
            <Link to="/share" className='btn'>Share Video</Link>
            <button className='btn btn-logout'>Logout</button>
          </>
        ) : (
          <>
            <input className='input' type="email" placeholder="Email"  />
            <input className='input' type="password" placeholder="Password" />
            <button className='btn btn-login'>Login/Register</button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
