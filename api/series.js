/* DEPENDECIES */
const { Router } = require(`express`);
const fetch = require("node-fetch");
const Query = require("./../models/RequestLog");
const SeriesApiResponse= require("./../models/SeriesApiResponse")

// APP 
const router = Router();


router.get("/search/shows/:search", (req ,res)=>{
    const SEARCH = req.params.search;
    const DATE = new Date();
    const IP = req.ip;
    let responseFrom = null; /* NOTA para quien vea el código (al final del esta página) */


    SeriesApiResponse.findOne({name: SEARCH})
    .then((serie)=>{ /* Returns the object or null, if it can't find it. */
        
        if (serie) {
            /* The origin of the response is recorded. */
            responseFrom = "CACHE";

            /* The response is sent to the frontend. */
            res.status(200).send(serie)

            saveRequest(SEARCH, DATE, IP, responseFrom);
        }
        else {
            /* The origin of the response is recorded. */
            responseFrom = "API";

            saveRequest(SEARCH, DATE, IP, responseFrom);

            fetch(`http://api.tvmaze.com/singlesearch/shows?q=${SEARCH}`)
            .then(res => res.json())
            .then(jsonRes => { 

                /* First, the user is answered. */
                res.status(200).send(jsonRes);

                /* Then the API response is saved to MongoDB, if it was not saved previously.*/
                /* NOTA: Debo hacer esto ya que en la primer consulta a Mongo no sé la id de la serie
                    (id que le da TVMaze), y busco por nombre, y para que esa busqueda de un 
                    resultado desde MongoDB, el usuario debe escribir exactamente el nombre de la serie, 
                    luego, si no la encuentra en mongo, la pido a la API de TVM y entonces puedo ver el 
                    id, con ese dato analizo si ese id (no _id, sino id) está en la coleción, si está no 
                    hago nada, y si no, agrego la respuesta de la API a la colección. A futuro debería 
                    mejorar la forma en la que se hacen las busquedas, dentro de mi aplicación, para que 
                    sean suficientes algunas coincidencias para dar una respuesta, similar a al sistema 
                    de TVMaze.
                */

               SeriesApiResponse.findOne({id: jsonRes.id})
               .then((serie)=>{
                    if (!serie) {
                        const resApi = new SeriesApiResponse(jsonRes)
                        resApi.save()
                        .then(objSaved=>{console.log("Api response was saved in MongoDB.")})
                        .catch(error=>{"An error has ocurred."});
                    }
                }).catch(error=>{"An error has ocurred."});
            })
            .catch(error=>{ res.status(404).send({error: "Serie not found"}) });
        }
    })
    .catch( error => { res.status(500).send({ error: "An error has ocurred." })});
});

function queryOBJ(search, date, ip, responseFrom) {
    this.search = search;
    this.date = date;
    this.ip = ip;
    this.responseFrom = responseFrom;
}

function saveRequest(search, date, ip, responseFrom) {
    const query = new queryOBJ(search, date, ip, responseFrom);
    const doc = new Query(query);
    doc.save()
    .then(query=>{console.log("Request saved in MongoDB")})
    .catch(error=>{console.log("The request could not be saved to MongoDB")});
}


module.exports = router; 





/* NOTA */
/* Guayerd Code Challenge */
/* Parte 2 */
/* - Cada vez que el frontend realiza una petición, registrar en una colección deMongo 
    "requestLogs": fecha, texto de busqueda , IP (Si es posible) */
/* Bonus */
/* - En la colección "requestLogs", agregar un atributo al objeto "responseFrom" con dos 
    opciones "CACHE|API", completar segun corresponda. */

/* ¿Pero que pasa si la respuesta no está en MongoDB y la API de TVMaze tampoco nos 
    devuelve un objeto? Es decir, la respuesta no salió de CACHE ni de API ya que no hubo
    una respuesta satisfactoria, a menos que se tome como respuesta la negativa de la API */
/* Pensaba guardar null en lugar de CACHE o API, pero no estaría siguiendo el requerimiento,
    por lo que voy a considerar la respuesta de la api aunque sea negativa, ya que se debió
    consultarle. */
/* Solo se estará guardando null, si hubo algún inconveniente en la comunicación y no se llegó
    a pedir el recurso a ninguna de las partes.
*/

 


