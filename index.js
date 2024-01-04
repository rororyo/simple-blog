//imports
import express from 'express'

const app= express()
app.use(express.static('public'))
const port=3000
//render homepage
app.get("/",(req,res)=>{
    res.render('home.ejs')
})


app.listen(port,()=>{console.log(`server is running on port ${port}`)})
