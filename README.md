# Habitual
Habitual is a full-stack web application for developing and tracking your daily habits, such as meditation, hydration, etc. It combines visuals such as streaks, a completion heatmap, and daily check-ins, while also letting users discover others who share similar routines. The frontend is built with React and styled with Tailwind CSS to create a zen, earthy aesthetic. The backend is built with Node.js and hooked onto a MongoDB database via Mongoose. Authentication is handled with JWT tokens stored in HTTP-only cookies.

# Features 
- User registration and login with persistent sessions via secure cookies
- Create, customize, and manage your own habits
- Daily habit check-ins with streak tracking
- Visual heatmap showing your completion history over time
- Follow other users and explore shared routines

# Local Development

For both the backend and frontend, you call npm run dev.

# Run command 
docker compose up --build

docker compose down
