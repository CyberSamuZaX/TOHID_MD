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
        const apiKey = "0f2c43ab11324578a7b1709651736382";
        const sinhalaNewsApi = "https://api.vajira.news/api/hirunews/latest"; // Sinhala news API
        
        // Get international news
        const intlResponse = await axios.get(https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey});
        const intlArticles = intlResponse.data.articles;

        // Get Sinhala news
        const sinhalaResponse = await axios.get(sinhalaNewsApi);
        const sinhalaArticle = sinhalaResponse.data.result;

        if (!intlArticles.length && !sinhalaArticle) return reply("No news articles found.");

        // Send Sinhala news first
        if (sinhalaArticle) {
            let sinhalaMessage = `
📰 ${sinhalaArticle.title}
📅 ${sinhalaArticle.date}
⚠️ ${sinhalaArticle.desc}
🔗 ${sinhalaArticle.link}

©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 �𝙱𝚈 𝚃𝙾𝙷𝙸𝙳_𝙼𝙳
            `;
            
            if (sinhalaArticle.img) {
                await conn.sendMessage(from, { image: { url: sinhalaArticle.img }, caption: sinhalaMessage });
            } else {
                await conn.sendMessage(from, { text: sinhalaMessage });
            }
        }

        // Send international news (limited to 3 articles)
        if (intlArticles.length) {
            for (let i = 0; i < Math.min(intlArticles.length, 3); i++) {
                const article = intlArticles[i];
                let message = `
📰 ${article.title}
⚠️ ${article.description || 'No description available'}
🔗 ${article.url}

©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚃𝙾𝙷𝙸𝙳_𝙼𝙳
                `;

                if (article.urlToImage) {
                    await conn.sendMessage(from, { image: { url: article.urlToImage }, caption: message });
                } else {
                    await conn.sendMessage(from, { text: message });
                }
            }
        }
    } catch (e) {
        console.error("Error fetching news:", e);
        reply("Could not fetch news. Please try again later.");
    }
});
