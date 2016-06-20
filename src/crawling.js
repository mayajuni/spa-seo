/**
 * Created by mayaj on 2016-06-19.
 */
var page = require('webpage').create();
var system = require('system');

if (system.args.length === 1) {
    console.log('need_url');
    phantom.exit()
}

var url = system.args[1];
page.settings.loadImages = false;
page.settings.localToRemoteUrlAccessEnabled = true;
page.settings.resourceTimeout = 5000;

page.onResourceTimeout = function(e) {
    console.log('timeout');
    phantom.exit(1);
};
page.open(url, function (status) {
    if (status !== 'success') {
        console.log('bad_network');
    } else {
        console.log(page.content);
    }
    phantom.exit();
});