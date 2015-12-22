var Linkedin = require('node-linkedin')(),
    _ = require('lodash'),
    util = require('./util.js');
// SET Input && Output structure
var pickInputs = {
        'id': 'id',
        'event': 'event-type',
        'start': 'start',
        'count': 'count'
    },
    pickOutputs = {
        '-': {
            keyName: 'values',
            fields: {
                'numLikes': 'numLikes',
                'timestamp': 'timestamp',
                'updateContent_company_id': 'updateContent.company.id',
                'updateContent_company_name': 'updateContent.company.name',
                'companyStatusUpdate_share_comment': 'updateContent.companyStatusUpdate.share.comment',
                'companyStatusUpdate_share_content_description': 'updateContent.companyStatusUpdate.share.content.description',
                'companyStatusUpdate_share_content_shortenedUrl': 'updateContent.companyStatusUpdate.share.content.shortenedUrl',
                'companyStatusUpdate_share_content_title': 'updateContent.companyStatusUpdate.share.content.title'
            }
        }
    };

module.exports = {

    /**
     * Authorize module.
     *
     * @param dexter
     * @returns {*}
     */
    authModule: function (dexter) {
        var accessToken = dexter.environment('linkedin_access_token');

        if (accessToken)
            return Linkedin.init(accessToken);

        else
            return false;
    },


    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var linkedIn = this.authModule(dexter),
            inputs = util.pickStringInputs(step, pickInputs);

        if (!linkedIn)
            return this.fail('A [linkedin_access_token] environment need for this module.');

        linkedIn.companies.updates(inputs.id, _.omit(inputs, ['id']), function(err, data) {
            if (err)
                this.fail(err);

            else if (data.errorCode !== undefined)
                this.fail(data.message || 'Error Code'.concat(data.errorCode));

            else
                this.complete(util.pickResult(data, pickOutputs));

        }.bind(this));
    }
};
