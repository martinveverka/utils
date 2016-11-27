// push-ssh-config

var expandTilde = require('expand-tilde');
var fs = require('fs');
var path = require('path');

module.exports = function (args, callback) {
	var config = args.config || {};

	var remoteFile = expandTilde(config['ssh-config-remote']);
	var localFile = expandTilde(config['ssh-config-local']);
	var contentSeparator = config['ssh-config-content-separator'];

	if (!fs.existsSync(localFile)) {
		callback('Source file does not exist: ' + localFile);
		return;
	}
	if (!fs.existsSync(path.dirname(remoteFile))) {
		callback('Target directory does not exist: ' + path.dirname(remoteFile));
		return;
	}

	var localFileContent = fs.readFileSync(localFile).toString();
	var exportedContent = localFileContent.split(contentSeparator);
	var length = exportedContent.length;

	if (length < 1 && length > 2) {
		callback('Invalid ssh-config to be exported.');
		return;
	}

	var content = exportedContent[length - 1];

	// writes to remote file
	fs.writeFileSync(remoteFile, content);

	callback(null, 'Successfully pushed ssh-config.');
};
