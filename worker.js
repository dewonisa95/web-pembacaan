export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Menangani pengiriman data POST dari ESP32
    if (url.pathname === "/api/sensor" && request.method === "POST") {
      try {
        const data = await request.json();
        console.log("Data diterima:", data);

        return new Response(JSON.stringify({ status: "success", message: "Data diterima!" }), {
          status: 200,
          headers: { 
            "Content-Type": "application/json", 
            "Access-Control-Allow-Origin": "*" 
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: "Invalid JSON" }), { 
          status: 400, 
          headers: { "Content-Type": "application/json" } 
        });
      }
    }

    // Menampilkan halaman web utama untuk pengunjung
    return env.ASSETS.fetch(request);
  }
};
