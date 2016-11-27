// pull-ssh-config

var expandTilde = require('expand-tilde');
var fs = require('fs');
var path = require('path');

module.exports = function (args, callback) {
	var config = args.config || {};

	var remoteFile = expandTilde(config['ssh-config-remote']);
	var localFile = expandTilde(config['ssh-config-local']);
	var identityFile = expandTilde(config['ssh-config-identity-file']);
	var contentHeader = config['ssh-config-content-header'];
	var contentSeparator = config['ssh-config-content-separator'];

	if (!fs.existsSync(remoteFile)) {
		callback('Source file does not exist: ' + remoteFile);
		return;
	}
	if (!fs.existsSync(path.dirname(localFile))) {
		callback('Target directory does not exist: ' + path.dirname(localFile));
		return;
	}
	if (!fs.existsSync(identityFile)) {
		callback('Identity file does not exist: ' + identityFile);
		return;
	}

	var remoteFileContent = fs.readFileSync(remoteFile).toString();

	var content = '';
	content += contentHeader;
	if ('' !== identityFile) {
		content += 'IdentityFile ' + identityFile + '\n\n';
	}
	content += contentSeparator;
	content += remoteFileContent;

	// writes to local file
	fs.writeFileSync(localFile, content);

	// TODO: fix for cygwin
	fs.chmodSync(localFile, '644');

	callback(null, 'Successfully pulled ssh-config.');
};
