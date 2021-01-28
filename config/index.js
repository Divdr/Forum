module.exports = {
    dbUri: process.env.DB_URI,
    bcrypt:{
        salt:process.env.SALT
    },
    secretKeys:{
        jwt:process.env.JWT
    }
}