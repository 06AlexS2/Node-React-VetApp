//NOTA: CONSERVAR EL MISMO NOMBRE DE OBJETOS TANTO EN RESOURCES COMO EN EL JS

module.exports = {
    pets: [
        {petType: 'Perro', petName: 'Pimo', owner: 'Melissa'},
        {petType: 'Perro', petName: 'Mumi', owner: 'Alejandro'},

    ],

    vets: [
        {vetName: "Miguel", vetLName: "Monroy", vetLicense: "12301231", vetCountry: "Mexico"},
        {vetName: "Luis", vetLName: "Ucan", vetLicense: "98348234", vetCountry: "Mexico"},
        {vetName: "Aaron", vetLName: "Dominguez", vetLicense: "92843612", vetCountry: "Mexico"},
        {vetName: "Arvin", vetLName: "Balam", vetLicense: "928374", vetCountry: "Mexico"},
    ],

    owners: [
        {ownerName : "Alejandro", ownerLName : "Sánchez", ownerDocument : "Identificación Oficial (INE)"},
        {ownerName : "Meliisa", ownerLName : "Cetina", ownerDocument : "Identificación Oficial (INE)"},
        {ownerName : "Oscar", ownerLName : "Sánchez", ownerDocument : "Identificación Oficial (INE)"},
        {ownerName : "Jenny", ownerLName : "Azarcoya", ownerDocument : "Licencia de Conducir"},
    ],

    consults: [
        {pet: 0, 
         vet: 0, 
         createdDate: new Date(),
         editedDate: new Date(),
         record: 'la mascota vino con deficit hidrico',
         diagnosis: 'deshidratación fálica'},

        {pet: 1, 
         vet: 2, 
         createdDate: new Date(),
         record: 'Px presenta dolor en la oreja, tiene materia dentro del canal auditivo',
         diagnosis: 'Otitis Aguda'},
    ]
}