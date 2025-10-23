'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './AudioPlayer.module.css';

interface AudioPlayerProps {
  file: File;
}

export function AudioPlayer({ file }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSrc, setAudioSrc] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);

  // Create an object URL when the file prop changes
  useEffect(() => {
    // Create a new object URL
    const objectUrl = URL.createObjectURL(file);
    setAudioSrc(objectUrl);
    setIsPlaying(false); // Reset play state

    // Cleanup function to revoke the object URL
    // This is crucial to prevent memory leaks
    return () => {
      URL.revokeObjectURL(objectUrl);
      setAudioSrc(''); // Clear the src
    };
  }, [file]); // Re-run only when the file object itself changes

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Sync our state if the audio playback ends naturally
  const handlePlaybackEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className={styles.playerContainer}>
      <p className={styles.fileName}>
        <strong>Selected file:</strong> {file.name}
      </p>
      <div className={styles.controlsWrapper}>
        <button onClick={togglePlayPause} className={styles.playButton}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <audio
          ref={audioRef}
          src={audioSrc}
          controls // Show native browser controls (timeline, volume)
          onEnded={handlePlaybackEnded}
          className={styles.audioElement}
        />
      </div>
    </div>
  );
}