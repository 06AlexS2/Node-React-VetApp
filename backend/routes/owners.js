const { create, getOne, list, update, erase } = require("../data-handler");
const {accentlessWord} = require("../util")
const entityDir = "owners";


module.exports = function ownersHandler(owners){
    return {
        get:  async (data, callback) => {
            console.log("handler duenos", { data });
            try {
                if(typeof data.index !== "undefined") {
                    const _owner = await getOne({
                        entityDir,
                        fileName: data.index,
                    });
                    if(_owner && _owner.id) {
                        return callback(200, _owner);
                    }
                    return callback(404, {
                        mensaje: `owner with id ${data.index} not found`
                    });
                }
                const _owners = await list({entityDir});

                /* verificar que data query tenga deatos en petType, owner o petName
                significando que el request es una busqueda */
                if(data.query && (data.query.ownerName || data.query.ownerLName || data.query.ownerDocument)) {
                    //creo un array con las llaves del objeto data query
                    const queryKeys = Object.keys(data.query);
                    let ownersResponse = [..._owners];
                    //filtro el array segun los datos en data.query
                    ownersResponse = ownersResponse.filter((_owner) => {
                        let result = false;
                        /* variable resultado cambiará a true cuando alguno de los campos de la _mascota esté en los criterios
                        de búsqueda es decir esté en alguno de los campos de data.query */

                        for(const key of queryKeys) {
                            const search = accentlessWord(data.query[key]);
                            /* creo una expresion regular para que la busqueda arroje resultados parciales
                            de lo que se manda como criterio de busqueda, i.e. si tipo gat en el query 
                            me devolviera todas las mascotas con tipo gato */
                            const regularExp = new RegExp(search, "gi");
                            const accentlessOwnerField = accentlessWord(_owner[key]);
                            //result guarda la verificacion de la expresion regular en cada campo
                            result = accentlessOwnerField.match(regularExp);

                            //si es diferente a falso o null rompemos el ciclo
                            if(result) {
                                break;
                            }
                        }
                        /* null es falsy por lo que ignorará resultado === null
                        y los que si tengan el criterio de busqueda entran en el array result */
                        return result;
                    });
                    return callback(200, ownersResponse);
                }
                callback(200, _owners);
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
            callback(400, {mensaje: "there was an error on the payload or the id was not created"});
        },
    
        put: async (data, callback) => {
            if(typeof data.index !== "undefined"){
                const currentData = {...data.payload, id: data.index};
                const result = await update({
                    entityDir,
                    fileName: data.index,
                    currentData,
                });
                if(result.id) {
                    return callback(200, result);
                }
                if(result.message) {
                    return callback(404, {mensaje: `owner with index ${data.index} not found`});
                }
                return callback(500, {mensaje: "error while updating"})
            }
            callback(400, { message: "index not sent" });
        },
    
        delete: async (data, callback) => {
            try {
                if (typeof data.index !== "undefined") {
                    const result = await erase({
                        entityDir, 
                        fileName: data.index,
                    });
                    if (result.message) {
                      return callback(404, {
                        mensaje: `dueño con indice ${data.index} no encontrado`,
                      });
                    }
            
                    if (result.mensaje) {
                      return callback(204);
                    }
            
                    return callback(500, { mensaje: "error al eliminar" });
                  }
            } catch (error) {
                callback(400, { mensaje: "id missing" });
            }
            
        },
    };
}