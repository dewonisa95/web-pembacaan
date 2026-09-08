export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // ==========================================
    // CORS
    // ==========================================
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, X-API-Key"
        }
      });
    }

    // ==========================================
    // POST DATA DARI ESP32
    // ==========================================
    if (url.pathname === "/api/sensor" && request.method === "POST") {
      try {
        const apiKey = request.headers.get("X-API-Key");

        // Cek API Key
        if (apiKey !== "PeTImlPYZj4exKFr7X7YQv9H3XdvSDOT68Hryi0+tos=") {
          return new Response(
            JSON.stringify({
              status: "error",
              message: "API Key tidak valid"
            }),
            {
              status: 401,
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
              }
            }
          );
        }

        const data = await request.json();

        console.log("Data diterima dari ESP32:", data);

        return new Response(
          JSON.stringify({
            status: "success",
            message: "Data diterima!"
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );

      } catch (err) {
        return new Response(
          JSON.stringify({
            status: "error",
            message: "JSON tidak valid"
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
      }
    }

    // ==========================================
    // GET TEST
    // ==========================================
    if (url.pathname === "/api/sensor" && request.method === "GET") {
      return new Response(
        JSON.stringify({
          status: "online",
          message: "Cloud Worker aktif"
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }

    // ==========================================
    // FILE WEBSITE
    // ==========================================
    return env.ASSETS.fetch(request);
  }
};
