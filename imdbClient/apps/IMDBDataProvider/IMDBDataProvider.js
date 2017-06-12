/**
 * @name IMDBDataProvider
 * @namespace
 */
(function(IMDBDataProvider)
{
    /**
     * Creates a new IMDBDataProvider.
     */
    IMDBDataProvider.IMDBDataProvider = function()
    {
        var _baseURL = 'http://localhost:3000/';

        /**
         * {@link Application.Application#loadResources}
         */
        this.loadResources = function(onComplete)
        {
            Framework.applicationManager.loadApplicationResources('IMDBDataPresenter',
                null,
                [
                    'IMDBDataProvider.js'
                ],
                [
                ],
                function(status, templates)
                {
                    onComplete(status);
                }
            );
        };

        this.getDataByName = function(dataToBeSearched, callBack)
        {
            var dataToBeSent  = {
                query : 'brad pitt'
            };

            $.ajax({
                url : _baseURL + 'imdbDataProvider/getDataByName', // Your Servlet mapping or JSP(not suggested)
                data :dataToBeSent,
                type : 'POST',
                dataType : 'json', // Returns HTML as plain text; included script tags are evaluated when inserted in the DOM.
                success : function(response) {
                    callBack(undefined, response);
                },
                error : function(err) {
                    callBack(err, undefined);
                }
            });
        };
    };
}(window.IMDBDataProvider = window.IMDBDataProvider || {}));
