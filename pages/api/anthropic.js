// pages/api/anthropic.js
// Server-side proxy — the ANTHROPIC_API_KEY never reaches the browser

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });
  }

  try {
    // Only send the web-search beta header when the request actually uses it
    const usesWebSearch = (req.body?.tools || []).some(
      (t) => t.type === "web_search_20250305"
    );

    const headers = {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      ...(usesWebSearch && { "anthropic-beta": "web-search-2025-03-05" }),
    };

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers,
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    if (!response.ok) {
      // Log the full error server-side so you can see it in Vercel logs
      console.error("Anthropic API error:", response.status, JSON.stringify(data));
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("Anthropic proxy error:", err);
    return res.status(500).json({ error: "Proxy request failed", detail: err.message });
  }
}
