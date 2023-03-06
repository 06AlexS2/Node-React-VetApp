module.exports = function ownersHandler(owners){
    return {
        get: (data, callback) => {
            if(typeof data.index !== "undefined"){
                if(owners[data.index]) {
                    //se utiliza el return para evitar que siga con el callback de abajo
                    return callback(200, owners[data.index]);
                }
                return callback(404, {mensaje: `dueño con indice ${data.index} no encontrado`});
            }
            if(data.query && 
                (data.query.ownerName ||
                        data.query.ownerLName || 
                        data.query.ownerDocument)) 
            {
                const queryKeys = Object.keys(data.query);
                let ownersResponse = [...owners];
            
                ownersResponse = ownersResponse.filter((_owner) => {
                    let result = false;
                    for (const key of queryKeys){
                        const search = data.query[key].normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                        const regularExp = new RegExp(search, "gi");

                        const accentlessOwnerField = _owner[key].normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                        result = accentlessOwnerField.match(regularExp);

                        if(result) {
                            break;
                        }
                    }
                    return result;
                });
                return callback(200, ownersResponse);
            }
            callback(200, owners);
        },
    
        post: (data, callback) => {
            owners.push(data.payload);
            callback(201, data.payload);
        },
    
        put: (data, callback) => {
            if(typeof data.index !== "undefined"){
                if(owners[data.index]) {
                    owners[data.index] = data.payload;
                    //se utiliza el return para evitar que siga con el callback de abajo
                    return callback(200, owners[data.index]);
                }
                return callback(404, {mensaje: `dueño con indice ${data.index} no encontrado`});
            }
            callback(400, { message: "index not sended" });
        },
    
        delete: (data, callback) => {
            if(typeof data.index !== "undefined"){
                if(owners[data.index]) {
                    //_pet lleva guion bajo porque se indica que es probable que la variable local no se va a utilizar
                    //aqui indicamos que entregue todos los elementos del objeto excepto el que le indiquemos en el indice
                    owners = owners.filter((_owner, index) => index != data.index);
                    //se utiliza el return para evitar que siga con el callback de abajo
                    return callback(204, { mensaje : `element with index ${data.index} deleted` });
                }
                return callback(404, {mensaje: `dueño con indice ${data.index} no encontrado`});
            }
            callback(400, { message: "index not sended" });
        },
    };
}