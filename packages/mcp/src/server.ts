import express from 'express';
import { healthCheck } from './health';
import { validateHMAC } from './middleware/auth';
import { logger } from '@twilio-alpha/openapi-mcp-server';

const app = express();
const port = process.env.PORT || 3000;

// Parse JSON bodies
app.use(express.json());

// Health check endpoint (no auth required)
app.get('/health', healthCheck);

// Apply HMAC validation to all other routes
app.use(validateHMAC);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

export default app;