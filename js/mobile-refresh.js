// js/mobile-refresh.js
(function() {

    function isMobileDevice() {
        return /Mobi|Android/i.test(navigator.userAgent);
    }

    function shouldRefresh() {
        return !sessionStorage.getItem('refreshed');
    }

    function refreshPage() {
        sessionStorage.setItem('refreshed', 'true');
        location.reload();
    }

    if (isMobileDevice() && shouldRefresh()) {
        refreshPage();
    }
})();