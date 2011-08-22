module.exports = {
    index: function (req, res, next) {
        res.redirect("/user/register");
        return;
    }
}