# Globalink CEO - LinkedIn Assistant for CEOs

Globalink CEO is an AI-powered LinkedIn assistant designed specifically for CEOs to enhance their LinkedIn presence. The application helps CEOs create professional profiles, generate engaging posts, and stay updated with industry trends.

## Features

- **AI Profile Creation**: Generate professional LinkedIn profiles in both Japanese and English
- **AI Post Creation**: Create engaging LinkedIn posts with AI assistance
- **AI Comment Assistant**: Get AI-generated comment suggestions for LinkedIn posts
- **AI Trend Analyst**: Stay updated with the latest industry trends relevant to Japanese CEOs
- **User Authentication**: Secure user authentication with Firebase
- **User Profile Management**: Manage your profile information and preferences
- **Responsive Design**: Fully responsive UI that works on all devices

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **AI**: Google AI (Gemini) via GenKit
- **UI Components**: Radix UI, shadcn/ui

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- A Firebase project (see [Firebase Setup Guide](docs/firebase-setup.md))

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/globalink-ceo.git
   cd globalink-ceo
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Create a `.env.local` file in the root directory
   - Add your Firebase configuration (see [Firebase Setup Guide](docs/firebase-setup.md))

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:9002`

## Firebase Integration

This project uses Firebase for backend services:

- **Authentication**: User sign-up, sign-in, and profile management
- **Firestore Database**: Store user data, profiles, posts, and comments
- **Storage**: Store user files and images

For detailed instructions on setting up Firebase, see the [Firebase Setup Guide](docs/firebase-setup.md).

## Project Structure

- `src/app`: Next.js app router pages
- `src/components`: React components
  - `src/components/ui`: UI components (buttons, cards, etc.)
  - `src/components/auth`: Authentication-related components
  - `src/components/profile`: User profile components
  - `src/components/layout`: Layout components
- `src/lib`: Utility functions and libraries
  - `src/lib/firebase`: Firebase configuration and context providers
  - `src/lib/models`: Data models
  - `src/lib/services`: Service classes for data operations
  - `src/lib/contexts`: React context providers
- `src/ai`: AI-related code and flows
- `docs`: Documentation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [GenKit](https://genkit.ai/)
