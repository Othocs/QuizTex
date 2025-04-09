"use client";

import { useState } from "react";
import FileUploader from "./components/FileUploader";
import CardList from "./components/CardList";
import { FiDownload, FiFileText, FiGithub } from "react-icons/fi";
import Link from "next/link";

interface Card {
  question: string;
  answer: string;
}

export default function Home() {
  const [cards, setCards] = useState<Card[]>([]);
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleCardsLoaded = (loadedCards: Card[]) => {
    setCards(loadedCards);
    setUploadComplete(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="py-6 sticky top-0 z-10 backdrop-blur bg-background/80">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <div
              onClick={() => setUploadComplete(false)}
              className="cursor-pointer"
            >
              <img
                src="/icon_quiztex.png"
                alt="QuizTex Icon"
                className="h-18 w-auto"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/sample.csv"
              download
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <FiDownload className="h-4 w-4" />
              <span className="hidden sm:inline">Sample CSV</span>
            </Link>
            <Link
              href="https://github.com/Othocs/QuizTex.git"
              target="_blank"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <FiGithub className="h-4 w-4" />
              <span className="hidden sm:inline">GitHub</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {!uploadComplete ? (
          <div className="space-y-8">
            <div className="space-y-3 text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent inline-block">
                Welcome to QuizTex
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Create interactive flashcards with LaTeX support
              </p>
            </div>

            <div className="p-8 bg-card rounded-xl shadow-lg">
              <FileUploader onCardsLoaded={handleCardsLoaded} />
            </div>

            <div className="space-y-4 p-6 bg-primary/5 rounded-xl">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <FiFileText className="h-5 w-5 text-primary" />
                How to use
              </h3>
              <ol className="space-y-2 list-decimal list-inside text-muted-foreground ml-2">
                <li>
                  Prepare a CSV file with two columns: Question and Answer
                </li>
                <li>
                  Include LaTeX expressions in your content using standard LaTeX
                  syntax
                </li>
                <li>Upload your file using the form above</li>
                <li>
                  Study with interactive flashcards - click cards to flip them
                </li>
                <li>
                  Flag important cards by pressing &apos;F&apos; or clicking the
                  flag icon
                </li>
              </ol>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center">
              <h2 className="text-2xl font-bold">Your Flashcards</h2>
              <button
                onClick={() => setUploadComplete(false)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Upload a different file
              </button>
            </div>

            <div className="mb-16">
              <CardList initialCards={cards} />
            </div>
          </div>
        )}
      </main>

      <footer className="mt-auto py-6 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <p>QuizTex - A flashcard app with LaTeX support</p>
        </div>
      </footer>
    </div>
  );
}
