const User = require("../../models/User");

const userCreate = async () => {

    const user = {
        firstName: "Elkin",
        lastName: "Malan",
        email: "elkin@gmail.com",
        password: "1234elkin",
        phone: "0925302198"
    }

    await User.create(user)
}

module.exports = userCreate