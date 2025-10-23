'use client';

import { useState } from 'react';
import styles from './page.module.css'; // We will create this next
import { AnalysisResponse } from '@/lib/types';

export default function Home() {
  // State for the application
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles the file selection from a simple input.
   * We will replace this with a drag-and-drop component later.
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setAnalysis(null); // Clear previous analysis
      setError(null);
    }
  };

  /**
   * Handles the submission to the API [cite: 13]
   */
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
        </p>
      </header>

      <div className={styles.content}>
        {/* --- SECTION 1: UPLOAD & PROCESS --- */}
        <div className={styles.uploaderSection}>
          <h2>1. Upload Audio</h2>
          {/* This is a simple placeholder. We will build a
            proper Drag/Drop component next[cite: 11].
          */}
          <input
            type="file"
            accept="audio/mp3, audio/wav"
            onChange={handleFileChange}
            disabled={isLoading}
          />

          {/* This is a simple placeholder. We will build a
            proper AudioPlayer component next[cite: 12].
          */}
          {file && (
            <div className={styles.playerPlaceholder}>
              <p>
                <strong>Selected file:</strong> {file.name}
              </p>
              <audio controls src={URL.createObjectURL(file)} />
            </div>
          )}

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

          {/* This is a simple placeholder. We will build a
            proper ResultsDisplay component next [cite: 14-16].
          */}
          {analysis && (
            <div className={styles.resultsPlaceholder}>
              <h3>Results:</h3>
              <pre>{JSON.stringify(analysis, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}