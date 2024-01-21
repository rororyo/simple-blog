import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import bcrypt from "bcrypt";
const { Client } = pg;

const authApp = express();
authApp.use(bodyParser.json());
authApp.use(bodyParser.urlencoded({ extended: true }));
authApp.use(express.static("public"));

const port = 4000;

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DB,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });
  

await client.connect();
authApp.use(
    session({
      secret: process.env.AUTH_SECRET,
      resave: false,
      saveUninitialized: true,
    })
  );
  authApp.use(passport.initialize());
  authApp.use(passport.session());
  const saltRounds = 10;
  authApp.post("/register", async (req, res) => {
    const email = req.body.username;
    const password = req.body.password;
    try {
      const checkResult = await client.query("SELECT * FROM users where email=$1", [email]);
      if (checkResult.rows.length > 0) {
        res.send("user already exists");
      } else {
        bcrypt.hash(password, saltRounds, async (err, hash) => {
          if (err) {
            console.error("error hashing password", err);
          } else {
            const result = await client.query("INSERT INTO users(email,password) VALUES($1,$2) RETURNING *", [email, hash]);
            const user = result.rows[0];
            req.login(user, (err) => {
              res.redirect("/")
            });
          }
        });
      }
    } catch (err) {
        res.status(500).send(err.message);;
    }
  });
  
  authApp.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login",
    })
  );

  authApp.get("/logout", (req, res) => {
    req.logout(function (err) {
      if (err) {
        return console.log(err);
      }
    });
    res.redirect("/login");
  });


// Passport Auth Configuration
passport.use("local", new Strategy(async function verify(username, password, cb) {
    try {
      const result = await client.query("SELECT * FROM users where email=$1", [username]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHashPassword = user.password;
        bcrypt.compare(password, storedHashPassword, (err, valid) => {
          if (err) {
            console.error(err);
            return cb(err);
          } else {
            if (valid) {
              return cb(null, user);
            } else {
              return cb(null, false);
            }
          }
        });
      }
      else{
        return cb("User not found");
      }
    } catch (err) {
        res.status(500).send(err.message);
    }
  }));
  
  passport.serializeUser((user, cb) => {
    cb(null, user);
  });
  
  passport.deserializeUser((user, cb) => {
    cb(null, user);
  });

export default authApp;