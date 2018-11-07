(function () {
$(document).on('click', 'a', function (event) {
    if (!new RegExp('/' + window.location.host + '/').test(this.href)) {
    event.preventDefault();
    event.stopPropagation();

    window.open(this.href, '_blank');
    }
});
})(window.jQuery);