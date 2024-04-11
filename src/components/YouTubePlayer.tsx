import YouTube from 'react-youtube';

function YouTubePlayer({ videoId }: { videoId: any }) {
  const opts = {
    width: '560',
    height: '315',
    playerVars: {
      autoplay: 0,
      controls: 1,
      modestbranding: 1,
    },
  };

  return (
    <div className='video-wrapper'>
      <YouTube videoId={videoId} opts={opts} />
    </div>
  );
}

export default YouTubePlayer;
