// Load dotenv FIRST - before any other imports
require('dotenv').config();

const http = require('http');
const app = require('./app');
const { initializeSocket } = require('./socket');

const port = process.env.PORT || 3000;

// Create server
const server = http.createServer(app);

// Initialize socket
initializeSocket(server);

// Start server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

