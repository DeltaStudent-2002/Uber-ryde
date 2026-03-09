const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connectToDb = require('./db/db');

const userRoutes = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.routes');
const mapsRoutes = require('./routes/maps.routes');
const rideRoutes = require('./routes/ride.routes');
const paymentRoutes = require('./routes/payment.routes');

const app = express();

connectToDb();

app.use(cors({
<<<<<<< HEAD
  origin: true,
=======
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://uber-ryde.vercel.app/",
    "https://uber-clone-60p6.onrender.com"
  ],
>>>>>>> 721013ccfbbf4f290eca4f8e59624ce09b462923
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/users', userRoutes);
app.use('/captains', captainRoutes);
app.use('/maps', mapsRoutes);
app.use('/rides', rideRoutes);
app.use('/payments', paymentRoutes);

