import { config} from "dotenv";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
 // 
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

config();

const tools = [];  // store tools provided by server




const ai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)


// created a transport - transport tells how the client should communicate with the mcp server, like streamable http or stdio
const transport = new StdioClientTransport({   // in this we use stdio transport because we use local server
    command: "node",
    args: ["mcp.server.js"]
});

// create a client
const client = new Client({
    name: "pratham MCP Client",
    version: "1.0.0"
});

// wrap in async 
(async () => {
    // connect the client to the server using the transport (stdio in this case because we use local server)
    await client.connect(transport);

    // listTools() method on client - this lists all tools that mcp server provides
    client.listTools().then( async response => {

        response.tools.forEach(tool=> {
            tools.push({
                name: tool.name,
                description: tool.description,
                parameters: {
                    type: "OBJECT",
                    properties: tool.inputSchema.properties,
                    required: tool.inputSchema.required || []

                }
            })
        })
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash-002"

 });
        const result = await model.generateContent({
  contents: [{ role: 'user', parts: [{ text: 'add 2 and 3' }] }],
  tools: [{
    functionDeclarations: tools
  }]
});

const aiResponse = result.response;
const functionCalls = aiResponse.functionCalls();

console.log("aiResponse", aiResponse, functionCalls);

functionCalls.forEach( async call => {
   const toolResponse = await client.callTool({
        name: call.name,
        arguments: call.arguments
    });
});
    });
})();
