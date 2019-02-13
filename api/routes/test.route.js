module.exports.testtrue = function (req, res) {
    res.json({ success: true })
};
module.exports.testfalse = function (req, res) {
    res.json({ success: false })
};