# switch.ai | Mechanical Keyboard Switch Assistant

![switch.ai Logo](public/switch-ai-logo-small.png)

switch.ai is a web-based application designed to help users discover and choose the perfect mechanical keyboard switches based on their preferences. It features an interactive assistant to guide users through the selection process.

## Features

*   Interactive chat interface for a personalized experience.
*   Intelligent assistant to help select mechanical keyboard switches.
*   Themeable UI with light and dark modes.
*   Built with a modern tech stack for a responsive and fast experience.

## Tech Stack

*   React
*   TypeScript
*   Vite
*   Tailwind CSS
*   Radix UI (for UI components)
*   PNPM (for package management)

## Getting Started

### Prerequisites

*   Node.js (LTS version recommended)
*   pnpm (Package manager - can be installed via `npm install -g pnpm`)

### Installation

1.  Clone the repository: `git clone https://github.com/freddysongg/switchai.git`
2.  Navigate to the project directory: `cd switchai`
3.  Install dependencies: `pnpm install`

### Running in Development Mode

To start the development server, run: `pnpm dev`
Open your browser and navigate to `http://localhost:5173` (or the port specified in your Vite config if different).

### Building for Production

To create a production build, run: `pnpm build`
The optimized static assets will be generated in the `dist` folder.

## Available Scripts

*   `pnpm dev`: Runs the app in development mode.
*   `pnpm build`: Builds the app for production.
*   `pnpm lint`: Lints the codebase using ESLint.
*   `pnpm preview`: Serves the production build locally for preview.
*   `pnpm format`: Formats code using Prettier.
*   `pnpm format:check`: Checks code formatting with Prettier without making changes.

## Linting and Formatting

This project uses ESLint for linting and Prettier for code formatting. Configuration files are included in the repository.
To check for linting issues, run: `pnpm lint`
To automatically format files, run: `pnpm format`

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.
