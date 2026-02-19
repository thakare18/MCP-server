import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import dotenv from "dotenv";
dotenv.config();  // 
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { GoogleGenerativeAI } from "@google/generative-ai";


const tools = [];  // store tools provided by server

const weatherFunctionDeclaration = {
    name: "getCurrentWeather",
    description: "Get the current weather in a given location",
    parameters: {
        type: "object",
        properties: {
            location: {
                type: "string",
                description: "The city"
            },
        },
        required: ["location"],
    },
};




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

// wrap in async IIFE to use top-level await
(async () => {
    // connect the client to the server using the transport (stdio in this case because we use local server)
    await client.connect(transport);

    // listTools() method on client - this lists all tools that mcp server provides
    client.listTools().then(response => {

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
        console.log("Tools provided by server:", tools);
    })
    
})();
