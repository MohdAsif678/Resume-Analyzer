import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import "./ResumeAnalyzer.css";

const ResumeAnalyzer = () => {
  const [resumeText, setResumeText] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const requiredKeywords = [
    "team",
    "experience",
    "skills",
    "project",
    "Leadership",
    "Problem-Solving",
    "Collaboration",
    "Technical Skills",
    "Development",
    "Optimization",
    "Programming",
    "Visualization",
    "Strategy",
  ];

  const analyzeText = (text) => {
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const score = wordCount < 500 ? 50 : 90;

    const matchedKeywords = requiredKeywords.filter((keyword) =>
      text.toLowerCase().includes(keyword.toLowerCase())
    );
    const matchCount = matchedKeywords.length;

    const missingKeywords = requiredKeywords.filter(
      (keyword) => !text.toLowerCase().includes(keyword.toLowerCase())
    );

    setAnalysisResult({
      wordCount,
      score,
      missingKeywords,
      matchCount,
      matchedKeywords,
    });
  };

  const handlePDFUpload = async () => {
    if (selectedFile) {
      const allowedTypes = ["application/pdf", "text/plain"];
      if (!allowedTypes.includes(selectedFile.type)) {
        alert("Unsupported file format. Please upload a .pdf or .txt file.");
        return;
      }

      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const response = await fetch(
          "http://localhost:5000/api/resume/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        setResumeText(data.text);
        analyzeText(data.text);
      } catch (error) {
        alert("PDF upload failed");
      }
    }
  };

  const chartData = {
    labels: ["Resume Score", "Word Count"],
    datasets: [
      {
        label: "Analysis Metrics",
        data: analysisResult
          ? [analysisResult.score, analysisResult.wordCount]
          : [0, 0],
        backgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };
  const generateReport = () => {
    if (!analysisResult) return;

    const report = `
    Resume Score: ${analysisResult.score}/100
    Word Count: ${analysisResult.wordCount}
    Keywords Matched: ${analysisResult.matchCount} / ${requiredKeywords.length}
    Matched Keywords: ${analysisResult.matchedKeywords.join(", ") || "None"}
    Missing Keywords: ${analysisResult.missingKeywords.join(", ") || "None"}
  `.trim();

    const blob = new Blob([report], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "resume-analysis.txt";
    link.click();
  };

  return (
    <div className="resume-analyzer-container">
      <h1 className="heading">Resume Analyzer📄</h1>

      <input
        type="file"
        accept=".txt,.pdf"
        className="file-input"
        onChange={(e) => setSelectedFile(e.target.files[0])}
      />
      <button className="submit-btn" onClick={handlePDFUpload}>
        Analyze Resume
      </button>

      {analysisResult && (
        <div className="analysis-results">
          <p>
            <strong>Word Count:</strong> {analysisResult.wordCount}
          </p>
          <p>
            <strong>Resume Score:</strong> {analysisResult.score} / 100
          </p>
          <p>
            <strong>Keywords Matched:</strong> {analysisResult.matchCount} /{" "}
            {requiredKeywords.length}
          </p>

          {analysisResult.matchedKeywords.length > 0 && (
            <p>
              <strong>Matched Keywords:</strong>{" "}
              {analysisResult.matchedKeywords.join(", ")}
            </p>
          )}

          {analysisResult.missingKeywords.length > 0 ? (
            <p>
              <strong>Missing Keywords:</strong>{" "}
              {analysisResult.missingKeywords.join(", ")}
            </p>
          ) : (
            <p>✅ Great job! Your resume includes all essential keywords!</p>
          )}

          <Bar data={chartData} />

          <button className="submit-btn" onClick={generateReport}>
            📥Download Report
          </button>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
