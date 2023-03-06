module.exports = function consultsHandler({consults, vets, pets}){
    return {
        get: (data, callback) => {
            if(typeof data.index !== "undefined"){
                if(consults[data.index]) {
                    //se utiliza el return para evitar que siga con el callback de abajo
                    return callback(200, consults[data.index]);
                }
                return callback(404, {mensaje: `consulta con indice ${data.index} no encontrada`});
            }

            let _consults = [...consults];

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
            //esto no es necesario si tienes una base de datos, es solo si manejas toda la data en la memoria
            _consults = _consults.map((consult) =>({
                ...consult, 
                pet: { ...pets[consult.pet], id: consult.pet },
                vet: { ...vets[consult.vet], id: consult.vet },
            }));

            callback(200, _consults);
        },
        
        //IMPORTANTE: NO MUTAR CON .push(), DESTRUCTURAR Y AGREGAR como var = [...var, newAddtoVar]
        post: (data, callback) => {
            let newConsult = data.payload;
            newConsult.createdDate = new Date();
            newConsult.editedDate = null;
            consults = [...consults, newConsult];
            callback(201, data.payload);
        },
    
        put: (data, callback) => {
            if(typeof data.index !== "undefined"){
                if(consults[data.index]) {
                    const { createdDate } = consults[data.index];
                    consults[data.index] = {...data.payload, createdDate, editedDate: new Date()};
                    //se utiliza el return para evitar que siga con el callback de abajo
                    return callback(200, consults[data.index]);
                }
                return callback(404, {mensaje: `consulta con indice ${data.index} no encontrada`});
            }
            callback(400, { message: "index not sended" });
        },
    
        delete: (data, callback) => {
            if(typeof data.index !== "undefined"){
                if(consults[data.index]) {
                    //_pet lleva guion bajo porque se indica que es probable que la variable local no se va a utilizar
                    //aqui indicamos que entregue todos los elementos del objeto excepto el que le indiquemos en el indice
                    consults = consults.filter((_consult, index) => index != data.index);
                    //se utiliza el return para evitar que siga con el callback de abajo
                    return callback(204, { mensaje : `element with index ${data.index} deleted` });
                }
                return callback(404, {mensaje: `consulta con indice ${data.index} no encontrada`});
            }
            callback(400, { message: "index not sended" });
        },
    };
}