var Linkedin = require('node-linkedin')(),
    _ = require('lodash'),
    util = require('./util.js');
// SET Input && Output structure
var pickInputs = {
        'id': { key: 'id', validate: { req: true } },
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
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var linkedIn = Linkedin.init(dexter.provider('linkedin').credentials('access_token')),
            inputs = util.pickInputs(step, pickInputs),
            validateErrors = util.checkValidateErrors(inputs, pickInputs);

        if (validateErrors)
            return this.fail(validateErrors);

        linkedIn.companies.updates(inputs.id, _.omit(inputs, ['id']), function(err, data) {
            if (err || (data && data.errorCode !== undefined))
                this.fail(err || (data.message || 'Error Code: '.concat(data.errorCode)));
            else
                this.complete(util.pickOutputs(data, pickOutputs));

        }.bind(this));
    }
};
