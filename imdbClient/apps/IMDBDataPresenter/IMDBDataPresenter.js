/**
 * @name IMDBDataPresenter
 * @namespace
 */
(function(IMDBDataPresenter)
{
    IMDBDataPresenter.IMDBDataPresenter = function()
    {
        var _self = this;
        var _templates;
        var _view;

        /**
         * {@link Application.Application#loadResources}
         */
        this.loadResources = function(onComplete)
        {
            Framework.applicationManager.loadApplicationResources('IMDBDataPresenter',
                null,
                [
                    'Common.css',
                    'View.js'
                ],
                [
                    'dataView',
                    'error',
                    'view'
                ],
                function(status, templates)
                {
                    _templates = templates;
                    onComplete(status);
                }
            );
        };



        /**
         * {@link Application.Application#initialize}
         */
        this.initialize = function()
        {
           _self.template = $("#applicationContainer");

            _view = new IMDBDataPresenter.View(_self, _templates);

            _view.initialize();
        };
    };
}(window.IMDBDataPresenter = window.IMDBDataPresenter || {}));
