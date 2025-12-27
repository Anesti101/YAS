💍 Phrasele — A Wordle-Style Proposal Game
Overview

Phrasele is a custom Wordle-inspired browser game designed as an interactive marriage proposal.

Instead of guessing a single five-letter word, the player progresses through a sequence of phrases curated by the game creator. Each phrase represents a shared memory or sentiment. Upon successfully completing the final phrase, the game reveals the proposal:

“Will you marry me?”

The project is implemented entirely in client-side web technologies and requires no backend services.

Key Features
Gameplay

Wordle-style grid and feedback mechanics

Phrase-based answers instead of single words

Fixed spaces that are visually displayed and auto-filled

Classic letter feedback:

🟩 Correct letter in the correct position

🟨 Correct letter in the wrong position

⬜ Letter not present in the phrase

Limited attempts per phrase (default: 6)

Progression

Phrases are solved sequentially

Completion of one phrase unlocks the next

The final phrase triggers a dedicated proposal screen

Accessibility & UX

Fully playable with:

Physical keyboard

On-screen keyboard (mobile-friendly)

High-contrast colour palette

Responsive layout for phones and desktops

Technology Stack

HTML5 — Application structure

CSS3 — Layout, animations, and visual styling

Vanilla JavaScript — Game logic and state management

No frameworks, build tools, or external services are required.

Project Structure
phrasele/
├── index.html          # Main HTML entry point
├── styles.css          # Game styling and animations
├── game.js             # Core gameplay logic
├── phrases.js          # Configurable phrase list
└── assets/             # Optional images, fonts, or audio

Configuration

All phrases are defined in a single configuration file (phrases.js):

const PHRASES = [
  "HOW WE MET",
  "OUR FIRST DATE",
  "I LOVE YOU",
  "MY FOREVER PERSON",
  "WILL YOU MARRY ME"
];

Rules

All phrases must have the same total length

Spaces count toward phrase length

Matching is case-insensitive

Punctuation is ignored during comparison

How It Works
Phrase Normalisation

To allow flexible user input:

All guesses are converted to uppercase

Spaces and punctuation are removed for comparison

Only alphabetical characters are evaluated

Example:

"Will you marry me?" → WILLYOUMARRYME

Guess Evaluation Logic

The evaluation follows classic Wordle rules using a two-pass system:

Exact match pass

Letters that match both value and position are marked correct

Presence pass

Remaining letters are checked for existence elsewhere in the phrase

This ensures correct handling of repeated letters.

Game State

The application maintains minimal state:

{
  currentPhraseIndex: number,
  currentAttempt: number,
  currentGuess: string,
  status: "playing" | "won" | "proposal"
}

State is reset between phrases.

Proposal Screen

When the final phrase is solved:

The input system is disabled

The game board fades out

A proposal message is displayed

Optional enhancements:

Confetti or heart animations

Background music

A single affirmative interaction (e.g. “YES 💍”)

Running the Project
Local Use

Clone or download the repository

Open index.html in any modern browser

No server is required.

Optional Hosting

This project can be deployed as a static site using:

GitHub Pages

Netlify

Any static file host

Privacy & Ethics

No data is collected or stored

No cookies or analytics are used

The game runs entirely in the browser

This project is intended for personal, non-commercial use.

Legal Disclaimer

This project is inspired by Wordle, but:

Does not reuse Wordle source code

Does not include NYT assets

Implements original logic and styling

If published publicly, ensure visual assets are sufficiently distinct.

Licence

Choose one:

MIT Licence — if sharing publicly

All Rights Reserved — if keeping private

Final Note

This project is designed to be solved only once.

If everything goes to plan, the game ends — and something much better begins.

💍
