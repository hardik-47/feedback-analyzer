import { AnalysisResponse, AnalysisScores } from '@/lib/types';
import { CALL_PARAMETERS } from '@/lib/parameters';
import styles from './ResultsDisplay.module.css';

interface ResultsDisplayProps {
  analysis: AnalysisResponse;
}

export function ResultsDisplay({ analysis }: ResultsDisplayProps) {
  const { scores, overallFeedback, observation } = analysis;

  
  const totalAchievedScore = Object.values(scores).reduce(
    (sum, score) => sum + score,
    0
  );


  const totalPossibleScore = CALL_PARAMETERS.reduce(
    (sum, param) => sum + param.weight,
    0
  );

  return (
    <div className={styles.resultsContainer}>
      {/*Text Fields  */}
      <div className={styles.feedbackSection}>
        <div className={styles.feedbackItem}>
          <label htmlFor="overallFeedback">Overall Feedback</label>
          <textarea
            id="overallFeedback"
            readOnly
            value={overallFeedback}
            rows={4}
          />
        </div>
        <div className={styles.feedbackItem}>
          <label htmlFor="observation">Observation</label>
          <textarea
            id="observation"
            readOnly
            value={observation}
            rows={4}
          />
        </div>
      </div>

      <hr className={styles.divider} />

      {/* Scores*/}
      <div className={styles.scoresSection}>
        <h3>
          Evaluation Scores (Total: {totalAchievedScore} / {totalPossibleScore})
        </h3>
        <ul className={styles.scoreList}>
          {CALL_PARAMETERS.map((param) => {
            // we here get the score for this parameter from the analysis object
            const score = scores[param.key as keyof AnalysisScores];

            return (
              <li key={param.key} className={styles.scoreItem}>
                <span className={styles.scoreName}>{param.name}</span>
                <span className={styles.scoreValue}>
                  {score} / {param.weight}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}