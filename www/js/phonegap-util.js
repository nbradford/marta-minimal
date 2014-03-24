var $phonegap = {
    queue: [],
    isReady: false,
    init: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        this.isReady = true;
        alert("DEVICE READY");
        queue.forEach(function(fn) {
            fn.func.apply(null, fn.args);
        });
    },
    doWhenReady: function(fn, args) {
        if (this.isReady) {
            fn.apply(null, args);
        } else {
            this.queue.push({
                func: fn,
                args: args
            });
        }
    }
};