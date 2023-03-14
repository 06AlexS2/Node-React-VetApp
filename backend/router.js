const resources = require('./resources');
const pets = require('./routes/pets');
const vets = require('./routes/vets');
const owners = require('./routes/owners');
const consults = require('./routes/consults');
const path = require("path");
const fs = require("fs");

const fileHandler = (data, callback) => {
    let fileRoute = path.join(__dirname, "public", data.route);
    if(data.route === "static") {
        fileRoute = path.join(__dirname, "public", data.index);
    }
    const fileExists = fs.existsSync(fileRoute);
    if(fileExists) {
        const response = fs.createReadStream(fileRoute);
        return callback(200, response);
    }
    console.log(fileRoute);
    callback(200, {mensaje: "not found"});
}

module.exports = {
    ruta: (data, callback) => { //esto es un handler, se ve mas a detalle en express.js
        callback(200, {message: 'está es /ruta'})
    },

    pets: pets(resources.pets),

    vets: vets(resources.vets),

    owners: owners(resources.owners),

    consults: consults(resources),

    //verificar que inicialice cuando sirves los archivos estaticos en la carpeta build
    "index.html": {
        get: fileHandler,
    },

    "favicon.ico": {
        get: fileHandler,
    },

    "manifest.json": {
        get: fileHandler,
    },

    static: {
        get: fileHandler,
    },

    notFounded: (data, callback) => {
        callback(404, {message: 'no encontrado'});
    },
};