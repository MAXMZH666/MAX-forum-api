const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // 你的 GitHub Token
const REPO_ID = "R_kgDON6TVwg";  // 你的仓库 ID

app.post("/create-discussion", async (req, res) => {
    const { title, body, categoryId } = req.body;

    const query = `
        mutation {
            createDiscussion(input: {
                repositoryId: "${REPO_ID}",
                categoryId: "${categoryId}",
                title: "${title}",
                body: "${body}"
            }) {
                discussion {
                    title
                    url
                }
            }
        }
    `;

    const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${GITHUB_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ query })
    });

    const data = await response.json();

    if (data.errors) {
        return res.status(400).json({ error: data.errors[0].message });
    }

    res.json({ message: "帖子创建成功", url: data.data.createDiscussion.discussion.url });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});
