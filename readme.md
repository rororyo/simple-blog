# <h1>Simple Blog </h1>
## Description
This is a simple blog application where users can see blog posts made by admin. Made using ejs for to server side rendering and express to handle API calls integrated with postgreSQL database.
## Table of Contents
- [Description](#description)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Screenshots](#screenshots)
## Features
### Authentication
Password are hashed using bcrypt with a session that lasts 1 hour, after that, users need to log back in
### Home page 
Users can see the 5 latests page 
### Category page
Users can see all categories, this also enables users to view older posts groupped by category
### Admin dashboard
In the admin dashboard,admins can manage users including changing roles,emails, password, etc. Admins can also manage posts(basic CRUD).
## Installation 
1. Clone the repository:
   ```bash
   git clone https://github.com/rororyo/simple-blog.git

   cd ./SIMPLE-BLOG
   ```
2. install dependencies: 
    ```bash
    npm install
    ```
3. Modify the `.env` file so it matches your pgadmin options
4. Run the `posts.sql` file in the pgadmin query
5. Run the application: Using 2 terminals 
   ```bash
   Terminal 1 : node ./index.js
   Terminal 2 : node ./api.js
   ```
## Usage
1. After running both terminals successfully, you can access it in your browser with the this link: `http://localhost:3000`
2. Register your account, or you can use the already available admin account 
```txt
email : admin@admin.com
password : admin123
```
## Screenshots
Here are some screenshots of the application
### Authentication
![image](https://github.com/rororyo/simple-blog/assets/144687890/da4bf8d7-5b4c-44cc-ae32-7761ff79939c)
### Home Page
![image](https://github.com/rororyo/simple-blog/assets/144687890/b15a3168-877b-4cd8-b6fb-3ffc52b93565)
### Post Page
![image](https://github.com/rororyo/simple-blog/assets/144687890/836422d6-2ee6-4729-b6a8-080db97ba694)
### Category Page
![image](https://github.com/rororyo/simple-blog/assets/144687890/834bbb01-82f6-4513-a76b-f902cc532c61)
![image](https://github.com/rororyo/simple-blog/assets/144687890/e7a6e80c-4208-427f-ada3-a50346833291)
### Admin Dashboard
#### User List and Operations
User List
![image](https://github.com/rororyo/simple-blog/assets/144687890/a158b7ea-2d9e-4763-93a2-5ee8ffcf0b15)
#### Posts List and Operations
Post List
![image](https://github.com/rororyo/simple-blog/assets/144687890/2a49ad73-57b5-40ea-a786-f5f1488c5255)
Create Post
![image](https://github.com/rororyo/simple-blog/assets/144687890/f3eb5a41-354e-4aca-9d1b-015cba852047)
Edit Post
![image](https://github.com/rororyo/simple-blog/assets/144687890/0d56e98f-fc1f-419f-bb6f-6878911b922a)


