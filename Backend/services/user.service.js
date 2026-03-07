const userModel = require('../models/user.model');


module.exports.createUser = async ({
    firstname, lastname, email, password
}) => {
    if (!firstname || !email || !password) {
        throw new Error('All fields are required');
    }
    const user = await userModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password
    })

    return user;
}

module.exports.findUserByEmail = async (email) => {
    return await userModel.findOne({ email });
}

module.exports.createUserFromGoogle = async (googleUser) => {
    const { email, name, picture } = googleUser;
    const firstname = name ? name.split(' ')[0] : '';
    const lastname = name ? name.split(' ').slice(1).join(' ') : '';

    let user = await userModel.findOne({ email });

    if (!user) {
        user = await userModel.create({
            fullname: {
                firstname,
                lastname
            },
            email,
            password: null,
            isGoogleAccount: true
        });
    }

    return user;
}

