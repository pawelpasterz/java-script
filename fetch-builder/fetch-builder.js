/**
 * Function is responsible for creating fetch request.
 * Pass server implementation object while when calling new FetchBuilder.
 * Set up functions return reference to builder object itself.
 * Possible methods chaining.
 */
FetchBuilder = (function(serverImplementation) {
    const APPLICATION_FORM_URL_ENCODED = 'application/x-www-form-urlencoded';
    const APPLICATION_JSON = 'application/json';
    const _serverImplementation = serverImplementation;

    let _parameters = {
        options: {
            credentials: 'include',
        },
    };

    /**
     * Sets server domain
     * @param domainUrl - (String) server's domain address
     * Returns reference to fetch builder object
     */
    function domain(domainUrl) {
        _parameters.domain = domainUrl;
        return this;
    }

    /**
     * Sets server endpoint
     * @param pathUrl - (String) server's endpoint
     * Returns reference to fetch builder object
     */
    function path(pathUrl) {
        _parameters.path = pathUrl;
        return this;
    }

    /**
     * Sets request's type
     * @param requestsMethod - (String) type of request (POST, GET, DELETE,...)
     * Returns reference to fetch builder object
     */
    function method(requestsMethod) {
        _parameters.options['method'] = requestsMethod;
        return this;
    }

    /**
     * Disable including credentials.
     * Returns reference to fetch builder object
     */
    function doNotIncludeCredentials() {
        delete _parameters.options.credentials;
        return this;
    }
    /**
     * One can add additional option to request header, e.x. authorization
     * token, cookies, etc.
     * @param name - (String), name of parameter
     * @param value - (String, Integer), parameter value
     * Returns reference to fetch builder object
     */
    function addHeaderOption(name, value) {
        let header = {};
        header[name] = value;
        _parameters.options['headers'] = header;
        return this;
    }

    /**
     * Sets request's content type
     * @param contentType - can be chosen from enum values in fetch builder
     * Returns reference to fetch builder object
     */
    function setContentType(contentType) {
        let headers = {};
        headers['Content-Type'] = contentType;
        _parameters.options['headers'] = headers;
        return this;
    }

    /**
     * Sets request's login mode (if needed)
     * @param mode - (String, Integer) takes login mode
     * Returns reference to fetch builder object
     */
    function loginMode(mode) {
        _parameters.loginMode = mode;
        return this;
    }

    /**
     * Sets username (if needed)
     * @param name - (String) username
     * Returns reference to fetch builder object
     */
    function username(name) {
        _parameters.username = name;
        return this;
    }

    /**
     * Sets password (if needed)
     * @param password - (String) password
     * Returns reference to fetch builder object
     */
    function password(password) {
        _parameters.password = password;
        return this;
    }

    /**
     * One can add already prepared body
     * @param requestBody - (Object) request body
     * Returns reference to fetch builder object
     */
    function body(requestBody) {
        _parameters.options['body'] = requestBody;
        return this;
    }

    /**
     * One can fetch file, add path to file with this method
     * @param requestFile - type of request (POST, GET, DELETE,...)
     * Returns reference to fetch builder object
     */
    function file(requestFile) {
        _parameters.file = requestFile;
        return this;
    }

    function _getURL() {
        if (_parameters.domain === undefined
            && _parameters.path === undefined) {
            throw new Error('Invalid domain/path in FetchBuilder');
        }
        return _parameters.domain + _parameters.path;
    }

    function _getPayload() {
        _serverImplementation.validate(_parameters);
        _parameters.options['body'] = _serverImplementation.build(_parameters);
        return _parameters.options;
    }

    /**
     * Executes fetch
     * Returns Promises
     */
    function _fetch() {
        return _parameters.file
            ? fetch(_getURL())
            : fetch(_getURL(), _getPayload());
    }

    return {
        domain,
        path,
        body,
        file,
        method,
        addHeaderOption,
        loginMode,
        username,
        password,
        setContentType,
        doNotIncludeCredentials,
        fetch: _fetch,
        URL_ENCODED: APPLICATION_FORM_URL_ENCODED,
        JSON: APPLICATION_JSON,
    };
});
