const generateUserErrorInfo = (user) => {
    return `One or more properties were not valid.
    List of required properties:
    * name          : needs to be a String, received ${user.name}
    * lastname      : needs to be a String, received ${user.lastname}
    * age           : needs to be a Number, received ${user.age}
    * email         : needs to be a String, received ${user.email}
    * password      : needs to be a String, received ${user.password}
    `
}

const generateProductErrorInfo = (product) => {
    return `One or more properties were not valid.
    List of required properties:
    * title         : needs to be a String, received ${product.title}
    * description   : needs to be a String, received ${product.description}
    * code          : needs to be a String, received ${product.code}
    * price         : needs to be a Number, received ${product.price}
    * stock         : needs to be a Number, received ${product.stock}
    * category      : needs to be a String, received ${product.category}
    `
}

module.exports = {
    generateUserErrorInfo,
    generateProductErrorInfo
}