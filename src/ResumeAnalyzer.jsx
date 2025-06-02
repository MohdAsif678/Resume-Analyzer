import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import './ResumeAnalyzer.css';

const ResumeAnalyzer = () => {
  const [resumeText, setResumeText] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (resumeText.trim() !== '') {
        analyzeText(resumeText);
      } else {
        setAnalysisResult(null);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [resumeText]);

  const analyzeText = (text) => {
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const score = wordCount < 500 ? 50 : 90;
    const requiredKeywords = ['team', 'experience', 'skills', 'project','Leadership','Problem-Solving','Collaboration','Technical Skills','Development','Optimization','Programming','Visualization','Strategy'];
    const missingKeywords = requiredKeywords.filter(
      (keyword) => !text.toLowerCase().includes(keyword)
    );

    setAnalysisResult({ wordCount, score, missingKeywords });
  };

  const chartData = {
    labels: ['Resume Score', 'Word Count'],
    datasets: [
      {
        label: 'Analysis Metrics',
        data: analysisResult ? [analysisResult.score, analysisResult.wordCount] : [0, 0],
        backgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  return (
    <div className="resume-analyzer-container">
      <h1 className='heading'>Resume Analyzer</h1>
      <textarea
        className="resume-input"
        placeholder="Paste your resume text here..."
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
        rows="10"
      ></textarea>

      {analysisResult && (
        <div className="analysis-results">
          <p><strong>Word Count:</strong> {analysisResult.wordCount}</p>
          <p><strong>Resume Score:</strong> {analysisResult.score} / 100</p>
          {analysisResult.missingKeywords.length > 0 ? (
            <p><strong>Missing Keywords:</strong> {analysisResult.missingKeywords.join(', ')}</p>
          ) : (
            <p>Great job! Your resume includes all the essential keywords!</p>
          )}
          <Bar data={chartData} />
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;