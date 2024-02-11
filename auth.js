import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from 'cors';
import Cookies from 'js-cookie';
import { dbMiddleware } from "./dbsetup.js";
import cookieParser from 'cookie-parser';

const authApp = express();

authApp.use(express.json());
authApp.use(express.urlencoded({ extended: true }));
authApp.use(cookieParser());
authApp.use(dbMiddleware); // Use the shared database middleware

const saltRounds = 10;

// Check for cookies
export const isLoggedin = (req) => {
    const token = req.cookies.token;
    return !!token;
}

authApp.post("/register", async (req, res) => {
    const username=req.body.username
    const password = req.body.password;
    const client = req.dbClient;
    

    try {
        const checkResult = await client.query("SELECT * FROM users WHERE email = $1", [username]);

        if (checkResult.rows.length > 0) {
            res.render("register.ejs", { error: "Email already exists" });
        } else {
            const hash = await bcrypt.hash(password, saltRounds);
            const result = await client.query("INSERT INTO users(email,password) VALUES($1, $2) RETURNING *", [username,hash]);
            const user = result.rows[0];
            const token = generateToken(user);
            res.cookie("token", token);
            res.redirect("/");
        }
    } catch (err) {
        console.error('Error in registration:', err);
        res.render("login.ejs", { error: err.message });
    }
});

authApp.post("/login", async (req, res) => {
    const email = req.body.username;
    const password = req.body.password;
    const client = req.dbClient;

    try {
        const result = await client.query("SELECT * FROM users WHERE email = $1", [email]);

        if (result.rows.length > 0) {
            const user = result.rows[0];
            const storedHashPassword = user.password;
            const valid = await bcrypt.compare(password, storedHashPassword);

            if (valid) {
                const token = generateToken(user);
                res.cookie("token", token);
                res.redirect("/");
            } else {
                res.render("login.ejs", { error: "Invalid credentials" });
            }
        } else {
            res.render("login.ejs", { error: "Invalid credentials" });
        }
    } catch (err) {
       res.render("login.ejs", { error: err.message });
    }
});

authApp.get("/logout", (req, res) => {
    if (isLoggedin(req)) {

        res.clearCookie("token");
       
    }
    res.redirect("/login");
});

// Helper function to generate JWT
const generateToken = (user) => {
    return jwt.sign({ user }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
};

export default authApp;
