import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

const CV_URL = process.env.D2_PUBLIC_URL || process.env.D2_PRIVATE_URL;

// If public file — no auth needed
app.get("/api/cv", (req, res) => {
  res.json({ url: CV_URL });
});

// If private file — fetch with auth token
app.get("/api/cv/download", async (req, res) => {
  try {
    const response = await fetch(CV_URL, {
      headers: {
        'Authorization': 'Bearer ' + process.env.D2_TOKEN
      }
    });

    if (!response.ok) throw new Error("Failed to fetch file from D2");

    res.setHeader("Content-Type", response.headers.get("content-type"));
    res.setHeader("Content-Disposition", "inline; filename=cv.pdf");

    response.body.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to download CV" });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ API running on http://localhost:${PORT}`));
