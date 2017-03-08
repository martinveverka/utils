// diff-ssh-config

var child_process = require('child_process');
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
	if (!fs.existsSync(remoteFile)) {
		callback('Target file does not exist: ' + remoteFile);
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
	var tempFile = localFile + '-tmp';
	fs.writeFileSync(tempFile, content);

	var command = 'diff ' + localFile + ' ' + remoteFile;
	child_process.exec(command, function (err, stdout, stderr) {
		console.log(stdout.toString());
		fs.unlinkSync(tempFile);
		callback(null, '');
	});
};
