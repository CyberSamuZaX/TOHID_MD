//////////////////////////////////


const config = require('../config');
const { cmd } = require('../command');
const yts = require('yt-search');

cmd({
    pattern: "film",
    alias: ["ado", "pako"],
    react: "🎥",
    desc: "Download video from YouTube",
    category: "download",
    use: ".video <query or url>",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return await reply("❌ Please provide a video name or YouTube URL!");

        let videoUrl, title;
        
        // Check if it's a URL
        if (q.match(/(youtube\.com|youtu\.be)/)) {
            videoUrl = q;
            const videoInfo = await yts({ videoId: q.split(/[=/]/).pop() });
            title = videoInfo.title;
        } else {
            // Search YouTube
            const search = await yts(q);
            if (!search.videos.length) return await reply("❌ No results found!");
            videoUrl = search.videos[0].url;
            title = search.videos[0].title;
        }

        await reply("⏳ Downloading video...");

        // Use API to get video
        const downloadResponse = await fetch(`https://apis.davidcyriltech.my.id/movies/download?url=${encodeURIComponent(text)}`);
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data.success) return await reply("❌ Failed to download video!");

        await conn.sendMessage(from, {
            video: { url: data.result.download_url },
            mimetype: 'video/mp4',
            caption: `*${title}*`
        }, { quoted: mek });

        await reply(`✅ *${title}* downloaded successfully!`);

    } catch (error) {
        console.error(error);
        await reply(`❌ Error: ${error.message}`);
    }
});
////////////////////////////////












const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = async (context) => {
  const { client, m, text } = context;

  try {
    if (!text) return m.reply("Please provide a download link.");

    const downloadResponse = await fetch(`https://apis.davidcyriltech.my.id/movies/download?url=${encodeURIComponent(text)}`);
    const downloadData = await downloadResponse.json();

    if (!downloadData.status || !downloadData.movie || !downloadData.movie.download_links) return m.reply("No download links available for the selected movie.");

    const downloadLink = downloadData.movie.download_links[0].direct_download; // Select the desired quality link

    const response = await axios({
      url: downloadLink,
      method: "GET",
      responseType: "stream"
    });

    const outputPath = path.join(__dirname, `${downloadData.movie.title.replace(/[^a-zA-Z0-9 ]/g, "")}.mp4`);
    const writer = fs.createWriteStream(outputPath);

    response.data.pipe(writer);

    writer.on("finish", async () => {
      await client.sendMessage(m.chat, {
        document: { url: outputPath },
        mimetype: "video/mp4",
        fileName: `${downloadData.movie.title.replace(/[^a-zA-Z0-9 ]/g, "")}.mp4`
      }, { quoted: m });

      fs.unlinkSync(outputPath); // Clean up the downloaded file after sending
    });

    writer.on("error", (err) => {
      m.reply("Download failed\n" + err.message);
    });

  } catch (e) {
    m.reply('An error occurred while processing your request\n' + e);
  }
};
