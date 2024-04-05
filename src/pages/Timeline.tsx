import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import '../assets/css/Timeline.css';

interface Video {
  embedUrl: string;
  title: string;
  sharedBy: string;
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
    // axios.get(`https://38471cd915f74ff986d67959d6adc46b.api.mockbin.io/`) //TODO: failed to load more videos
    axios.get(`https://f29b6a67fe134713b8875410e7181093.api.mockbin.io/?page=${page}&limit=5`)
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
        <iframe
          width="560"
          height="315"
          src={video.embedUrl}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ marginRight: '20px' }}
        ></iframe>
        <div>
          <h2 className='movie-title'>{video.title}</h2>
          <p>Shared by: {video.sharedBy}</p>
          <p>{video.description}</p>
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
