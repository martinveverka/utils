#!/usr/bin/env node

var fs = require('fs');
var ini = require('ini');
var path = require('path');

function runMethod(method, options, callback) {
	try {
		if (typeof method === 'undefined') {
			callback('No method specified.');
		}

		var methodFile = path.dirname(module.filename) + '/methods/' + method + '.js';
		fs.exists(methodFile, function (exists) {
			if (!exists) {
				callback('Unknown command: ' + method);
				return;
			}

			var methodFn = require(methodFile);
			methodFn(options, callback);
		});
	} catch (e) {
		var err = e.toString();
		callback(err);
	}
}

var config = require('rc')(
	'mvutils',
	require('./config-defaults.json')
);

//var argv = require('minimist')(process.argv.slice(2));
var argv = require('yargs')
	.usage('mv-utils <method> [args]')
	.command('pull-ssh-config')
	.command('push-ssh-config')
	.demand(1)
//	.commandDir('methods')
	.help()
	.argv;

// console.log(config);

var outputType = typeof argv['output-type'] === 'string' ? argv['output-type'] : 'plain';
var method = argv._[0];
var options = argv;

options.config = config;

runMethod(method, options, function (err, data) {
	var output;
	if ('json' === outputType) {
		var result = {
			errorCode: 0,
			errorText: ''
		};
		if (err) {
			result = {
				errorCode: 1,
				errorText: err.toString()
			};
		} else {
			result.result = data;
		}
		output = JSON.stringify(result, null, '\t');
	} else if ('plain' === outputType) {
		if (err) {
			output = 'Error: ' + err.toString();
		} else {
			output = data.toString();
		}
	}

	// print
	console.log(output);
	if (err) {
		process.exit(1);
	}
});
