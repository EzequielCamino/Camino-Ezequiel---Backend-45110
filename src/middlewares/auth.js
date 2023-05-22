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

module.exports = {publicAuth, privateAuth};