var list = {
    clean: require('./tasks/clean'),
    dependency: require('./tasks/dependency'),
    environment: require('./tasks/environment'),
    commons: require('./tasks/commons'),
    libraryElements: require('./tasks/libraryElements'),
    jadeToJs: require('./tasks/jadeToJs'),
    jadeToHTML: require('./tasks/jadeToHTML'),
    staticFile: require('./tasks/static'),
    sprite: require('./tasks/sprite'),
    scssToCss: require('./tasks/scssToCss'),
    concatApiFixture: require('./tasks/concatApiFixture'),
    manifest: require('./tasks/manifest'),
    codestyle: require('./tasks/codestyle'),
    tests: require('./tasks/tests')
};

module.exports = {
    list: list,
    configuration: function (config) {
        if (config) {
            for (var key in list) {
                if (config.hasOwnProperty(key) && typeof list[key].configuration === 'function') {
                    list[key].configuration(config[key]);
                }
            }
        }
    }
};