require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json()); // Parse JSON bodies

// Sample route
app.get('/', (req, res) => {
res.send('API is running...');
});

// Example API endpoint
app.get('/api/data', (req, res) => {
res.json({ message: 'Hello from Node.js backend!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));