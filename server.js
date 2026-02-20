import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static("public"));

app.get("/consulta", async (req, res) => {
  try {
    const placa = req.query.placa;
    if (!placa) return res.json({ ok:false, msg:"Falta placa" });

    console.log("🔎 Consultando:", placa);

    const url = `https://consulta-simit.com.co/consultar.php?documento=${placa}`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Referer": "https://consulta-simit.com.co/",
        "Origin": "https://consulta-simit.com.co",
      }
    });

    res.json(response.data);

  } catch (err) {
    console.log("❌ ERROR:", err.message);
    res.json({ ok:false, error: err.message });
  }
});

app.listen(PORT, () =>
  console.log("🚀 http://localhost:" + PORT)
);
