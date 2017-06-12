/**
 * @name ApplicationManager
 * @namespace
 */
(function(ApplicationManager)
{
    "use strict";

    ApplicationManager.ApplicationManager = function()
    {
        var self = this;

        var _defaultApplicationPath = Framework.getStaticRoot() + 'apps';
        var _applications = {};
        var _pendingApplications = [];
        var _uninitializedApplications = [];
        var _expectedApplications = 0;
        var _loadedApplications = 0;
        var _readyToLoad = false;
        var _loadComplete = false;
        var _initializeStarted = false;
        var _applicationLoadOrder = {};

        var _constructApplication = function(applicationName)
        {
            if (!window[applicationName] || !window[applicationName][applicationName])
            {
                return undefined;
            }

            _applications[applicationName] = new window[applicationName][applicationName]();


            return _applications[applicationName];
        };

        var _initializeApplication = function(application)
        {
            _uninitializedApplications = _.without(_uninitializedApplications, application);
            application.initialize();
        };

        /**
         * If all of the applications have been loaded then initialize them.
         */
        var _initializeIfReady = function()
        {
            if (_loadedApplications < _expectedApplications)
            {
                // still waiting for more to come in
                return;
            }

            _initializeStarted = true;
            _uninitializedApplications = _.compact(_uninitializedApplications);
            while (_uninitializedApplications.length > 0)
            {
                _initializeApplication(_.first(_uninitializedApplications));
            }

            // all done, log any events recorded during startup
            _loadComplete = true;
        };

        this.startLoading = function()
        {
            _readyToLoad = true;
            _.each(_pendingApplications, function(pendingApplicationInfo)
            {
                self.loadApplication(pendingApplicationInfo.applicationName,
                    pendingApplicationInfo.applicationPath);
            });
        };

        this.loadApplication = function(applicationName, applicationPath)
        {
            if (_loadComplete)
            {
                return;
            }

            if (!applicationPath)
            {
                applicationPath = _defaultApplicationPath;
            }

            if (!_readyToLoad)
            {
                // we haven't been allowed to start loading yet, wait
                _pendingApplications.push(
                    {
                        applicationName:applicationName,
                        applicationPath:applicationPath
                    });
                return;
            }

            _applicationLoadOrder[applicationName] = _expectedApplications;
            _expectedApplications++;

            // assemble the path to the application
            var resourcePath = applicationPath;
            var fullApplicationPath;
            if (applicationPath.charAt(applicationPath.length - 1) != '/')
            {
                resourcePath += '/';
            }
            resourcePath += applicationName + '/';
            fullApplicationPath = resourcePath + applicationName + '.js';

            window.ResourceLoader.loadResources([fullApplicationPath], function()
            {
                var application = _constructApplication(applicationName);

                if (application &&
                    _.isFunction(application.loadResources) &&
                    _.isFunction(application.initialize))
                {
                    application.applicationResourcePath = resourcePath;

                    application.loadResources(function(success)
                    {
                        _loadedApplications++;

                        if (success)
                        {
                            _uninitializedApplications[_applicationLoadOrder[applicationName]] = application;
                        }
                        else
                        {
                            delete _applications[applicationName];
                        }

                        _initializeIfReady();

                    });
                }
                else
                {
                    delete _applications[applicationName];
                    _loadedApplications++;
                    _initializeIfReady();
                }
            });
        };

        this.loadApplicationResources = function(applicationName,
                                                 externalResourcesArray,
                                                 resourcesArray,
                                                 templatesArray,
                                                 callback)
        {
            if (!_applications[applicationName])
            {
                if (callback)
                {
                    callback(false);
                }
                return;
            }
            
            var applicationResourcePath = _applications[applicationName].applicationResourcePath;
            var resourcesWithPaths = [];

            _.each(resourcesArray, function(resource)
            {
                resourcesWithPaths.push(applicationResourcePath + resource);
            });

            if (externalResourcesArray)
            {
                resourcesWithPaths = _.union(externalResourcesArray, resourcesWithPaths);
            }

            var templates = {};
            var result = true;
            var finish = _.after(2, function()
            {
                callback(result, templates);
            });

            window.ResourceLoader.loadResources(resourcesWithPaths, function(status)
            {
                if (!status)
                {
                    result = status;
                }
                finish();
            });

            if (templatesArray && templatesArray.length > 0)
            {
                var templateRootPath = _applications[applicationName].applicationResourcePath + 'templates';
                var onLoaded = function(loadedTemplates, status)
                {
                    if (!status)
                    {
                        result = status;
                    }
                    templates = loadedTemplates;
                    finish();
                };

                Framework.templateManager.loadTemplates(
                    templateRootPath,
                    applicationName,
                    templatesArray,
                    onLoaded
                );
            }
            else
            {
                finish();
            }
        };
    };
}(window.ApplicationManager = window.ApplicationManager || {}));
