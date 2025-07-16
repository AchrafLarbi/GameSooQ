# GameSooq

GameSooq is a multiplatform marketplace for gamers in Algeria, allowing users to buy, sell, and exchange video games and consoles easily and securely. The application features advanced search filters, user reviews, and a secure transaction system.

## Features

- Browse, search, and filter game and console posts
- Pagination and efficient data fetching from Firebase Firestore
- User authentication and management
- Admin dashboard for managing users, games, and consoles
- Responsive UI built with React and Tailwind CSS

## Project Structure

```
src/
  App.jsx
  app/
    store.js
  assets/
  components/
  Dashboard/
  data/
  features/
  hooks/
  lib/
  pages/
  services/
public/
  privacy.html
index.html
package.json
tailwind.config.js
vite.config.js
```

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/gamesooq.git
   cd gamesooq
   ```

2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```

3. Configure Firebase:
   - Copy `.env.example` to `.env` and fill in your Firebase credentials.

4. Start the development server:
   ```sh
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
