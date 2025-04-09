# QuizTex

A modern web application for creating and studying flashcards with LaTeX support.

## Features

- **CSV Upload**: Easily import your questions and answers from a CSV file
- **LaTeX Support**: Display mathematical equations and formulas with LaTeX rendering
- **Interactive Flashcards**: Flip cards to reveal answers
- **Shuffle Functionality**: Randomize the order of cards for better learning
- **Flagging System**: Mark difficult cards for focused review
- **Modern UI**: Clean, responsive interface with an optimistic color palette

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/quiztex.git
cd quiztex
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Start the development server

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application

## CSV Format

Your CSV file should follow this format:

- Column 1: Question (can include LaTeX)
- Column 2: Answer (can include LaTeX)

Example:

```
What is the quadratic formula?,"x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}"
What is the derivative of $f(x) = x^n$?,"f'(x) = nx^{n-1}"
```

## LaTeX Usage

The application uses KaTeX for rendering LaTeX expressions. You can include LaTeX syntax directly in your questions and answers.

Examples:

- Inline expressions: `$x^2 + y^2 = r^2$`
- Block expressions: `$$\int_{a}^{b} f(x) dx = F(b) - F(a)$$`

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [React Latex Next](https://github.com/harunurhan/react-latex-next) - LaTeX rendering
- [KaTeX](https://katex.org/) - Math typesetting library
- [Papaparse](https://www.papaparse.com/) - CSV parsing

## License

This project is licensed under the MIT License - see the LICENSE file for details.
