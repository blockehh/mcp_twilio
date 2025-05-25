import { ToolFilters } from '@twilio-alpha/openapi-mcp-server';

export type ServiceConfig = {
  name: string;
  services: string[];
  tags: string[];
  description: string;
};

export const serviceConfigs: Record<string, ServiceConfig> = {
  numbers: {
    name: 'Numbers API',
    services: ['twilio_numbers_v2'],
    tags: ['IncomingPhoneNumber', 'AvailablePhoneNumber', 'RegulatoryCompliance'],
    description: 'Number search, purchase, and release capabilities'
  },
  lookup: {
    name: 'Lookup API',
    services: ['twilio_lookups_v1'],
    tags: ['PhoneNumber', 'CNAM', 'Fraud'],
    description: 'Caller-ID and spam lookup functionality'
  },
  studio: {
    name: 'Studio API',
    services: ['twilio_studio_v2'],
    tags: ['Flows', 'FlowExecutions', 'FlowRevisions'],
    description: 'Visual IVR flows management'
  },
  serverless: {
    name: 'Serverless API',
    services: ['twilio_serverless_v1'],
    tags: ['Services', 'Environments', 'Functions', 'Assets', 'Deployments'],
    description: 'Custom TwiML and Functions management'
  },
  voice: {
    name: 'Voice API',
    services: ['api_v2010'],
    tags: ['Calls', 'Conferences', 'Participants', 'Applications', 'Recordings', 'Transcriptions', 'RecordingAddOn'],
    description: 'Call routing, live control, recordings, and transcription'
  },
  taskrouter: {
    name: 'TaskRouter API',
    services: ['twilio_taskrouter_v1'],
    tags: ['Workspaces', 'Workers', 'Workflows', 'Tasks', 'TaskQueues'],
    description: 'Skills-based routing and queues'
  },
  events: {
    name: 'Events API',
    services: ['twilio_events_v1'],
    tags: ['Events'],
    description: 'Real-time events and webhooks'
  },
  monitor: {
    name: 'Monitor API',
    services: ['twilio_monitor_v1'],
    tags: ['Alerts', 'Events'],
    description: 'Audit logs and error alerts'
  },
  insights: {
    name: 'Voice Insights API',
    services: ['twilio_insights_v1'],
    tags: ['CallSummaries', 'CallMetrics'],
    description: 'Call-quality insights'
  },
  usage: {
    name: 'Usage API',
    services: ['twilio_usage_v1'],
    tags: ['UsageRecords', 'UsageTriggers'],
    description: 'Cost and usage analytics'
  },
  accounts: {
    name: 'Accounts API',
    services: ['twilio_accounts_v1'],
    tags: ['Subaccounts', 'Keys', 'AuthTokens'],
    description: 'Sub-account isolation'
  },
  trunking: {
    name: 'Trunking API',
    services: ['twilio_trunking_v1'],
    tags: ['Trunks', 'OriginationUrls', 'CredentialLists'],
    description: 'SIP trunking and BYOC capabilities'
  },
  proxy: {
    name: 'Proxy API',
    services: ['twilio_proxy_v1'],
    tags: ['Services', 'Sessions', 'Participants'],
    description: 'Proxy and number masking'
  }
};

export function getToolFilters(services: string[]): ToolFilters {
  const selectedServices = services.map(s => serviceConfigs[s]).filter(Boolean);
  
  return {
    services: [...new Set(selectedServices.flatMap(s => s.services))],
    tags: [...new Set(selectedServices.flatMap(s => s.tags))]
  };
}