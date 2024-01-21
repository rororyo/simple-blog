// imports
import express from "express";
import pg from "pg";
import bodyParser from "body-parser";

import env from "dotenv";

const { Client } = pg;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const port = 4000;
env.config();
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DB,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

await client.connect();

// GET Routes
app.get("/posts", async (req, res) => {
  const result = await client.query(
    "SELECT * FROM posts ORDER BY date_created DESC LIMIT 5"
  );

  const posts = result.rows;
  res.send(posts);
});

app.get("/posts/:id", async (req, res) => {
  const result = await client.query(
    "SELECT * FROM posts WHERE id = $1",
    [req.params.id]
  );
  const post = result.rows[0];
  res.send(post);
});





// POST Routes
app.post('/posts', async (req, res) => {
  try {
    const post = {
      category: req.body.category,
      title: req.body.title,
      post_content: req.body.post_content,
      author: req.body.author,
      picture: req.body.picture
    };

    const result = await client.query('INSERT INTO posts(category, title, post_content, author, picture) VALUES($1, $2, $3, $4, $5)',
      [post.category, post.title, post.post_content, post.author, post.picture]);

    res.status(200).send('Post added successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// PATCH Route
app.patch('/posts/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const post = {
      category: req.body.category,
      title: req.body.title,
      post_content: req.body.post_content,
      author: req.body.author,
      picture: req.body.picture
    };
    await client.query('UPDATE posts SET category = $1, title = $2, post_content = $3, author = $4, picture = $5 WHERE id = $6',
      [post.category, post.title, post.post_content, post.author, post.picture, postId]);
    res.status(200).send('Post updated successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// DELETE Route
app.delete('/posts/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    await client.query('DELETE FROM posts WHERE id = $1', [postId]);
    res.status(200).send('Post deleted successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});



// Server Start
app.listen(port, () => {
  console.log(`API is running on port ${port}`);
});
