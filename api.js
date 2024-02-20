// imports
import express from "express";
import bodyParser from "body-parser";
import env from "dotenv";
import bcrypt from "bcrypt";
import { dbMiddleware } from "./dbsetup.js";  // Import the dbMiddleware

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const saltRounds = 10;
const port = 4000;
env.config();

// Add the dbMiddleware to the middleware stack
app.use(dbMiddleware);

// GET Routes
app.get("/posts", async (req, res) => {
  const client = req.dbClient;  // Access the database client from req object
  try {
    const result = await client.query(
      "select p.id,c.category_name,p.title,p.picture,p.post_content,p.author,p.date_created from posts p join category c on c.id=p.category_id ORDER BY p.date_created DESC LIMIT 5;"
    );

    const posts = result.rows;
    res.send(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get("/allposts", async (req, res) => {
  const client = req.dbClient;  // Access the database client from req object
  try {
    const result = await client.query(
      "SELECT p.id, c.category_name, p.title, p.picture, p.post_content, p.author, p.date_created FROM posts p JOIN category c ON c.id = p.category_id ORDER BY p.date_created DESC;"
    );
    res.send(result.rows);
    }
    catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
})
app.get("/posts/:id", async (req, res) => {
  const client = req.dbClient;  // Access the database client from req object
  try {
    const result = await client.query(
      "select p.id,c.category_name,p.title,p.picture,p.post_content,p.author,p.date_created from posts p join category c on c.id=p.category_id where p.id=$1",
      [req.params.id]
    );
    
    const post = result.rows[0];
    res.send(post);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get("/get-user/:id", async (req, res) => {
  const client = req.dbClient;  // Access the database client from req object
  try {
    const result =await client.query("SELECT * FROM users where id = $1", [req.params.id]);
    const users = result.rows[0];
    res.send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
})

app.get("/categories", async (req, res) => {
  const client = req.dbClient;  // Access the database client from req object
  try {
    const result = await client.query("SELECT * from category");
    const category = result.rows;
    res.send(category);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get("/categories-count",async (req,res)=>{
  const client = req.dbClient
  try {
    const result = await client.query("SELECT p.category_id, c.category_name, COUNT(*) as category_amount FROM posts p JOIN category c ON c.id = p.category_id GROUP BY p.category_id, c.category_name;");
    const category = result.rows;
    res.send(category);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
})

app.get("/api/categories/:name", async (req, res) => {
  const client = req.dbClient;
try{
  const result= await client.query("select p.id,c.category_name,p.title,p.picture,p.post_content,p.author,p.date_created from posts p join category c on c.id= p.category_id where c.category_name=$1",[req.params.name]);
  res.send(result.rows)
  
}
catch(err){
  console.log(err)
}
});

// POST Routes
app.post('/posts', async (req, res) => {
  const client = req.dbClient;  // Access the database client from req object
  try {
    const post = {
      category: req.body.category,
      title: req.body.title,
      post_content: req.body.post_content,
      author: req.body.author,
      picture: req.body.picture
    };

    const result = await client.query('INSERT INTO posts(category_id, title, post_content, author, picture) VALUES($1, $2, $3, $4, $5)',
      [post.category, post.title, post.post_content, post.author, post.picture]);

    res.status(200).send('Post added successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

//edit user

// PATCH Route
app.patch('/posts/:id', async (req, res) => {
  const client = req.dbClient;  // Access the database client from req object
  try {
    const postId = req.params.id;
    const post = {
      category: req.body.category,
      title: req.body.title,
      post_content: req.body.post_content,
      author: req.body.author,
      picture: req.body.picture
    };
    await client.query('UPDATE posts SET category_id = $1, title = $2, post_content = $3, author = $4, picture = $5 WHERE id = $6',
      [post.category, post.title, post.post_content, post.author, post.picture, postId]);
    res.status(200).send('Post updated successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

//edit user
app.patch('/users/:id', async (req, res) => {
  const client = req.dbClient;  // Access the database client from req object
  try {
    const userId = req.params.id;
    const hash=await bcrypt.hash(req.body.password,saltRounds)
    const user = {
      email: req.body.email,
      password: hash,
      role: req.body.role
    };
    await client.query('UPDATE users SET email = $1, password = $2, role = $3 WHERE id = $4',
      [user.email, user.password, user.role, userId]);
    res.status(200).send('User updated successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// DELETE Route
app.delete('/posts/:id', async (req, res) => {
  const client = req.dbClient;  // Access the database client from req object
  try {
    const postId = req.params.id;
    await client.query('DELETE FROM posts WHERE id = $1', [postId]);
    res.status(200).send('Post deleted successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

//get all users
app.get("/users", async (req, res) => {
  const client = req.dbClient;  // Access the database client from req object
  try {
    const result = await client.query("SELECT id,email,role FROM users");
    const users = result.rows;
    res.send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});



//delete a user
app.delete("/users/:id", async (req, res) => {
  const client = req.dbClient;  // Access the database client from req object
  try {
    const id = req.params.id;
    await client.query("DELETE FROM users WHERE id = $1", [id]);
    res.status(200).send('User deleted successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
})


// Server Start
app.listen(port, () => {
  console.log(`API is running on port ${port}`);
});
