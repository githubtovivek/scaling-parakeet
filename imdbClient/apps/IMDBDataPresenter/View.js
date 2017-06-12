/**
 * @name IMDBDataProvider
 * @namespace
 */
(function(IMDBDataPresenter)
{
    /**
     * Creates a new IMDBDataProvider.
     */
    IMDBDataPresenter.View = function(app, templates)
    {
        var _template = templates.view();
        var _appTemplate = app.template;
        var _dataProvider = new IMDBDataProvider.IMDBDataProvider();

        var _renderDataView = function(data)
        {
            return templates.dataView(data).html();
        };

        var _displayNoDataMessage = function()
        {
            _template.vars.resultContainer.empty().append(templates.error().html());
        };

        var _displayData = function(err, movies)
        {
            if(!err)
            {
                _template.vars.resultContainer.empty();

                _.each(movies, function(movie)
                {
                    _template.vars.resultContainer.append(_renderDataView(movie));
                });
            }
            else
            {
                _displayNoDataMessage();
            }
        };

        var _search = function()
        {
            var searchText = _template.vars.searchText.val();

            if(!_.isEmpty(searchText))
            {
                var data = _dataProvider.getDataByName(searchText, _displayData);
            }
        };

        var _appendSearchTemplate = function()
        {
            _appTemplate.append(_template);
        };

        var _bindClickEventOnSearchButton = function()
        {
            _template.vars.search.on('click', function()
            {
                _search();
            });
        };

        this.initialize = function()
        {
            _appendSearchTemplate();
            _bindClickEventOnSearchButton();
            _displayNoDataMessage();
        };
    };
}(window.IMDBDataPresenter = window.IMDBDataPresenter || {}));
