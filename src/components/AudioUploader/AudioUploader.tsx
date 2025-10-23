'use client';

import { useState, useRef, DragEvent } from 'react';
import styles from './AudioUploader.module.css';

interface AudioUploaderProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export function AudioUploader({
  onFileSelect,
  disabled = false,
}: AudioUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | null) => {
    if (file && (file.type === 'audio/mpeg' || file.type === 'audio/wav')) {
      onFileSelect(file);
    } else {
     
      alert('Invalid file type. Please upload an MP3 or WAV file.');
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

 
  const uploaderClasses = [
    styles.uploader,
    isDragOver ? styles.dragOver : '',
    disabled ? styles.disabled : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={uploaderClasses}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="audio/mp3, audio/wav"
        style={{ display: 'none' }} 
        disabled={disabled}
      />
      <p>
        <strong>Drag and drop</strong> an audio file here,
      </p>
      <p>or click to select a file</p>
      <p className={styles.fileTypes}>(.mp3 or .wav only)</p>
    </div>
  );
}