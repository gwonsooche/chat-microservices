const express = require('express');
const app = express();

const PORT = process.env.PORT || 3002;

app.get('/', (req, res) => {
  res.send('Hello')
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});