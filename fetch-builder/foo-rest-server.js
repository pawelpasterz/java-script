FooRest = (function() {
    const modes = AuthenticationModes;

    function build(parameters) {
        let params = {};
        if (parameters.options.body !== undefined) {
            return parameters.options.body;
        }
        validate(parameters);
        if (parameters.options.method !== 'POST') {
            return [];
        }
        params['loginMode'] = parameters.loginMode;
        params['username'] = parameters.username;
        params['password'] = parameters.password;
        return _encode(params).join('&');
    }

    function _encode(params) {
        let bodyContainer = [];
        Object.keys(params).forEach((property) => {
            let encodedParameter = encodeURIComponent(property);
            let encodedValue = encodeURIComponent(params[property]);
            bodyContainer.push(encodedParameter + '=' + encodedValue);
        });
        return bodyContainer;
    }

    function validate(parameters) {
        _validateURL(parameters);
        switch (parameters.options.method) {
            case 'GET':
                _validateGET(parameters);
                break;
            case 'POST':
                _validatePOST(parameters);
                break;
            case 'DELETE':
                _validateDELETE(parameters);
                break;
            default:
                throw new Error('Request method in fetch builder is undefined');
        }
    }

    function _validateURL(parameters) {
        let test = '';
        parameters.domain ? test += 't' : test += 'f';
        parameters.path ? test += 't' : test += 'f';
        parameters.file ? test += 't' : test += 'f';
        switch (test) {
            case 'ftt':
            case 'tft':
            case 'ttt':
                throw new Error('Sending server request and reading file ' +
                    'at the same time is not possible');
                break;
            case 'fff':
                throw new Error('Domain/path/file is undefined');
                break;
            case 'ftf':
            case 'tff':
                throw new Error('Invalid request url');
                break;
        }
    }

    function _validatePOST(parameters) {
        if (Object.values(modes).indexOf(parameters.loginMode) === -1) {
            throw new Error('Incorrect loginMode value');
        }
        if (parameters.username === undefined) {
            throw new Error('Username in fetch builder is undefined');
        }
    }

    function _validateGET(parameters) {
        // TODO
    }

    function _validateDELETE(parameters) {
        // TODO
    }

    return {
        build,
        validate,
    };
})();