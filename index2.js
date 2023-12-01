const express = require("express");
const app = express();
const port = 3200;
const bodyparser = require("body-parser");
const cors = require("cors");

app.use(bodyparser.json());
app.use(cors());

app.post("/", (req,res) => {
    const dataToCompare = req.body.str;

    const wordRegex = /\b\w+\b/g;
    const wordCount = (dataToCompare.match(wordRegex) || []).length;

    if(wordCount >= 8){
        res.status(200).json("200 OK");
    } else {
        res.status(404).json("Not Acceptable");
    }
});

app.listen(port, ()=> {
    console.log(`Server running on ${port}`);
});