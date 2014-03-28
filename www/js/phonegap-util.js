var $phonegap = {
    queue: [],
    isReady: false,
    init: function() {
        var self = this;
        document.addEventListener('deviceready', function() {
            self.onDeviceReady.call(self);
        }, false);
    },
    onDeviceReady: function() {
        this.isReady = true;
        this.queue.forEach(function(fn) {
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