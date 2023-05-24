const privateAuth = (req, res, next) => {
    const userID = req.session.user;
    if(userID){
        next();
    } else {
        res.redirect("/api/sessions/login")
    }
}

const publicAuth = (req, res, next) => {
    
    const userID = req.session.user;
    if(!userID){
        next();
    } else {
        res.redirect("/api/sessions/profile")
    }
}

const adminAuth = (req, res, next) => {
    try {
        const role = req.user.role
        if(role == "admin"){
            next();
        } else {
            res.status(401).send({message: `Unauthorized role. You must be an admin to access. Your role is ${role}`});
        }
    } catch (error) {
        res.status(401).send({message: 'Unauthorized. You must be logged in'});
    }
}

const userAuth = (req, res, next) => {
    try {
        const role = req.user.role
        if(role === "user"){
            next();
        } else {
            res.status(401).send({message: `Unauthorized role. You must be an user to access`})
        }
    } catch (error) {
        res.status(401).send({message: 'Unauthorized. You must be logged in'});
    }
}

module.exports = {publicAuth, privateAuth, adminAuth, userAuth};