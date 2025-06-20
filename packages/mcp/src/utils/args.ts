import { logger } from '@twilio-alpha/openapi-mcp-server';
import minimist from 'minimist';

import { isValidTwilioSid } from './general';
import { serviceConfigs } from '../config';

interface ParsedArgs {
  services: string[];
  accountSid?: string;
  apiKey?: string;
  apiSecret?: string;
}

const sanitizeArgs = (args: string): string[] => {
  return args
    ? args
        .split(',')
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0)
    : [];
};

const parsedArgs = async (argv: string[]): Promise<ParsedArgs> => {
  const args = argv.slice(2);
  const firstArg = args[0];

  const parsed = minimist(argv, {
    alias: {
      a: 'accountSid',
      k: 'apiKey',
      s: 'apiSecret',
      e: 'services',
    },
    string: ['accountSid', 'apiKey', 'apiSecret', 'services'],
  });

  let { services: sArgs, accountSid, apiKey, apiSecret } = parsed;

  // Handle "accountSid/apiKey:apiSecret" format
  if (
    !accountSid &&
    !apiKey &&
    !apiSecret &&
    firstArg &&
    firstArg.includes('/')
  ) {
    const credsMatch = firstArg.match(/^([^/]+)\/([^:]+):(.+)$/);
    if (credsMatch) {
      const potentialAccountSid = credsMatch[1];
      const potentialApiKey = credsMatch[2];
      const potentialApiSecret = credsMatch[3];

      if (
        isValidTwilioSid(potentialAccountSid, 'AC') &&
        isValidTwilioSid(potentialApiKey, 'SK')
      ) {
        accountSid = potentialAccountSid;
        apiKey = potentialApiKey;
        apiSecret = potentialApiSecret;
      }
    }
  }

  if (!isValidTwilioSid(accountSid, 'AC')) {
    logger.error('Error: Invalid AccountSid');
    process.exit(1);
  }
  if (!isValidTwilioSid(apiKey, 'SK')) {
    logger.error('Error: Invalid ApiKey');
    process.exit(1);
  }

  const services = sanitizeArgs(sArgs);
  if (services.length === 0) {
    logger.info('No services specified, using all available services');
    return {
      services: Object.keys(serviceConfigs),
      accountSid,
      apiKey,
      apiSecret,
    };
  }

  // Validate services
  const invalidServices = services.filter(s => !serviceConfigs[s]);
  if (invalidServices.length > 0) {
    logger.error(`Error: Invalid services: ${invalidServices.join(', ')}`);
    logger.info(`Available services: ${Object.keys(serviceConfigs).join(', ')}`);
    process.exit(1);
  }

  return {
    services,
    accountSid,
    apiKey,
    apiSecret,
  };
};

export default parsedArgs;