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

page.open(url, function(status) {
    if (status !== 'success') {
        console.log('bad_network');
    } else {
        var content = page.content;
        console.log(content);
    }
    phantom.exit();
});