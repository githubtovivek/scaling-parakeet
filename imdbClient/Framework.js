
/**
 * @name Framework
 * @namespace
 */
(function(Framework) {
    "use strict";

    var started = false;

    Framework.start = function(onReady, dynamicRoot, staticRoot) {

        Framework.getDynamicRoot = function () {
            return dynamicRoot;
        };

        Framework.getStaticRoot = function()
        {
            return staticRoot;
        };

        Framework.applicationManager = new ApplicationManager.ApplicationManager();

        Framework.templateManager = new TemplateManager.TemplateManager();

        onReady();
    }
}(window.Framework = window.Framework || {}));

