const normalChar = (str) => {
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

module.exports = {
    normalChar,
}