let React = require('react');
let ReactDOM = require('react-dom');

let {bemHelper, getContainerNode, prepareTemplateProps} = require('../../lib/utils.js');
let bem = bemHelper('ais-clear-all');
let cx = require('classnames');

let autoHideContainer = require('../../decorators/autoHideContainer');
let headerFooter = require('../../decorators/headerFooter');

let isEmpty = require('lodash/lang/isEmpty');

let defaultTemplates = require('./defaultTemplates');

/**
 * Allows to clear all refinements at once
 * @param  {string|DOMElement} options.container CSS Selector or DOMElement to insert the widget
 * @param  {Object} [options.cssClasses] CSS classes to add
 * @param  {string|string[]} [options.cssClasses.root] CSS class to add to the root element
 * @param  {string|string[]} [options.cssClasses.header] CSS class to add to the header element
 * @param  {string|string[]} [options.cssClasses.body] CSS class to add to the body element
 * @param  {string|string[]} [options.cssClasses.footer] CSS class to add to the footer element
 * @param  {string|string[]} [options.cssClasses.link] CSS class to add to the link element
 * @param  {Object} [options.templates] Templates to use for the widget
 * @param  {string|Function} [options.templates.header=''] Header template
 * @param  {string|Function} [options.templates.link] Link template
 * @param  {string|Function} [options.templates.footer=''] Footer template
 * @param  {boolean} [options.autoHideContainer=true] Hide the container when there's no refinement to clear
 * @return {Object}
 */
function clearAll({
    container,
    templates = defaultTemplates,
    cssClasses: userCssClasses = {},
    autoHideContainer: doAutoHideContainer = true
  } = {}) {
  let containerNode = getContainerNode(container);
  let usage = 'Usage: toggle({container[, cssClasses.{root,header,body,footer,link}, templates.{header,link,footer}, autoHideContainer]})';

  let ClearAll = headerFooter(require('../../components/ClearAll/ClearAll.js'));
  if (doAutoHideContainer === true) {
    ClearAll = autoHideContainer(ClearAll);
  }

  if (!container) {
    throw new Error(usage);
  }

  return {
    _clearAll: function(helper) {
      helper.clearRefinements().search();
    },

    render: function({helper, state, templatesConfig, createURL}) {
      let hasRefinements = !isEmpty(state.facetsRefinements)
        || !isEmpty(state.facetsExcludes)
        || !isEmpty(state.disjunctiveFacetsRefinements)
        || !isEmpty(state.numericRefinements)
        || !isEmpty(state.tagRefinements)
        || !isEmpty(state.hierarchicalFacetsRefinements);

      let cssClasses = {
        root: cx(bem(null), userCssClasses.root),
        header: cx(bem('header'), userCssClasses.header),
        body: cx(bem('body'), userCssClasses.body),
        footer: cx(bem('footer'), userCssClasses.footer),
        link: cx(bem('link'), userCssClasses.link)
      };

      let url = createURL(state.clearRefinements());

      let handleClick = this._clearAll.bind(null, helper);

      let templateProps = prepareTemplateProps({
        defaultTemplates,
        templatesConfig,
        templates
      });

      ReactDOM.render(
        <ClearAll
          clearAll={handleClick}
          cssClasses={cssClasses}
          hasRefinements={hasRefinements}
          shouldAutoHideContainer={!hasRefinements}
          templateProps={templateProps}
          url={url}
        />,
        containerNode
      );
    }
  };
}

module.exports = clearAll;
