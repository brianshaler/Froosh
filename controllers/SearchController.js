module.exports = {
    index: function (req, res, next) {
        res.redirect("/restaurants/search");
        return;
    }
}