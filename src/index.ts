interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Figshare MCP.
 */


const BASE = 'https://api.figshare.com/v2';
const UA = 'pipeworx-mcp-figshare/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'articles',
    description: 'Search articles.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        item_type: { type: 'number', description: '1 figure | 3 dataset | 5 fileset | 12 thesis | etc.' },
        page: { type: 'number' },
        page_size: { type: 'number' },
        order: { type: 'string', description: 'published_date | modified_date | views | downloads | shares | cites' },
      },
    },
  },
  { name: 'article', description: 'Single article.', inputSchema: { type: 'object', properties: { id: { type: 'number' }, version: { type: 'number' } }, required: ['id'] } },
  { name: 'article_files', description: 'Files in an article.', inputSchema: { type: 'object', properties: { id: { type: 'number' }, version: { type: 'number' } }, required: ['id'] } },
  { name: 'collections', description: 'Search collections.', inputSchema: { type: 'object', properties: { query: { type: 'string' }, page: { type: 'number' }, page_size: { type: 'number' } } } },
  { name: 'collection', description: 'Single collection.', inputSchema: { type: 'object', properties: { id: { type: 'number' } }, required: ['id'] } },
  { name: 'institutions', description: 'List institutions.', inputSchema: { type: 'object', properties: {} } },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'articles': {
      const body: Record<string, unknown> = {
        page: Math.max(1, (args.page as number) ?? 1),
        page_size: Math.min(1000, Math.max(1, (args.page_size as number) ?? 25)),
      };
      if (args.query) body.search_for = String(args.query);
      if (args.item_type) body.item_type = (args.item_type as number) | 0;
      if (args.order) body.order = String(args.order);
      return fsPost('/articles/search', body);
    }
    case 'article': {
      const id = (args.id as number) | 0;
      const ver = args.version ? `/versions/${(args.version as number) | 0}` : '';
      return fsGet(`/articles/${id}${ver}`);
    }
    case 'article_files': {
      const id = (args.id as number) | 0;
      const ver = args.version ? `/versions/${(args.version as number) | 0}` : '';
      return fsGet(`/articles/${id}${ver}/files`);
    }
    case 'collections': {
      const body: Record<string, unknown> = {
        page: Math.max(1, (args.page as number) ?? 1),
        page_size: Math.min(1000, Math.max(1, (args.page_size as number) ?? 25)),
      };
      if (args.query) body.search_for = String(args.query);
      return fsPost('/collections/search', body);
    }
    case 'collection':
      return fsGet(`/collections/${(args.id as number) | 0}`);
    case 'institutions':
      return fsGet('/institutions');
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function fsGet(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (res.status === 404) throw new Error('Figshare: not found');
  if (!res.ok) throw new Error(`Figshare: ${res.status}`);
  return res.json();
}

async function fsPost(path: string, body: unknown): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'User-Agent': UA },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Figshare: ${res.status} ${await res.text().then((t) => t.slice(0, 200))}`);
  return res.json();
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
