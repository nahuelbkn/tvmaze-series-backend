/* DEPENDECIES */
const { Router } = require(`express`);
const fetch = require("node-fetch");

// APP 
const router = Router();


router.get("/search/shows/:search", (req ,res)=>{
    const SEARCH = req.params.search;

    fetch(`http://api.tvmaze.com/singlesearch/shows?q=${SEARCH}`)
    .then(res => res.json())
    .then(jsonRes => { res.status(200).send(jsonRes) })
    .catch(error=>{ res.status(404).send({error: "Serie not found"}) });
});

module.exports = router; 


