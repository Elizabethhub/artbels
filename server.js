const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

require('dotenv').config(); 

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

const TestSchema = new mongoose.Schema({
  foo: String
});

const TestModel = mongoose.model('Test', TestSchema);

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('getData', async () => {
    try {
      const doc = await TestModel.findOne();
      socket.emit('dataResponse', doc);
    } catch (error) {
      console.error('Error fetching data:', error);
      socket.emit('dataResponse', null);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});