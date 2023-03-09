const url = require('url')
//crear stringDecoder para recibir objetos
const stringDecoder = require('string_decoder').StringDecoder;
const router = require('./router');//cuando creas un modulo se llama con la ruta del archivo, asi como este
const { randomNumbers } = require('./util');

//el objeto o prototipo http tiene un método que se llama por el punto .
module.exports = (req, res) => {
    //paso 1: obtener la url desde el objeto request "req"
    const currUrl = req.url;
    const parsedUrl = url.parse(currUrl, true);
    console.log({currUrl, parsedUrl});

    //paso 2: obtener la ruta
    const route = parsedUrl.pathname;

    //paso 3: quitar / de ruta
    const cleanRoute = route.replace(/^\/+|\/+$/g, '');

    //paso 3.1: obtener el metodo http
    const method = req.method.toLowerCase();

    //paso 3.1.1: dar permisos de CORS escribiendo los headers
    /* para requests sin credenciales, el valor literal '*' puede ser especificado, como una carta maestra o comodin (wildcard)
    el valor le dice a los navegadores que permita al codigo solicitado desde cualquier origen a accesar al recurso */
    //("header", "clave-valor")
    res.setHeader("Access-Control-Allow-Origin", "*");
    //Dejaremos que en nuestra API se utilicen esos 5 metodos
    res.setHeader("Access-Control-Request-Methods", "OPTIONS, GET, PUT, DELETE, POST");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, DELETE, POST");
    res.setHeader("Access-Control-Allow-Headers", "*");
    //paso 3.1.2: dar respuesta inmediata cuando el metodo sea options
    if(method === "options"){
        res.writeHead(200);
        res.end();
        return;
    }

    //paso 3.2: obtener variables del query url

    //constante hecha con destructuring { constante }
    /* para hacer un query, en cualquier url o ruta, se utiliza un simbolo '?' para representar todos
    los querys implementados, y en el navegador, la ruta dice algo como:
    "http://localhost:8000/ruta?var1=1&var2=2"
    donde los '&' separan a los querys o variables en la url */
    //NOTA: el 'query = {} indica que si no hay busquedas o requests de query devuelva un objeto vacio
    //para evitar errores
    const { query = {} } = parsedUrl;
    console.log({query});

    //paso 3.3: obtener los headers desde el request
    const { headers } = req;
   
    //paso 3.4: obtener payload en el caso de haberlo
    //va a obtener una fuente de información (stream) y la idea es irlos recibiendo e irlos poniendo
    //en su lugar, de forma que yo entiendo el mensaje
    const decoder = new stringDecoder('utf-8');
    let buffer = '';
    //3.4.1 ir acumulando la data cuando el request reciba un payload, o
    //request empieza a escuchar cuando le lleguen datos de un payload
    req.on('data', (data) => {
        buffer += decoder.write(data);
    });
    //3.4.2 terminar de acumular datos y decirle al decoder que finalice
    //o le indico al decoder que ya no reciba más datos
    req.on('end', () => {
        buffer += decoder.end();

        //reemplazo la variable por lo qud viene en buffer pero en formato JSON
        if(headers["content-type"] === "application/json"){
            buffer = JSON.parse(buffer);
        }

        //paso 3.4.3 revisar si tiene subrutas (o indices en caso de tener un elemento de multiples instancias)
        //i.e. elemento de un array
        if(cleanRoute.indexOf('/') > -1) {
            //separar las rutas
            var [mainRoute, index] = cleanRoute.split('/');
        }


        //paso 3.5 ordenar los datos de respuesta
        //estoy creando lo que llega en request pero de una forma legible para el desarrollador
        let data = {
            index,
            route: mainRoute || cleanRoute,
            query,
            method,
            headers,
            payload: buffer,
        };

        if(method === 'post' && data.payload) {
            data.payload.id = randomNumbers();
        }

        //paso 3.6 elegir el manejador de la respuesta dependiendo de la ruta y asignarle la función que el enrutador tiene (handler)
        let handler;
        if(data.route && router[data.route] && router[data.route][method]){
            //dentro de handler estará la funcion que se mande
            handler = router[data.route][method];
        } else {
            handler = router.notFounded;
        }

        //paso 4: enviar una respuesta dependiendo de la ruta
        /*NOTA: te daba el error 'ERR_STREAM_WRITE_AFTER_END' porque despues de un res.end()
        debes poner return;, de lo contrario, finalizará el stream de requests en el servidor 
        exhibit A: */
        /*switch(cleanRoute){
            case 'ruta':
                res.end("estas en una ruta conocida")
                return;
            default:
                res.end('esta ruta no es conocida')
                return;
        }*/

        if(typeof handler === 'function') {
            handler(data, (statusCode = 200, message) => {
                let response = null;
                if(typeof message === "string") {
                    response = message;
                }
                if(typeof message === "object") {
                    response = JSON.stringify(message);
                }
                
                //clave valor
                res.setHeader('Content-Type', "application/json")
                res.writeHead(statusCode);
                //linea donde realmente ya estamos respondiendo a la aplicacion cliente
                res.end(response);
            });
        }
    });
};