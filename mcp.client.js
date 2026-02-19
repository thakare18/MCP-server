import { Client } from "@modelcontextprotocol/sdk/client/mcp.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";


// created a transport - transport tells how the client should communicate with the mcp server, like streamable http or stdio
const transport = new StdioClientTransport({   // in this we use stdio transport because we use local server
    command: "node",
    args: ["./mcp.server.js"]
});

// create a client
const client = new Client({
    name: "pratham MCP Client",
    version: "1.0.0"
});

// wrap in async IIFE to use top-level await
(async () => {
    // connect the client to the server using the transport (stdio in this case because we use local server)
    await client.connect(transport);

    // listTools() method on client - this lists all tools that mcp server provides
    const response = await client.listTools();
    console.log(response);
})();
