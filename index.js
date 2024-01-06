//imports
import express from 'express';
import axios from 'axios';
import multer from 'multer';
import bodyParser from "body-parser";
const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3000;
const apiUrl = 'http://localhost:4000';
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname);
    },
});
const upload = multer({ storage: storage });
app.use(upload.single('picture'));

// render homepage
app.get("/", async (req, res) => {
    try {
        const result = await axios.get(`${apiUrl}/posts`);
        const posts = result.data;
        res.render('home.ejs', { posts: posts });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
});

// render newpost page
app.get("/new", async (req, res) => {
    res.render('edit.ejs',{heading:"New Post", submit:"Create Post"});
})

//render post page
app.get("/posts/:id",async(req,res)=>{
    const result=await axios.get(`${apiUrl}/posts/${req.params.id}`)
    const post=result.data
    res.render('postPage.ejs',{post:post})
})


// Create a new post
app.post("/api/posts", async (req, res) => {
    try {
        
        const postData = {
            ...req.body,
            picture: req.file.filename,
        };

        
        await axios.post(`${apiUrl}/posts`, postData);
        res.redirect("/");
    } catch (error) {
        console.error("Error creating post:", error.message);
        res.status(500).json({ message: "Error creating post" });
    }
});

//render edit page
app.get("/edit/:id", async (req, res) => {
    try {
      const response = await axios.get(`${apiUrl}/posts/${req.params.id}`);
      
      res.render("edit.ejs", { post: response.data, heading: "Edit Post", submit: "Update Post" });
    } catch (error) {
      console.error("Error fetching post from API:", error);
      // Check if headers have already been sent before sending an error response
      if (!res.headersSent) {
        res.status(500).json({ message: "Error fetching post" });
      }
    }
  });
  
  

//update post
app.post ("/edit/:id", async (req, res) => {
    try {
        const postData = {
            ...req.body,
            picture: req.file.filename,
        };
        await axios.patch(`${apiUrl}/posts/${req.params.id}`, postData);
        res.redirect("/");
    } catch (error) {
        console.error("Error updating post:", error.message);
        res.status(500).json({ message: "Error updating post" });
    }
})


//delete post
app.get("/delete/:id",async (req,res)=>{
    const result=await axios.delete(`${apiUrl}/posts/${req.params.id}`)
    res.redirect("/")
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
