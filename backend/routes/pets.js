module.exports = function petsHandler(pets){
    return {
        get: (data, callback) => {
            if(typeof data.index !== "undefined"){
                if(pets[data.index]) {
                    //se utiliza el return para evitar que siga con el callback de abajo
                    return callback(200, pets[data.index]);
                }
                return callback(404, {mensaje: `mascota con indice ${data.index} no encontrada`});
            }
            if  (data.query && 
                (data.query.petName || 
                 data.query.petType ||  
                 data.query.petOwner)) {
                const queryKeys = Object.keys(data.query);
                let petsResponse = [...pets];
                //por cada una de las llaves que tenga la entidad mascotas

                petsResponse = petsResponse.filter((_pet) => {
                    //ig es que no es sensitiva a mayusculas o minusculas
                    let result = false;
                    for(const key of queryKeys) {
                        const regEx = new RegExp(data.query[key], 'ig');
                        result = _pet[key].match(regEx);
                        if(result) {
                            break;
                        }
                    }
                    
                    return result;
                });
                    return callback(200, petsResponse);
                }
            callback(200, pets);
        },
    
        post: (data, callback) => {
            pets.push(data.payload);
            callback(201, data.payload);
        },
    
        put: (data, callback) => {
            if(typeof data.index !== "undefined"){
                if(pets[data.index]) {
                    pets[data.index] = data.payload;
                    //se utiliza el return para evitar que siga con el callback de abajo
                    return callback(200, pets[data.index]);
                }
                return callback(404, {mensaje: `mascota con indice ${data.index} no encontrada`});
            }
            callback(400, { message: "index not sended" });
        },
    
        delete: (data, callback) => {
            if(typeof data.index !== "undefined"){
                if(pets[data.index]) {
                    //_pet lleva guion bajo porque se indica que es probable que la variable local no se va a utilizar
                    //aqui indicamos que entregue todos los elementos del objeto excepto el que le indiquemos en el indice
                    pets = pets.filter((_pet, index) => index != data.index);
                    //se utiliza el return para evitar que siga con el callback de abajo
                    return callback(204, { mensaje : `element with index ${data.index} deleted` });
                }
                return callback(404, {mensaje: `mascota con indice ${data.index} no encontrada`});
            }
            callback(400, { message: "index not sended" });
        },
    };
}

