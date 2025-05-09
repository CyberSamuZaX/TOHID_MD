const axios = require('axios');
const { cmd } = require('../command');

cmd({
    pattern: "news",
    desc: "Get the latest news headlines.",
    category: "news",
    react: "📰",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const response = await axios.get('https://malaka-md-api-bot.vercel.app/news/hiru');
        const articles = response.data;

        if (!articles.length) return reply("No news articles found.");

        // Send each article as a separate message with image and title
        for (let i = 0; i < Math.min(articles.length, 5); i++) {
            const article = articles[i];
            let message = `
📰 ${article.title}
⚠️ ${article.description}
🔗 ${article.url}

  ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚃𝙾𝙷𝙸𝙳_𝙼𝙳
            `;

            console.log('Article URL:', article.image); // Log image URL for debugging

            if (article.image) {
                // Send image with caption
                await conn.sendMessage(from, { image: { url: article.image }, caption: message });
            } else {
                // Send text message if no image is available
                await conn.sendMessage(from, { text: message });
            }
        };
    } catch (e) {
        console.error("Error fetching news:", e);
        reply("Could not fetch news. Please try again later.");
    }
});
