"use client";

import { useState } from "react";
import { FiUpload } from "react-icons/fi";
import Papa from "papaparse";

interface FileUploaderProps {
  onCardsLoaded: (cards: { question: string; answer: string }[]) => void;
}

export default function FileUploader({ onCardsLoaded }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (file: File) => {
    // Check if it's a CSV file
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setError("Please upload a CSV file");
      return;
    }

    setError(null);

    // Read the file as text first to handle empty files
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;

      if (!content || content.trim() === "") {
        setError("The CSV file is empty");
        return;
      }

      // Parse the CSV with explicit delimiter
      Papa.parse(content, {
        delimiter: ",", // Explicitly set delimiter to comma
        header: false,
        skipEmptyLines: true, // Skip empty lines
        escapeChar: "\\", // Handle escape characters
        quoteChar: '"', // Use double quotes for quoting fields with special chars
        complete: (results) => {
          if (results.errors.length > 0) {
            setError("Error parsing CSV file: " + results.errors[0].message);
            return;
          }

          const data = results.data as string[][];
          const cards = data
            .filter(
              (row) => Array.isArray(row) && row.length >= 2 && row[0] && row[1]
            )
            .map((row) => ({
              question: row[0].trim(),
              answer: row[1].trim(),
            }));

          if (cards.length === 0) {
            setError("No valid data found in the CSV file");
            return;
          }

          onCardsLoaded(cards);
        },
        error: (error: Error) => {
          setError("Error parsing CSV file: " + error.message);
        },
      });
    };

    reader.onerror = () => {
      setError("Error reading the file");
    };

    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging ? "border-primary bg-primary/5" : "border-border"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <FiUpload className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-lg font-medium">Upload CSV File</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Drag and drop a CSV file or click to browse
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Format: Column 1 = Question, Column 2 = Answer (with LaTeX support)
        </p>
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          accept=".csv"
          className="sr-only"
          onChange={handleChange}
        />
        <div className="mt-4">
          <label
            htmlFor="file-upload"
            className="cursor-pointer inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Select File
          </label>
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
