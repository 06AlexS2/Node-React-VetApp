const http = require('node:http'); //si no se guarda en una constante
//no tengo como referenciarme a el para su uso posterior
const requestHandler = require('./request-handler')


//la constante server es lo que va a utilizarse para ejecutar
const server = http.createServer(requestHandler);

//y por ende, server siempre va a estar escuchando en donde uno le indique
server.listen(8000, ()=>{
    console.log("el servidor ahora escucha las peticiones en el servidor localhost:8000");
});

//nota: para matar el proceso debes presionar control+c (NO COMMAND, -->control<--)
/* si corres este codigo mediante "node index.js", y luego entras a un navegador y escribes "localhost:8000"
aparecerá una pagina en blanco, indicando que efectivamente está iniciado el servidor http */

/* COMO HACER MODULOS: ESCRIBIR LOS PASOS DE ACUERDO A SU ORDEN:
CUANDO EL CODIGO YA NO SE SIENTE COMODO O LEGIBLE DE FORMA FACIL, SE DEBE MODULAR O MOCHAR POR PEDAZOS EL MISMO
1. creas el modulo en un archivo .js, como con router
2. extraes el fragmento de codigo que quieras modular
3. para las variables que se utilicen en el nuevo modulo que esten declaradas en otro codigo, como pasa
aqui en index con resources, debe uno volverlas global tanto en el nuevo modulo como en el codigo original
¿por que? para que el store de donde se obtienen todos los recursos pueda ser accesible para todos los modulos
4. para el caso de serverCallback se cambió el nombre a request-handler
5. no olvidar que, en el nuevo modulo se debe borrar la declaracion de la funcion (i.e. const serverCallback)
y cambiarlo por "module.exports = funcion"
6. aquellas variables que se iluminen como inutilizadas debe uno pasarlas al contexto donde se utilizan
i.e. para request-handler debimos exportar url, stringDecoder y router
*/