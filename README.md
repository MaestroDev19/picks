# Picks 🎬📺

Welcome to Picks, the ultimate movie and TV show recommendation web app! Whether you're a movie buff or a binge-watcher, Picks helps you discover your next favorite show or film. Built with cutting-edge technologies, Picks provides a seamless and enjoyable user experience.

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Key Features](#key-features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Contribution](#contribution)

## Overview

Picks leverages the power of Next.js, Firebase, Supabase, Python, and the TMDB API to provide personalized movie and TV show recommendations. Our app combines modern web technologies with a robust backend to deliver a fast, intuitive, and rich user experience.

## Technology Stack

- **Next.js**: A React framework for server-side rendering and generating static websites.
- **Firebase**: A platform for building web and mobile applications with features such as authentication, hosting, and real-time databases.
- **Supabase**: An open-source alternative to Firebase that provides a PostgreSQL database and authentication.
- **Python**: Used for backend services and data processing.
- **TMDB API**: Provides detailed information about movies and TV shows, including ratings, reviews, and more.

## Key Features

- **Personalized Recommendations**: Get movie and TV show suggestions based on your preferences and viewing history.
- **Search Functionality**: Find information about any movie or TV show.
- **User Authentication**: Secure login and registration with Firebase and Supabase.
- **Watchlist**: Save your favorite movies and shows to your watchlist.
- **Responsive Design**: Enjoy Picks on any device, be it a desktop, tablet, or mobile.

## Installation

To get started with Picks, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/picks.git
    cd picks
    ```

2. **Install dependencies**:
    ```bash
    npm install
    or
    yarn install
    or
    bun install
    ```

3. **Set up environment variables**: Create a `.env.local` file in the root directory and add the following environment variables:
    ```
    NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    TMDB_API_KEY=your_tmdb_api_key
    ```

## Configuration

Configure Firebase and Supabase by following their official documentation:

- **Firebase**: [Firebase Setup Guide](https://firebase.google.com/docs/web/setup)
- **Supabase**: [Supabase Setup Guide](https://supabase.io/docs/guides/getting-started)

Ensure you have the necessary API keys and URLs from these services.

## Usage

### Running the App


```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```


Open [http://localhost:3000](http://localhost:3000) in your browser to see Picks in action.

### User Interface

- **Home Page**: Browse popular movies and TV shows.
- **Search**: Use the search bar to find specific titles.
- **Recommendations**: View personalized recommendations on your dashboard.
- **Watchlist**: Add movies and shows to your watchlist for later viewing.
- **Picks**:  Add movies and shows you want to save in your watchlist.
- **Movie**: View movies and details of the movies
- **Tv**:View tv shows and details of the tv shows

## Contribution

We welcome contributions from the community! To contribute to Picks, follow these steps:

1. **Fork the repository** on GitHub.
2. **Clone your fork**:
    ```bash
    git clone https://github.com/yourusernam/picks.git
    cd picks
    ```
3. **Create a new branch**:
    ```bash
    git checkout -b feature/your-feature-name
    ```
4. **Make your changes** and commit them:
    ```bash
    git add .
    git commit -m "Add your message here"
    ```
5. **Push to your fork**:
    ```bash
    git push origin feature/your-feature-name
    ```
6. **Create a pull request** on GitHub.

### Contribution Guidelines

- Follow the coding style used in the project.
- Write clear and concise commit messages.
- Include comments in your code where necessary.
- Test your changes thoroughly before submitting a pull request.

Thank you for using Picks! If you have any questions or feedback, please open an issue or reach out to us. Enjoy your movie and TV show recommendations! 🎉🍿




