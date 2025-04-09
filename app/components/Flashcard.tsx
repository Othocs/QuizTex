"use client";

import { useState, useEffect } from "react";
import Latex from "react-latex-next";
import { FiFlag } from "react-icons/fi";

interface FlashcardProps {
  question: string;
  answer: string;
  onFlag: () => void;
  isFlagged: boolean;
  onFlipStateChange?: (isFlipped: boolean) => void;
  allowSpaceFlip?: boolean;
}

// Helper function to detect if text contains LaTeX
const containsLatex = (text: string): boolean => {
  // Common LaTeX patterns to detect
  const latexPatterns = [
    /\$.+?\$/, // Inline math: $...$
    /\\\(.+?\\\)/, // Inline math: \(...\)
    /\\\[.+?\\\]/, // Display math: \[...\]
    /\\begin\{.+?\}.+?\\end\{.+?\}/, // Environments: \begin{...}...\end{...}
    /\\[a-zA-Z]+(\{.+?\})?/, // Commands: \command{...}
  ];

  return latexPatterns.some((pattern) => pattern.test(text));
};

// Process content intelligently
const processContent = (
  text: string
): { isLatex: boolean; content: string } => {
  const hasLatex = containsLatex(text);

  // If it already has LaTeX markers, return as is
  if (hasLatex) {
    return { isLatex: true, content: text };
  }

  // Return plain text if no LaTeX detected
  return { isLatex: false, content: text };
};

export default function Flashcard({
  question,
  answer,
  onFlag,
  isFlagged,
  onFlipStateChange,
  allowSpaceFlip = false,
}: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    const newFlippedState = !flipped;
    setFlipped(newFlippedState);

    // Call the callback if provided
    if (onFlipStateChange) {
      onFlipStateChange(newFlippedState);
    }
  };

  // Handle spacebar key for flipping
  useEffect(() => {
    if (!allowSpaceFlip) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " ") {
        // Only handle space if it's not being used for something else (like input fields)
        const activeElement = document.activeElement;
        const isInputActive =
          activeElement instanceof HTMLInputElement ||
          activeElement instanceof HTMLTextAreaElement;

        if (!isInputActive) {
          e.preventDefault();
          handleFlip();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [flipped, allowSpaceFlip]); // eslint-disable-line react-hooks/exhaustive-deps

  // Prevent the flag button click from triggering card flip
  const handleFlagClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFlag();
  };

  // Process the content intelligently
  const processedQuestion = processContent(question);
  const processedAnswer = processContent(answer);

  // Render content based on whether it's LaTeX or plain text
  const renderContent = (processedContent: {
    isLatex: boolean;
    content: string;
  }) => {
    if (processedContent.isLatex) {
      // Use string type for Latex component
      return <Latex>{processedContent.content}</Latex>;
    }
    return processedContent.content;
  };

  return (
    <div className={`flashcard w-full h-72 ${flipped ? "flipped" : ""}`}>
      <div className="flashcard-inner relative w-full h-full">
        {/* Front of card */}
        <div
          className="flashcard-front absolute w-full h-full p-6 rounded-lg bg-card shadow-lg flex flex-col cursor-pointer"
          onClick={handleFlip}
        >
          <div className="absolute top-4 right-4">
            <button
              onClick={handleFlagClick}
              className={`p-2 rounded-full transition-colors ${
                isFlagged
                  ? "text-red-500"
                  : "text-muted-foreground hover:text-red-500"
              }`}
              aria-label={isFlagged ? "Unflag card" : "Flag card for review"}
              title="Press 'F' to flag"
            >
              <FiFlag className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center overflow-auto p-2">
            <div
              className={`text-lg font-medium text-center ${
                processedQuestion.isLatex ? "latex-content" : ""
              }`}
            >
              {renderContent(processedQuestion)}
            </div>
          </div>
          <div className="text-xs text-muted-foreground text-center mt-4">
            Click to flip (or press Space)
          </div>
        </div>

        {/* Back of card */}
        <div
          className="flashcard-back absolute w-full h-full p-6 rounded-lg bg-card shadow-lg flex flex-col cursor-pointer"
          onClick={handleFlip}
        >
          <div className="absolute top-4 right-4">
            <button
              onClick={handleFlagClick}
              className={`p-2 rounded-full transition-colors ${
                isFlagged
                  ? "text-red-500"
                  : "text-muted-foreground hover:text-red-500"
              }`}
              aria-label={isFlagged ? "Unflag card" : "Flag card for review"}
              title="Press 'F' to flag"
            >
              <FiFlag className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center overflow-auto p-2">
            <div
              className={`text-lg font-medium text-center ${
                processedAnswer.isLatex ? "latex-content" : ""
              }`}
            >
              {renderContent(processedAnswer)}
            </div>
          </div>
          <div className="text-xs text-muted-foreground text-center mt-4">
            Click to flip (or press Space)
          </div>
        </div>
      </div>
    </div>
  );
}
