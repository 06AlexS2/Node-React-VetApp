const { create, getOne, list, update, erase } = require("../data-handler");
const entityDir = "consults";


module.exports = function consultsHandler({consults}){
    return {
        get: async(data, callback) => {
            if(typeof data.index !== "undefined"){
                const _consult = await getOne({
                    entityDir,
                    fileName: data.index
                });
                if(_consult && _consult.id) {
                    return callback(200, _consult);
                }
                return callback(404, {mensaje: `consulta con indice ${data.index} no encontrada`});
            }
        
            let _consults = await list({entityDir});

            if(  data.query && 
                (data.query.pet ||
                data.query.vet || 
                /*data.query.createdDate !== "undefined" || 
                data.query.editedDate !== "undefined" ||*/
                data.query.record ||
                data.query.diagnosis)) 
            {
                
                const queryKeys = Object.keys(data.query);
                _consults = _consults.filter((_consult) => {
                    let result = false;
                    for(const key of queryKeys) {
                        if(key === "createdDate" || key === "editedDate") {
                            continue;
                        }
                        if((key === "diagnosis" || key === "record") && data.query[key]) {
                            const regularExp = new RegExp(data.query[key], "gi");
                            result = _consult[key].match(regularExp);
                        }
                        if(key === "vet" || key === "pet") {
                            result = _consult[key] == data.query[key];
                        }
                        if(result) {
                            break;
                        }
                    }
                    return result;
                })
                
            };
            
            let response = [];
            for (const consult of _consults) {
                response = [
                    ...response,
                    {
                        ...consult,
                        pet: await getOne({
                            entityDir: "pets",
                            fileName: consult.pet,
                        }),

                        vet: await getOne({
                            entityDir: "vets",
                            fileName: consult.vet,
                        }),
                    },
                ];
            }
            callback(200, response);
        },
        
        //IMPORTANTE: NO MUTAR CON .push(), DESTRUCTURAR Y AGREGAR como var = [...var, newAddtoVar]
        post: async (data, callback) => {
            if(data && data.payload && data.payload.id) {
                const result = await create({
                    entityDir,
                    fileName: data.payload.id,
                    dataSave: data.payload,
                });
                return callback(201, result);
            };
            callback(400, {mensaje: 'there is an error because the payload was not sent.'})
        },
    
        put: async (data, callback) => {
            if (typeof data.index !== "undefined") {
              const currentData = { ...data.payload, id: data.index };
              const result = await update({
                entityDir,
                fileName: data.index,
                currentData,
              });
              if (result.id) {
                return callback(200, result);
              }
              if (result.message) {
                return callback(404, {
                  mensaje: `dueño con indice ${data.index} no encontrad`,
                });
              }
            }
            callback(400, { mensaje: "falta id" });
          },
    
        delete: async (data, callback) => {
            if(typeof data.index !== "undefined") {
                const result = await erase({
                    entityDir,
                    fileName: data.index,
                });

                if(result.message) {
                    return callback(404, {mensaje: `consult with id ${data.index} not found`});
                }

                if(result.mensaje) {
                    return callback(204);
                }

                return callback(500, {mensaje: "error while deleting."});
            } 

            callback(400, {mensaje: "missing id."});
        },
    };
};