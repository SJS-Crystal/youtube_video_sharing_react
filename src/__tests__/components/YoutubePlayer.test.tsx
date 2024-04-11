import { render } from '@testing-library/react';
import YouTubePlayer from '../../components/YouTubePlayer';

describe('YouTubePlayer', () => {
  test('Should render the YouTubePlayer component with the provided videoId', () => {
    const videoId = 'abc123';
    render(<YouTubePlayer videoId={videoId} />);

    const shareVideoElement = document.querySelector('.video-wrapper');
    expect(shareVideoElement).toBeInTheDocument();
  });
});
