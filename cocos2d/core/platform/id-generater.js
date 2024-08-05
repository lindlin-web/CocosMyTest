var NonUuidMark = '.';

function IdGenerater(category) {
    this.id = 0 | (Math.random() * 998);

    this.prefix = category ? (category + NonUuidMark) : '';
}

IdGenerater.prototype.getNewId = function() {
    return this.prefix + (++this.id);
};
IdGenerater.global = new IdGenerater("global");
module.exports = IdGenerater;