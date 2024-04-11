import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import YouTubePlayer from '../components/YouTubePlayer';
import '../assets/css/Timeline.css';
import '../components/YouTubePlayer';
import { trimString } from '../utils/string';

const apiUrl = process.env.REACT_APP_API_URL;
interface Video {
  youtube_id: string;
  title: string;
  shared_by: string;
  description: string;
}

function Timeline() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastVideoElementRef = useCallback((node: HTMLLIElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading]);

  useEffect(() => {
    setLoading(true);
    axios.get(`${apiUrl}/api/user/v1/videos?page=${page}&items=5`)
      .then(res => {
        setVideos(prevVideos => [...prevVideos, ...res.data.data]);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
      });
  }, [page]);

  const renderVideo = (video: Video, index: number) => {

    return (
      <li ref={index === videos.length - 1 ? lastVideoElementRef : null} key={index} className='timeline-item'>
        <YouTubePlayer videoId={video.youtube_id} />
        <div>
          <h2 className='movie-title'>{trimString(video.title, 75)}</h2>
          <p>Shared by: {video.shared_by}</p>
          <p>{trimString(video.description, 200)}</p>
        </div>
      </li>
    );
  };

  return (
    <div className='timeline'>
      {videos.map((video, index) => renderVideo(video, index))}
    </div>
  );
}

export default React.memo(Timeline);
