/* DEPENDECIES */
const { Router } = require(`express`);
const { NativeDate } = require("mongoose");
const fetch = require("node-fetch");
const Query = require("../models/RequestLog");

// APP 
const router = Router();


router.get("/search/shows/:search", (req ,res)=>{
    const SEARCH = req.params.search;
    const DATE = new Date();
    const IP = req.ip;

    fetch(`http://api.tvmaze.com/singlesearch/shows?q=${SEARCH}`)
    .then(res => res.json())
    .then(jsonRes => { res.status(200).send(jsonRes) })
    .catch(error=>{ res.status(404).send({error: "Serie not found"}) });

    /* const query = new queryData(SEARCH, DATE, IP); */
    const query = { search: SEARCH, date: DATE, ip: IP };
    
    const doc = new Query(query);

    doc.save()
    .then(query=>{console.log(query)})
    .catch(error=>{console.log(error)});


    
});

/* function queryData(search, date, ip) {
    this.search = search;
    this.date = date;
    this.ip = ip;
} */


module.exports = router; 


