var createDate = function() {
    var date = new Date();
    var formatDate = '';

    formatDate += (date.getMonth() + 1) + '_';

    formatDate += date.getDate() + '_';

    formatDate += date.getFullYear();

    return formatDate;

};

module.exports = createDate;