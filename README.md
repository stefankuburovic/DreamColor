# DreamColor - AI Coloring Book Generator

DreamColor is a magical web application that generates personalized children's coloring books using Google's Gemini AI models.

## Features

*   **Personalized Coloring Books**: Creates a custom coloring book based on a child's name and a chosen theme (e.g., "Space Dinosaurs", "Magical Forest").
*   **High-Quality Image Generation**: Uses `imagen-4.0-generate-001` to generate 5 distinct, printable black-and-white coloring pages and a vibrant full-color cover.
*   **PDF Export**: Automatically compiles the generated images into a formatted, print-ready A4 PDF.
*   **AI Assistant**: Includes an integrated chatbot powered by `gemini-3-pro-preview` to help brainstorm creative themes and ideas.

## How It Works

1.  **Enter Details**: Input the child's name and a fun theme.
2.  **Generate**: The app uses the Gemini API to create:
    *   A colorful cover with space for the title.
    *   5 unique coloring pages based on the theme (scenes, characters, etc.).
3.  **Download**: Click the download button to get the complete PDF book.

## Tech Stack

*   **Framework**: React
*   **Styling**: Tailwind CSS
*   **AI Models**: 
    *   `imagen-4.0-generate-001` (Image Generation)
    *   `gemini-3-pro-preview` (Chat)
*   **PDF Library**: jsPDF
*   **Icons**: Lucide React

## Setup

This project requires a Google Gemini API key.

1.  Get your API key from [Google AI Studio](https://aistudio.google.com/).
2.  The app is configured to read the API key from `process.env.API_KEY`.

## License

MIT
