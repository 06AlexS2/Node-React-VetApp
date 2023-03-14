const { create, getOne, list, update, erase } = require("../data-handler");
const entityDir = "pets";

module.exports = function petsHandler(){
    return {
        get: async (data, callback) => {
            try {
                if(typeof data.index !== "undefined") {
                    const _pet = await getOne({
                        entityDir: "pets",
                        fileName: data.index,
                    });
                    if(_pet && _pet.id) {
                        return callback(200, _pet);
                    }
                    return callback(404, {
                        mensaje: `pet with id ${data.index} not found`
                    });
        
                }
                const _pets = await list({entityDir: "pets"});
                let petsResponse = [..._pets];

                /* verificar que data query tenga deatos en petType, owner o petName
                significando que el request es una busqueda */
                if(data.query && (data.query.petName || data.query.petType || data.query.owner)) {
                    //creo un array con las llaves del objeto data query
                    const queryKeys = Object.keys(data.query);

                    //filtro el array segun los datos en data.query
                    petsResponse = petsResponse.filter((_pet) => {
                        let result = false;
                        /* variable resultado cambiará a true cuando alguno de los campos de la _mascota esté en los criterios
                        de búsqueda es decir esté en alguno de los campos de data.query */

                        for(const key of queryKeys) {
                            /* creo una expresion regular para que la busqueda arroje resultados parciales
                            de lo que se manda como criterio de busqueda, i.e. si tipo gat en el query 
                            me devolviera todas las mascotas con tipo gato */
                            const regularExp = new RegExp(data.query[key], "ig");
                            //result guarda la verificacion de la expresion regular en cada campo
                            result = _pet[key].match(regularExp);

                            //si es diferente a falso o null rompemos el ciclo
                            if(result) {
                                break;
                            }
                        }
                        /* null es falsy por lo que ignorará resultado === null
                        y los que si tengan el criterio de busqueda entran en el array result */
                        return result;
                    });
                }
                let response = [];
                for(const pet of petsResponse) {
                    response = [...response, {
                        ...pet, 
                        owner: await getOne({
                        entityDir: "owners",
                        fileName: pet.owner,
                        }),
                    },
                ];
            };
            return callback(200, response);

            } catch (error) {
                if (error) {
                    console.log(error);
                    return callback(500, { mensaje: error.message });
                }
            }
        },

        post: async (data, callback) => {
            if (data && data.payload && data.payload.id) {
              const result = await create({
                entityDir,
                fileName: data.payload.id,
                dataSave: data.payload,
              });
              return callback(201, result);
            }
            callback(400, {
              message:
                "hay un error porque no se envió el payload o no se creó el id",
            });
        },
    
        put: async (data, callback) => {
            if(typeof data.index !== "undefined"){
                const currentData = {...data.payload, id: data.index};
                const result = await update({entityDir: "pets", fileName: data.index, currentData});
                if(result.id) {
                    return callback(200, result);
                }
                if(result.message) {
                    return callback(404, {mensaje: `mascota con indice ${data.index} no encontrada`});
                }
                return callback(500, {mensaje: 'error while updating'})
                
            }
            callback(400, { message: "id not sent" });
        },

        delete: async (data, callback) => {
            try {
                if (typeof data.index !== "undefined") {
                    const result = await erase({entityDir, 
                        fileName: data.index, 
                        currentData
                    });
                    if (result.message) {
                      return callback(404, {
                        mensaje: `mascota con indice ${data.index} no encontrada`,
                      });
                    }
            
                    if (result.mensaje) {
                      return callback(204);
                    }
            
                    return callback(500, { mensaje: "error al eliminar" });
                  }
            } catch (error) {
                callback(400, { mensaje: "falta id" });
            }
            
            
        },
    };
}

