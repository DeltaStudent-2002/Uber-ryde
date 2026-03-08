const http = require('http');
const app = require('./app');
const { initializeSocket } = require('./socket');
const port = process.env.PORT || 3000;

// Create server
const server = http.createServer(app);

// Initialize socket
initializeSocket(server);

// Vercel serverless compatibility - export handler
if (process.env.VERCEL === 'true') {
    module.exports = server;
} else {
    server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

