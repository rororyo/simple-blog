// imports

//TODO: implement pagination
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
const saltRounds = 10;

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
  const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
  const userRole = decoded.user.role;
  if (String(userRole) === "admin") {
    next();
  } else {
    res.redirect("/");
  }
};

const checkRole = (req, res, next) => {
  const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
  const userRole = decoded.user.role;
  return userRole;
};

env.config();

// Middleware 
app.use(express.static("public"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.single("picture"));
app.use(authApp);

// Admin Routes
// render admin dashboard
app.get("/admin-dashboard", isAdmin, async (req, res) => {
  const result = await axios.get(apiUrl + "/users");
  const userRole = checkRole(req, res);
  res.render("admindash.ejs", { users: result.data, isAdmin: userRole == "admin" });
});

// render admin dashboard posts
app.get("/admin-dashboard-posts", isAdmin, async (req, res) => {
  var totalDatas=await axios.get(`${apiUrl}/posts-count`);
  var totalPage= Math.ceil(parseInt(totalDatas.data[0].count) / 10);
  const result = await axios.get(`${apiUrl}/allposts/1`);
  const posts = result.data;
  const userRole = checkRole(req, res);
  res.render("admindash-posts.ejs", { posts: posts, isAdmin: userRole == "admin" ,totalPages:totalPage,currentPage:1});
});

//admin dashboard posts pagination
app.get("/admin-dashboard-posts/:page", isAdmin, async (req, res) => {
  const page = parseInt(req.params.page);
  var totalDatas=await axios.get(`${apiUrl}/posts-count`);
  var totalPage= Math.ceil(parseInt(totalDatas.data[0].count) / 10);
  const result = await axios.get(`${apiUrl}/allposts/${page}`);
  const posts = result.data;
  const userRole = checkRole(req, res);
  res.json({ posts: posts, isAdmin: userRole == "admin",currentPage:page,totalPages:totalPage}) 
});


// delete user from admin dashboard
app.get("/delete-user/:id", isAdmin, async (req, res) => {
  const result = await axios.delete(`${apiUrl}/users/${req.params.id}`);
  res.redirect("/admin-dashboard");
});

// render edit user page
app.get("/edit-user/:id", isAdmin, async (req, res) => {
  const result = await axios.get(`${apiUrl}/get-user/${req.params.id}`);
  const userRole = checkRole(req, res);
  res.render("edit-user.ejs", { user: result.data, isAdmin: userRole == "admin" });
});

// User Routes
// GET //

app.get("/", ensureAuthenticated, async (req, res) => {
  try {
    const result = await axios.get(`${apiUrl}/posts`);
    const userRole = checkRole(req, res);
    res.render("home.ejs", { posts: result.data, user: req.user, isAdmin: userRole == "admin" });
  } catch (error) {
    console.error("Error fetching authentication status:", error);
    res.status(500).send("Internal Server Error");
  }
});
//render category page
app.get("/category",ensureAuthenticated, async (req, res) => {
  try{
    const result=await axios.get(`${apiUrl}/categories-count`)
    res.render("category.ejs",{postCategories:result.data});
  }
catch(err){
  //will be changed to res.render with error message
  res.redirect("/")
}
})

//render category page by category name
app.get("/category/:name",ensureAuthenticated, async (req, res) => {
  try{
   const category_name=req.params.name
    const result=await axios.get(`${apiUrl}/api/categories/${category_name}`)
    res.render("categorypage.ejs",{posts:result.data,category_name:category_name});
  }
  catch(err){
    //will be changed to res.render with error message
    res.redirect("/")
  }
})


// render newpost page
app.get("/new", isAdmin,async (req, res) => {
  const userRole = checkRole(req, res);
  const result = await axios.get(apiUrl + "/categories");
  const categories = result.data;
  res.render("edit.ejs", { heading: "New Post", submit: "Create Post", isAdmin: userRole == "admin", categories: categories });
});

// render post page
app.get("/posts/:id", isAdmin,async (req, res) => {
  
  const result = await axios.get(`${apiUrl}/posts/${req.params.id}`);
  const post = result.data;
  const userRole = checkRole(req, res);
  res.render("postPage.ejs", { post: post, isAdmin: userRole == "admin" });
});

// render edit page
app.get("/edit/:id",isAdmin, async (req, res) => {
  try {
    const userRole = checkRole(req, res);
    const response = await axios.get(`${apiUrl}/posts/${req.params.id}`);
    const categories = await axios.get(apiUrl + "/categories");
    
    res.render("edit.ejs", {
      post: response.data,
      heading: "Edit Post",
      submit: "Update Post",
      isAdmin: userRole == "admin",
      categories: categories.data
    });
  } catch (error) {
    console.error("Error fetching post from API:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Error fetching post" });
    }
  }
});


// delete post
app.get("/delete/:id",isAdmin ,async (req, res) => {
  const result = await axios.delete(`${apiUrl}/posts/${req.params.id}`);
  res.redirect("/admin-dashboard-posts");
});

// render register page
app.get("/register", (req, res) => {
  res.render("register.ejs");
});

// render login page
app.get("/login", (req, res) => {
  res.render("login.ejs");
});




// POSTS //
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

// update post
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

app.post("/register", async (req, res) => {
  try {
    const email = req.body.username;
    const password = req.body.password;
    const result = await axios.post(`${apiUrl}/register`, {
      username: email,
      password: password,
    });
  } catch (err) {
    console.log(err);
  }
  res.redirect("/");
});

app.post("/edit-user/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const email = req.body.email;
    const password = req.body.password;
    const result = await axios.patch(`${apiUrl}/users/${id}`, {
      email: email,
      password: password,
      role: req.body.role,
    });
  } catch (err) {
    console.log(err);
  }
  res.redirect("/admin-dashboard");
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
