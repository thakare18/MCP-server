import {mcpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {z} from "zod";


// create an MCP server
const server = mcpServer({
    name: "My MCP Server",
    version: "1.0.0"
});

// add the additional tools 

server.registerTool("add",{
    title: "Add Numbers",
    description: "Add two numbers",
    inputSchema: {a: z.number(), b: z.number()}

},
async ({a, b}) => {
    return {
        content: [{type: "text", text: `${a + b}`}]
    }
});


// start receiving messages on stdio and sending messages on stdout
const transport = new StdioServerTransport();
await server.start(transport);