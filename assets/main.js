---
# Front matter comment to ensure Jekyll properly reads file.
---

(function (hljs) {
    hljs.initHighlightingOnLoad();
})(window.hljs);

(function () {
    $(document).on('click', 'a', function (event) {
        if (!new RegExp('/^https://' + window.location.host + '/').test(this.href)) {
        event.preventDefault();
        event.stopPropagation();

        window.open(this.href, '_blank');
        }
    });
})(window.jQuery);