'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { AnalysisResponse } from '@/lib/types';
import { AudioUploader } from '@/components/AudioUploader/AudioUploader';
import { AudioPlayer } from '@/components/AudioPlayer/AudioPlayer';
import { ResultsDisplay } from '@/components/ResultsDisplay/ResultsDisplay'; // 1. IMPORT

export default function Home() {
  // State for the application
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setAnalysis(null); // Clear previous analysis
    setError(null);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please upload an audio file first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    const formData = new FormData();
    formData.append('audio', file);

    try {
      const response = await fetch('/api/analyze-call', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const result: AnalysisResponse = await response.json();
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>AI Call Feedback System</h1>
        <p>
          Upload a call recording to get instant feedback from our AI agent
         .
        </p>
      </header>

      <div className={styles.content}>
        {/* --- SECTION 1: UPLOAD & PROCESS --- */}
        <div className={styles.uploaderSection}>
          <h2>1. Upload Audio</h2>

          <AudioUploader
            onFileSelect={handleFileSelect}
            disabled={isLoading}
          />

          {file && <AudioPlayer file={file} />}

          <button
            onClick={handleSubmit}
            disabled={isLoading || !file}
            className={styles.processButton}
          >
            {isLoading ? 'Processing...' : 'Process Call'}
          </button>
        </div>

        {/* --- SECTION 2: RESULTS --- */}
        <div className={styles.resultsSection}>
          <h2>2. View Feedback</h2>

          {isLoading && <p>Loading feedback...</p>}
          {error && <p className={styles.errorText}>Error: {error}</p>}

          {/* 2. REPLACE the old placeholder... */}
          {/*
          {analysis && (
            <div className={styles.resultsPlaceholder}>
              <h3>Results:</h3>
              <pre>{JSON.stringify(analysis, null, 2)}</pre>
            </div>
          )}
          */}

          {/* ...WITH the new ResultsDisplay component */}
          {analysis && <ResultsDisplay analysis={analysis} />}
          {/* END OF REPLACEMENT */}

        </div>
      </div>
    </main>
  );
}