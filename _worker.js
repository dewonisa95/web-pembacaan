let latestData = {
  db: 0,
  rms: 0,
  warning: false,
  buzzer: true,
  device: null,
  time: null
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // ==========================================
    // CORS
    // ==========================================
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-API-Key"
    };

    // ==========================================
    // OPTIONS / CORS
    // ==========================================
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    // ==========================================
    // POST DATA DARI ESP32
    // ==========================================
    if (url.pathname === "/api/sensor" && request.method === "POST") {
      try {
        // Cek API Key
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

        // Ambil JSON dari ESP32
        const data = await request.json();

        console.log("Data diterima:", data);

        // ==========================================
        // AMBIL DATA TERAKHIR
        // ==========================================
        if (
          data.readings &&
          Array.isArray(data.readings) &&
          data.readings.length > 0
        ) {
          const reading = data.readings[data.readings.length - 1];

          latestData = {
            db: Number(reading.db) || 0,
            rms: Number(reading.rms) || 0,
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
            message: "Data diterima!",
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

      } catch (err) {
        console.log("Error:", err);

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

    // ==========================================
    // GET DATA TERBARU UNTUK WEBSITE
    // ==========================================
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

    // ==========================================
    // FILE WEBSITE
    // ==========================================
    return env.ASSETS.fetch(request);
  }
};
