module.exports = function (source, sourceMap, meta) {

    // 直接返回即可
    return "export default " + JSON.stringify(source);

}
