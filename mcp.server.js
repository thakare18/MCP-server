import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";

// create an MCP server with tools capability
const server = new Server({
    name: "My MCP Server",
    version: "1.0.0"
}, {
    capabilities: {
        tools: {}  // Enable tools capability
    }
});

// Handle tools/list request - list all available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "add",
                description: "Add two numbers",
                inputSchema: {
                    type: "object",
                    properties: {
                        a: {
                            type: "number",
                            description: "First number to add"
                        },
                        b: {
                            type: "number",
                            description: "Second number to add"
                        }
                    },
                    required: ["a", "b"] // Both 'a' and 'b' are required
                }
            }
        ]
    };
});

// Handle tools/call request - execute the tool
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    
    if (name === "add") {
        const { a, b } = args;
        return {
            content: [
                {
                    type: "text",
                    text: String(a + b)
                }
            ]
        };
    }
    
    throw new Error(`Unknown tool: ${name}`);
});

// start receiving messages on stdio and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);