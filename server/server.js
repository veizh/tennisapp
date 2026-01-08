import express from "express";
import puppeteer from "puppeteer";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/api/sinner-matches", async (req, res) => {
  let browser;

  try {
    browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    const baseUrl =
      "https://www.tennisabstract.com/cgi-bin/player-classic.cgi?p=JannikSinner";

    // 🔹 Aller sur la page de base
    await page.goto(baseUrl, { waitUntil: "networkidle2" });
    await page.waitForSelector("#matches");

    // 🔹 Cliquer sur le toggle "Reverse Loss Scores" côté client
    const toggleExists = await page.$(".revscore.likelink");
    if (toggleExists) {
      await page.click(".revscore.likelink");

      // 🔹 Attendre que le DOM se mette à jour
      await new Promise(resolve => setTimeout(resolve, 300)); // 300ms suffisent
    } else {
      console.warn("⚠️ Toggle 'Reverse Loss Scores' non trouvé");
    }

    // 🔹 Scraping final du tableau matches
 const matches = await page.evaluate(() => {
  const table = document.getElementById("matches");
  if (!table) return [];

  const headers = Array.from(table.querySelectorAll("tr th")).map(th =>
    th.innerText.trim()
  );

  const rows = Array.from(table.querySelectorAll("tr")).slice(1);

  return rows.map(row => {
    const cells = Array.from(row.querySelectorAll("td"));
    const rowData = {};

    // Toutes les colonnes
    cells.forEach((cell, i) => {
      rowData[headers[i] || `col${i}`] = cell.innerText.trim();
    });

    // 🔹 Calcul du gagnant depuis Score
    const scoreText = rowData["Score"] || "";
    const sets = scoreText.split(" "); // ["6-4", "7-6", "6-3"]
    let setsWon = 0;
    let setsLost = 0;

    sets.forEach(set => {
      const [player, opponent] = set.split("-").map(s => parseInt(s));
      if (!isNaN(player) && !isNaN(opponent)) {
        if (player > opponent) setsWon++;
        else if (player < opponent) setsLost++;
      }
    });

    rowData.won = setsWon > setsLost;

    return rowData;
  });
});



    res.json(matches);

  } catch (err) {
    console.error("❌ Scraping error:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (browser) await browser.close();
  }
});

app.listen(3001, () => {
  console.log("✅ Backend running on http://localhost:3001");
});
