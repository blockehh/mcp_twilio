import express from 'express';
import { healthCheck } from './health';

const app = express();
const port = process.env.PORT || 3000;

// Health check endpoint
app.get('/health', healthCheck);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default port