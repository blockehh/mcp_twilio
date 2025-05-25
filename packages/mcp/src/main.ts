import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { logger } from '@twilio-alpha/openapi-mcp-server';

import TwilioOpenAPIMCPServer from '@app/server';
import { args, type AccountCredentials } from '@app/utils';
import { getToolFilters } from '@app/config';

export default async function main() {
  let credentials: AccountCredentials | null;
  const { services, accountSid, apiKey, apiSecret } = await args(process.argv);

  if (accountSid && apiKey && apiSecret) {
    credentials = { accountSid, apiKey, apiSecret };
  } else {
    logger.error('Error: Please provide credentials.');
    process.exit(1);
  }

  const filters = getToolFilters(services);

  const server = new TwilioOpenAPIMCPServer({
    server: {
      name: 'twilio-server',
      version: '0.0.1',
    },
    filters,
    accountSid: credentials.accountSid,
    credentials: {
      apiKey: credentials.apiKey,
      apiSecret: credentials.apiSecret,
    },
  });

  const transport = new StdioServerTransport();
  await server.start(transport);
  logger.info('Twilio MCP Server running on stdio');
}