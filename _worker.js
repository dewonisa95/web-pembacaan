export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. Jika ESP32 mengirim data (POST) ke /api/sensor
    if (url.pathname === "/api/sensor" && request.method === "POST") {
      try {
        const data = await request.json();
        
        // Data dari ESP32 berhasil diterima di sini!
        console.log("Data ESP32 diterima:", data);

        // Kirim balasan sukses (200 OK) ke ESP32 supaya di Serial Monitor tertulis sukses
        return new Response(JSON.stringify({ status: "success", message: "Data diterima!" }), {
          status: 200,
          headers: { 
            "Content-Type": "application/json", 
            "Access-Control-Allow-Origin": "*" 
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: "Format data salah" }), { 
          status: 400, 
          headers: { "Content-Type": "application/json" } 
        });
      }
    }

    // 2. Jika orang lain membuka web dashboard di browser, tampilkan halaman web (HTML/CSS)
    return env.ASSETS.fetch(request);
  }
};
