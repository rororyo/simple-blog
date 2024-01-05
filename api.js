// imports
import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
import multer from "multer";

const { Client } = pg;


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static("public"));
const port = 4000;

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "Simple Blog",
  password: "Ryokeren123",
  port: 5432,
});

await client.connect();

// get request -> display 5 posts
app.get("/posts", async (req, res) => {
  const result = await client.query(
    "SELECT * FROM posts ORDER BY date_created DESC LIMIT 5"
  );

  const posts = result.rows;
  res.send(posts);
});

// post new blog
app.post('/posts', async (req, res) => {
    
  try {
    const post = {
      category: req.body.category,
      title: req.body.title,
      post_content: req.body.post_content,
      author: req.body.author,
      picture: req.body.picture
    }

    // Insert the data into the database
    const result = await client.query('INSERT INTO posts(category, title, post_content, author, picture) VALUES($1, $2, $3, $4, $5)',
      [post.category, post.title, post.post_content, post.author, post.picture]);

    res.status(200).send('Post added successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }

});

app.listen(port, () => {
  console.log(`api is running on port ${port}`);
});
