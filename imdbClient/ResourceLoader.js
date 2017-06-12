
/**
 * @name ResourceLoader
 * @namespace
 */
(function(ResourceLoader)
{
    "use strict";

    var _requestQueue = [];
    var _maximumPendingRequests = 100;
    var _numPendingRequests = 0;
    var _loadedUrls = [];
    var _head = $('head').first();

    ResourceLoader.loadResources = function(resources, callback)
    {
        if (!_.isFunction(callback))
        {
            callback = function() {};
        }

        // remove duplicates and URLs that have already been processed
        resources = _.difference(_.uniq(resources), _loadedUrls);

        // ensure that the work we are about to do doesn't get done twice
        _loadedUrls = _.union(_loadedUrls, resources);

        ResourceLoader.loadFiles(resources, function(loadedFileData)
        {
            var result = true;
            _.each(resources, function(loadedFileName)
            {
                var loadedFileContents = loadedFileData[loadedFileName];

                if (!loadedFileContents)
                {
                    result = false;
                    return;
                }

                switch(getExtension(loadedFileName))
                {
                    case 'js':
                        loadedFileContents += "\n//# sourceURL=" +
                            loadedFileName;

                        var script = window.document.createElement('script');
                        script.type = 'text/javascript';
                        script.id = loadedFileName;
                        script.text = '<!-- \n\n' + loadedFileContents + '\n\n -->';
                        document.body.appendChild(script);
                        break;
                    case 'css':
                        _head.append("<style type='text/css'>"+loadedFileContents+"</style>");
                        break;
                    default:
                        // not supported
                        console.error('resource not supported: ' + loadedFileName);
                        return;
                }
            });

            callback(result);
        });

    };

    ResourceLoader.loadFiles = function(files, callback)
    {
        if (!_.isFunction(callback))
        {
            callback = function() {};
        }

        var storagePrefix = "";
        var loadedFileData = {};

        if (files.length == 0)
        {
            // why was this called?
            callback(loadedFileData);
            return;
        }

        var finish = _.after(files.length, function()
        {
            callback(loadedFileData);
        });

        _.each(files, function(file)
        {
            ResourceLoader.loadFile(file, function(fileContent)
            {
                loadedFileData[file] = fileContent;
                finish();
            });
        });
    };

    ResourceLoader.loadFile = function(file, callback)
    {
        if (!_.isFunction(callback))
        {
            callback = function() {};
        }

        var loadFunction = function()
        {
            var fileContents = null;

            _numPendingRequests++;

            $.ajax(
                {
                    url: file,
                    type:'GET',
                    dataType:'text',
                    xhrFields: { withCredentials: true },
                    success:function(data, textStatus, jqXHR)
                    {

                        fileContents = data;

                        finish();
                    },
                    error:function()
                    {
                        finish();
                    }
                });

            function finish()
            {
                callback(fileContents);

                _numPendingRequests--;
                if (_numPendingRequests < _maximumPendingRequests &&
                    _requestQueue.length > 0)
                {
                    _requestQueue.pop()();
                }
            }
        };

        if (_numPendingRequests < _maximumPendingRequests)
        {
            loadFunction();
        }
        else
        {
            _requestQueue.push(loadFunction);
        }
    };

    function getExtension(url)
    {
        return url.split(".").pop().split("?").shift();
    }

}(window.ResourceLoader = window.ResourceLoader || {}));
