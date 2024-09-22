// utils/sseUtil.ts

import { NextApiResponse } from "next";

const clients: Set<NextApiResponse> = new Set();

export function addClient(client: NextApiResponse): void {
  clients.add(client);
}

export function removeClient(client: NextApiResponse): void {
  clients.delete(client);
}

export function sendSSEUpdate(message: any): void {
  clients.forEach((client) => {
    client.write(`data: ${JSON.stringify(message)}\n\n`);
  });
}

export async function handleSSE(res: NextApiResponse): Promise<void> {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  addClient(res);

  // Keep the connection alive
  const interval = setInterval(() => {
    res.write(":keep-alive\n\n");
  }, 30000);

  // Clean up on close
  res.on("close", () => {
    clearInterval(interval);
    removeClient(res);
  });
}
