"use client";

import { useState, useEffect, useRef } from "react";
import Flashcard from "./Flashcard";
import { FiShuffle, FiArrowLeft, FiArrowRight, FiList } from "react-icons/fi";

interface Card {
  id: number;
  question: string;
  answer: string;
  flagged: boolean;
}

interface CardListProps {
  initialCards: { question: string; answer: string }[];
}

export default function CardList({ initialCards }: CardListProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false);
  const [flaggedCount, setFlaggedCount] = useState(0);
  // Add a ref to keep track of the current card's flip state
  const flipStateRef = useRef<boolean>(false);
  // Add a state to force re-render of the Flashcard component
  const [forceResetKey, setForceResetKey] = useState(0);

  // Generate IDs for cards when they're loaded
  useEffect(() => {
    if (initialCards.length > 0) {
      const cardsWithIds = initialCards.map((card, index) => ({
        id: index,
        question: card.question,
        answer: card.answer,
        flagged: false,
      }));
      setCards(cardsWithIds);
      setCurrentIndex(0);
      setShowFlaggedOnly(false);
      setFlaggedCount(0);
      resetFlipState();
    }
  }, [initialCards]);

  // Keep track of flagged count
  useEffect(() => {
    setFlaggedCount(cards.filter((card) => card.flagged).length);
  }, [cards]);

  const visibleCards = showFlaggedOnly
    ? cards.filter((card) => card.flagged)
    : cards;

  // Helper function to reset flip state
  const resetFlipState = () => {
    flipStateRef.current = false;
    setForceResetKey((prev) => prev + 1);
  };

  const handleFlag = () => {
    if (visibleCards.length === 0) return;

    setCards(
      cards.map((card) =>
        card.id === visibleCards[currentIndex].id
          ? { ...card, flagged: !card.flagged }
          : card
      )
    );
  };

  const handleShuffle = () => {
    if (visibleCards.length <= 1) return;

    const shuffled = [...visibleCards].sort(() => Math.random() - 0.5);

    // Create a new array with all cards, but with the visible ones shuffled
    const newCards = [...cards];
    for (let i = 0; i < shuffled.length; i++) {
      const cardIndex = newCards.findIndex((c) => c.id === shuffled[i].id);
      if (cardIndex !== -1) {
        newCards[cardIndex] = shuffled[i];
      }
    }

    setCards(newCards);
    setCurrentIndex(0);
    resetFlipState();
  };

  const handlePrevious = () => {
    if (visibleCards.length === 0) return;
    setCurrentIndex((current) =>
      current === 0 ? visibleCards.length - 1 : current - 1
    );
    resetFlipState();
  };

  const handleNext = () => {
    if (visibleCards.length === 0) return;
    setCurrentIndex((current) =>
      current === visibleCards.length - 1 ? 0 : current + 1
    );
    resetFlipState();
  };

  const toggleFlaggedView = () => {
    setShowFlaggedOnly(!showFlaggedOnly);
    setCurrentIndex(0);
    resetFlipState();
  };

  // Function to keep track of current flip state
  const handleFlipStateChange = (isFlipped: boolean) => {
    flipStateRef.current = isFlipped;
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "f") {
        handleFlag();
      } else if (e.key === " ") {
        // Prevent default space behavior (usually scrolling)
        e.preventDefault();
        // Flip state will be handled by the Flashcard component
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [visibleCards, currentIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  if (cards.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">
          No cards available. Please upload a CSV file.
        </p>
      </div>
    );
  }

  if (showFlaggedOnly && visibleCards.length === 0) {
    return (
      <div>
        <div className="mb-4 text-center">
          <button
            onClick={toggleFlaggedView}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <FiList className="h-4 w-4" />
            Show All Cards
          </button>
        </div>
        <div className="text-center p-8 bg-muted/20 rounded-lg">
          <p className="text-muted-foreground">No flagged cards available.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Flag cards by pressing &apos;F&apos; or clicking the flag icon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={toggleFlaggedView}
          className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            showFlaggedOnly
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <FiList className="h-4 w-4" />
          {showFlaggedOnly ? "Show All Cards" : `Flagged (${flaggedCount})`}
        </button>

        <div className="flex items-center gap-4">
          <div className="text-sm font-medium">
            {currentIndex + 1} / {visibleCards.length}
          </div>

          <button
            onClick={handleShuffle}
            className="inline-flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/90 transition-colors"
            disabled={visibleCards.length <= 1}
          >
            <FiShuffle className="h-4 w-4" />
            Shuffle
          </button>
        </div>
      </div>

      {visibleCards.length > 0 && (
        <div>
          <Flashcard
            key={`card-${visibleCards[currentIndex].id}-${forceResetKey}`}
            question={visibleCards[currentIndex].question}
            answer={visibleCards[currentIndex].answer}
            onFlag={handleFlag}
            isFlagged={visibleCards[currentIndex].flagged}
            onFlipStateChange={handleFlipStateChange}
            allowSpaceFlip={true}
          />

          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={handlePrevious}
              className="inline-flex items-center gap-2 rounded-md bg-primary/10 px-5 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
              aria-label="Previous card"
            >
              <FiArrowLeft className="h-5 w-5" />
              <span className="sr-only md:not-sr-only">Previous</span>
            </button>

            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-md bg-primary/10 px-5 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
              aria-label="Next card"
            >
              <span className="sr-only md:not-sr-only">Next</span>
              <FiArrowRight className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 text-center text-xs text-muted-foreground">
            <p>
              Keyboard shortcuts: <span className="font-mono">←</span> Previous,{" "}
              <span className="font-mono">→</span> Next,{" "}
              <span className="font-mono">F</span> Flag,{" "}
              <span className="font-mono">Space</span> Flip
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
