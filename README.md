# Picks - Movie and TV Show Recommendations

Picks is a web application that provides personalized recommendations for movies and TV shows. It offers a user-friendly interface to discover, search, and keep track of your favorite content.

## Features

- Trending movies and TV shows
- Personalized recommendations
- Search functionality
- User watchlist
- Detailed information about movies and TV shows
- Trailer viewing
- Genre-based browsing

## Technologies Used

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Supabase
- Firebase Authentication
- TMDB API
- Jotai (for state management)
- Shadcn UI components

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (see `.env.example`)
4. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

- `app/`: Next.js app router and page components
- `components/`: Reusable React components
- `lib/`: Utility functions and data fetching
- `public/`: Static assets
- `utils/`: Helper functions and configurations

## API Integration

This project uses The Movie Database (TMDB) API for fetching movie and TV show data. Make sure to obtain an API key from TMDB and add it to your environment variables.

## Authentication

User authentication is handled using Firebase. Set up a Firebase project and add the necessary configuration to your environment variables.

## State Management

Jotai is used for global state management, particularly for handling the user's watchlist.

## Styling

The project uses Tailwind CSS for styling, with custom configurations in `tailwind.config.ts`.

## PWA Support

The application is configured as a Progressive Web App (PWA) for improved performance and offline capabilities.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
