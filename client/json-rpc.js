
/*
    JsonRPC 2.0 packer
*/


var JsonRPC = (function(module) {

	module.VERSION = '2.0';

	module.ERROR_PARSE = -32700;   // invalid JSON
	module.ERROR_INVALID_REQUEST = -32600;   // not a valid request object
	module.ERROR_METHOD_NOT_FOUND = -32601;   // method does not exist
	module.ERROR_INVALID_PARAMS = -32602;   // invalid method parameters
	module.ERROR_INTERNAL = -32603;   // internal Json RPC error

	module.ERROR_SERVER = -32000;
	// -32000 through -32099 errors are server-specific

	module.ERRORS = {};

	module.ERRORS[module.ERROR_PARSE.toString()] = {
		code   : module.ERROR_PARSE,
		message: 'Parse error'
	};

	module.ERRORS[module.ERROR_INVALID_REQUEST.toString()] = {
		code   : module.ERROR_INVALID_REQUEST,
		message: 'Invalid request'
	};

	module.ERRORS[module.ERROR_METHOD_NOT_FOUND.toString()] = {
		code   : module.ERROR_METHOD_NOT_FOUND,
		message: 'Method not found'
	};

	module.ERRORS[module.ERROR_INVALID_PARAMS.toString()] = {
		code   : module.ERROR_INVALID_PARAMS,
		message: 'Invalid params'
	};

	module.ERRORS[module.ERROR_INTERNAL.toString()] = {
		code   : module.ERROR_INTERNAL,
		message: 'Internal error'
	};

	module.ERRORS[module.ERROR_SERVER.toString()] = {
		code   : module.ERROR_SERVER,
		message: 'Server error'
	};

	/*
		  Pack a JsonRPC 2.0 message

		  @param {Object} message - object to be packaged. It requires to have all the
				fields needed by the JsonRPC 2.0 message that it's going to be generated

		  @return {String} - the stringified JsonRPC 2.0 message
	 */

	module.pack = function(message) {
		console.log('PACK LOG: msg, id, method: ', message, message.id, message.method);

		var result =
		{
			jsonrpc: module.VERSION
		};

		// Request
		if (message.method !== undefined) {
			result.method = message.method;

			if (message.params !== undefined) {
				result.params = message.params;
			}

			if (message.id !== undefined) {
				result.id = message.id;
			}

		} // Response
		else if (message.id === undefined) {
			var errStr = 'No method or id defined' + JSON.stringify(message);
			console.error(errStr);
			throw new TypeError(errStr);
		}
		else {
			result.id = message.id;

			if (message.error) {

				if (message.result !== undefined) {
					throw new TypeError('Both result and error are defined' + JSON.stringify(message));
				}

				result.error = message.error;
			}
			else if (message.result !== undefined) {
				result.result = message.result;
			}
			else {
				throw new TypeError('No result or error is defined' + JSON.stringify(message));
			}
		}

		var str = JSON.stringify(result);

		return str;
	};


	/*
		  Unpack a JsonRPC 2.0 message

		  @param {String} message - string with the content of the JsonRPC 2.0 message

		  @throws {TypeError} - Invalid JsonRPC version

		  @return {Object} - object filled with the JsonRPC 2.0 message content
	 */

	module.unpack = function(message) {

		var result = message;

		if (typeof message == 'string' || message instanceof String) {
			result = JSON.parse(message);
		}

		// Check if it's a valid message
		if (result.jsonrpc != module.VERSION) {
			throw new TypeError('Invalid JsonRPC version "' + version + '": ' + message);
		}

		// Response
		if (result.method == undefined) {

			if (result.id == undefined) {
				throw new TypeError('Invalid message: ' + message);
			}

			var result_defined = result.result !== undefined;
			var error_defined = result.error !== undefined;

			// Check only result or error is defined, not both or none
			if (result_defined && error_defined) {
				throw new TypeError('Both result and error are defined: ' + message);
			}

			if (!result_defined && !error_defined) {
				throw new TypeError('No result or error is defined: ' + message);
			}

			result.ack = result.id;
			delete result.id;
		}

		// Return unpacked message
		return result;
	};

	return module;

})(JsonRPC || {});

module.exports = JsonRPC;
