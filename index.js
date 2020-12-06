/* DEPENDENCIES */
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

/* URL DataBase */
const URL_DB = require("./config"); 

/* APP */
const app = express();

/* MIDDLEWARES */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* SETTINGS */
app.set("port", process.env.PORT || 3001);


/* ENDPOINTS */
app.use(require("./api/series"));






// DATABASE AND SERVER CONECTION
mongoose.connect(URL_DB, { useNewUrlParser: true, useUnifiedTopology: true }, (error) => {
    if (error) { console.log("Error on try connect database.\n") }
    else {
        console.log("Database conected.");

        app.listen(app.get("port"), (error) => {
            !error ? (
                console.log(`Server running in port ${app.get("port")}\n`)
            ) : ( console.log("Error at trying to run Backserver.") )
        })
    }
})
