# @pipeworx/figshare

[Figshare](https://figshare.com) MCP — research outputs (datasets, papers, posters, presentations). Public reads keyless.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `articles(query?, item_type?, page?, page_size?, order?)` — search articles
- `article(id, version?)` — single article
- `article_files(id, version?)` — files in an article
- `collections(query?, page?, page_size?)` — search curated collections
- `collection(id)` — single collection
- `institutions()` — list institutions

## Data source

`https://api.figshare.com/v2/`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "figshare": {
      "url": "https://gateway.pipeworx.io/figshare/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Figshare data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
