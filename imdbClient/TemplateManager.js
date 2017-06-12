
(function(TemplateManager)
{
    "use strict";

    var templateExtension = '.htm';
    var translationExtension = '.json';

    TemplateManager.TemplateManager = function()
    {
        var _translationFileToTranslationDataMap = {};

        var _applyTemplate = function(templateFileContents, translationDataFileKey, templateData, getAsString)
        {
            templateData = templateData || {};

            var translations = [];
            var translatedTemplate = templateFileContents;
            var processedTemplate;

            // run the translated template through Handlebars
            processedTemplate = _performTemplateVariableReplacements(translatedTemplate, templateData, getAsString);

            if (!_.isString(processedTemplate))
            {
                // extract the elements indicated as variables
                processedTemplate.vars = _getTemplateVars(processedTemplate);
            }

            return processedTemplate;
        };

        var _performTemplateVariableReplacements = function(translatedTemplate, templateData, getAsString)
        {
            var processedTemplate;
            var compiledTemplate;
            try
            {
                compiledTemplate = Handlebars.compile(translatedTemplate);
                if (compiledTemplate)
                {
                    compiledTemplate = compiledTemplate(templateData);
                }
                else
                {
                    // unable to process the template, lets at least give them the translated version
                    compiledTemplate = translatedTemplate;
                }
            }
            catch(err)
            {
                compiledTemplate = translatedTemplate;
            }

            compiledTemplate = $.trim(compiledTemplate);

            if(!getAsString)
            {
                try
                {
                    processedTemplate = $(compiledTemplate);
                    if (processedTemplate.length == 0)
                    {
                        // this template doesn't have anything that can be parsed by jquery,
                        // just use it directly
                        processedTemplate = compiledTemplate;
                    }
                }
                catch (err)
                {
                    processedTemplate = compiledTemplate;
                }
            }

            return processedTemplate || compiledTemplate;
        };


        var _getTemplateVars = function(processedTemplate)
        {
            var templateVars = {};

            // find all of the variable tags
            _.each(processedTemplate.siblings().andSelf(), function(sibling)
            {
                sibling = $(sibling);
                // pick up the root data-var elements
                if (sibling.attr('data-var'))
                {
                    templateVars[sibling.attr('data-var')] = sibling;
                }

                // pick up the descendant data-var elements
                _.each(sibling.find('[data-var]'), function(varElement)
                {
                    varElement = $(varElement);
                    templateVars[varElement.attr('data-var')] = varElement;
                });
            });

            return templateVars;
        };

        var _getTemplateApplyFunction = function(templateFileContents, translationDataFileKey)
        {
            return function(templateData, getAsString)
            {
                return _applyTemplate(templateFileContents, translationDataFileKey, templateData, getAsString);
            };
        };

        var _loadTranslationDataFile = function(translationDataFileKey, callback)
        {
            window.ResourceLoader.loadFile(_getTranslationDataFileFullName(translationDataFileKey),
                function()
            {
                callback();
            });
        };

        var _getTranslationDataFileFullName = function(translationDataFileKey)
        {
            var translationDataKeyArray = translationDataFileKey.split('|');

            return translationDataKeyArray[0] + '/' +
                translationDataKeyArray[1] + translationExtension;
        };

        var _countTemplates = function(object)
        {
            var loadedTemplateCount = 0;

            _.each(object, function(potentialTemplate)
            {
                if (_.isFunction(potentialTemplate))
                {
                    loadedTemplateCount++;
                }
                else
                {
                    loadedTemplateCount += _countTemplates(potentialTemplate);
                }
            });

            return loadedTemplateCount;
        };

        var _processLoadedTemplate = function(
            loadedFileContents,
            templateRoot,
            templateName,
            translationDataFileName,
            templateDataReturn,
            finish)
        {
            var translationDataFileKey;

            if (translationDataFileName)
            {
               translationDataFileKey = templateRoot + '|' + translationDataFileName;
            }

            // build the directory hierarchy for this template onto the data return
            var templateNameSegments = templateName.split('/');
            var templateDataReturnSegment = templateDataReturn;
            _.each(_.initial(templateNameSegments), function(templateNameSegment)
            {
                if (!templateDataReturnSegment[templateNameSegment])
                {
                    templateDataReturnSegment[templateNameSegment] = {};
                }
                templateDataReturnSegment = templateDataReturnSegment[templateNameSegment];
            });

            // save the template apply function onto the data return
            templateDataReturnSegment[_.last(templateNameSegments)] =
                _getTemplateApplyFunction(loadedFileContents, translationDataFileKey);

            if (_translationFileToTranslationDataMap[translationDataFileKey] !== undefined)
            {
                // we have already loaded or requested this translation file
                finish();
            }
            else
            {
                // we have not seen this translation file before, load it
                _translationFileToTranslationDataMap[translationDataFileKey] = null;
                _loadTranslationDataFile(translationDataFileKey, finish);
            }
        };

        this.loadTemplates = function(templateRoot, translationDataFileName, templateNames, callback)
        {
            var templateDataReturn = {};
            var finish = _.after(templateNames.length, function()
            {
                callback(
                    templateDataReturn,
                    _countTemplates(templateDataReturn) == templateNames.length
                );
            });

            // load each of the templates
            _.each(templateNames, function(templateName)
            {
                var templateFullPath = templateRoot + '/' + templateName + templateExtension;

                window.ResourceLoader.loadFile(templateFullPath, function(loadedFileContents)
                {
                    if (!loadedFileContents)
                    {
                        // bad/missing file
                        finish();
                        return;
                    }

                    _processLoadedTemplate(
                        loadedFileContents,
                        templateRoot,
                        templateName,
                        translationDataFileName,
                        templateDataReturn,
                        finish
                    );
                });
            });
        };
    };
}(window.TemplateManager = window.TemplateManager || {}));

