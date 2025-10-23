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

  
  useEffect(() => {
    
    const objectUrl = URL.createObjectURL(file);
    setAudioSrc(objectUrl);
    setIsPlaying(false); 

    
    return () => {
      URL.revokeObjectURL(objectUrl);
      setAudioSrc(''); 
    };
  }, [file]); 

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
          controls 
          onEnded={handlePlaybackEnded}
          className={styles.audioElement}
        />
      </div>
    </div>
  );
}