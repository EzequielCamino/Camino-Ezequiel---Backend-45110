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
    const role = req.session.role;
    console.log(role)
    console.log(role);
    if(role == "admin"){
        next();
    } else {
        res.status(401).send({message: `Unauthorized role. You must be an admin to access`});
    }
}

const userAuth = (req, res, next) => {
    const role = req.session.role;
    console.log(role)
    if(role === "user"){
        next();
    } else {
        res.status(401).send({message: `Unauthorized role. You must be an user to access`})
    }
}

module.exports = {publicAuth, privateAuth, adminAuth, userAuth};