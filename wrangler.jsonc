let latestData = {
  db: 0,
  warning: false,
  buzzer: true,
  device: null,
  time: null
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-API-Key"
    };

    // CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    // =========================================
    // DATA DARI ESP32
    // =========================================
    if (url.pathname === "/api/sensor" && request.method === "POST") {
      try {
        const apiKey = request.headers.get("X-API-Key");

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
                ...corsHeaders
              }
            }
          );
        }

        const data = await request.json();

        console.log("Data dari ESP32:", data);

        if (
          data.readings &&
          Array.isArray(data.readings) &&
          data.readings.length > 0
        ) {
          const reading = data.readings[data.readings.length - 1];

          latestData = {
            db: Number(reading.db) || 0,
            warning: reading.warning === true,
            buzzer: data.buzzer !== undefined
              ? data.buzzer === true
              : true,
            device: data.device || null,
            time: reading.t || new Date().toISOString()
          };
        }

        return new Response(
          JSON.stringify({
            status: "success",
            message: "Data diterima",
            data: latestData
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          }
        );

      } catch (error) {
        return new Response(
          JSON.stringify({
            status: "error",
            message: "JSON tidak valid"
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          }
        );
      }
    }

    // =========================================
    // DATA TERBARU UNTUK WEBSITE
    // =========================================
    if (url.pathname === "/api/sensor" && request.method === "GET") {
      return new Response(
        JSON.stringify(latestData),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

    // =========================================
    // FILE WEBSITE
    // =========================================
    return env.ASSETS.fetch(request);
  }
};
