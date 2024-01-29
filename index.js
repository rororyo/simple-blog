//imports
import express from "express";
import axios from "axios";
import multer from "multer";
import bodyParser from "body-parser";
import env from "dotenv";
import authApp from "./auth.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
const storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: (req, file, cb) => {
      cb(null, file.fieldname + "-" + Date.now() + file.originalname);
    },
  });
const app = express();
const upload = multer({ storage: storage });
const port = 3000;
const apiUrl = "http://localhost:4000";
const ensureAuthenticated = (req, res, next) => {
  if (req.cookies.token) {
    jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        res.redirect("/login");
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

const isAdmin = (req, res, next) => {
  const decoded= jwt.verify(req.cookies.token,process.env.JWT_SECRET)
  const userRole=decoded.user.role
  if(String(userRole)=="admin"){
   next()
  }
  else{
    res.redirect("/")
  }
}
env.config();

// Middleware order is important
app.use(express.static("public"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.single("picture"));
app.use(authApp);

// GET //
// Protect the homepage route
app.get("/", ensureAuthenticated, async (req, res) => {
  try {
    const result = await axios.get(`${apiUrl}/posts`);
    const posts = result.data;
    res.render("home.ejs", { posts: posts, user: req.user });
  } catch (error) {
    console.error("Error fetching authentication status:", error);
    res.status(500).send("Internal Server Error");
  }
});

//render admin dashboard
app.get("/admin-dashboard",isAdmin,async (req,res)=>{
const result= await axios.get(apiUrl+"/users")
res.render("admindash.ejs",{users:result.data})
})


// render newpost page
app.get("/new", async (req, res) => {
  res.render("edit.ejs", { heading: "New Post", submit: "Create Post" });
});

//render post page
app.get("/posts/:id", async (req, res) => {
  const result = await axios.get(`${apiUrl}/posts/${req.params.id}`);
  const post = result.data;
  res.render("postPage.ejs", { post: post });
});

//render edit page
app.get("/edit/:id", async (req, res) => {
  try {
    const response = await axios.get(`${apiUrl}/posts/${req.params.id}`);

    res.render("edit.ejs", {
      post: response.data,
      heading: "Edit Post",
      submit: "Update Post",
    });
  } catch (error) {
    console.error("Error fetching post from API:", error);
    // Check if headers have already been sent before sending an error response
    if (!res.headersSent) {
      res.status(500).json({ message: "Error fetching post" });
    }
  }
});

//delete post
app.get("/delete/:id", async (req, res) => {
  const result = await axios.delete(`${apiUrl}/posts/${req.params.id}`);
  res.redirect("/");
});

//render register page
app.get("/register",(req,res)=>{
    res.render("register.ejs");
})


//render login page
app.get("/login",(req,res)=>{
    res.render("login.ejs")
})



//POSTS//
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

//update post
app.post("/edit/:id", async (req, res) => {
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
});

app.post("/register",async (req,res)=>{
    try{
    const email = req.body.username;
    const password = req.body.password;
    const result=await axios.post(`${apiUrl}/register`,{
        username:email,
        password:password
    })
    }
    catch(err){
        console.log(err)
    }
    res.redirect("/")

})



app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
