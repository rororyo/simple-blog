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
app.get("/newpost", async (req, res) => {
    res.render('edit.ejs');
})

// Create a new post
app.post("/api/posts", async (req, res) => {
    try {
        // Include req.file.filename in the data sent to the API
        const postData = {
            ...req.body,
            picture: req.file.filename,
        };

        // Make the POST request to your API with modified data
        await axios.post(`${apiUrl}/posts`, postData);
        res.redirect("/");
    } catch (error) {
        console.error("Error creating post:", error.message);
        res.status(500).json({ message: "Error creating post" });
    }
});

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
