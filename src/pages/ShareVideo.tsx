import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/ShareVideo.css';
import { useCheckLogin } from '../hooks/useCheckLogin';

function ShareVideo({ setErrorMessage }: { setErrorMessage: (errorMessage: any) => void }){
  useCheckLogin();
  const [url, setUrl] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await axios.post('https://e1dc06b594ce46c98593aca2d663a3b0.api.mockbin.io/', { url });
      // await axios.post('https://febcaaa116734ffcabd08028c87b883c.api.mockbin.io/', { url }); //TODO: failed to submit URL
      navigate('/');
    } catch (error) {
      setErrorMessage('Failed to submit URL. Please try again.');
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
