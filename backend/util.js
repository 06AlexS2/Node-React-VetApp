//devolver un numero aleatorio que es base 36, para generar letras, eliminar el decimal con split utilizando
//la segunda parte de la constante.
const randomNumbers = () => Math.random().toString(36).split('.')[1];
const accentlessWord = (word) => word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

module.exports = {
    randomNumbers,
    accentlessWord,
}

