import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/ShareVideo.css';
import { useCheckLogin } from '../hooks/useCheckLogin';
import Cookies from 'js-cookie';

function ShareVideo({ setErrorMessage }: { setErrorMessage: (errorMessage: any) => void }){
  useCheckLogin();
  const [url, setUrl] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const token = Cookies.get('token');
      await axios.post('http://localhost:1234/api/user/v1/videos', {
        url: url,
      }, {
        headers: {
          Authorization: `${token}`,
        },
      });

      navigate('/');
    } catch (error: any) {
      console.log(error);
      if (error.response.status === 401) {
        setErrorMessage('You need to re-login to continue');
        return;
      }
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <form className='share-form' onSubmit={handleSubmit}>
      <fieldset>
        <legend>Share Video</legend>
        <div className='form-grid'>
          <label htmlFor="url">Youtube URL</label>
          <input id="url" type="text" className="input" value={url} onChange={(event) => setUrl(event.target.value)} />
          <div></div>
          <button type="submit" className="btn">Share</button>
        </div>
      </fieldset>
    </form>
  );
}

export default ShareVideo;
