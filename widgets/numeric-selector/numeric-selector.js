let React = require('react');
let ReactDOM = require('react-dom');

let utils = require('../../lib/utils.js');
let cx = require('classnames');
let autoHideContainerHOC = require('../../decorators/autoHideContainer');

let bem = utils.bemHelper('ais-numeric-selector');

/**
 * Instantiate a dropdown element to choose the number of hits to display per page
 * @param  {string|DOMElement} options.container CSS Selector or DOMElement to insert the widget
 * @param  {string} options.attributeName Name of the numeric attribute to use
 * @param  {Array} options.options Array of objects defining the different values and labels
 * @param  {number} options.options[i].value The numerical value to refine with
 * @param  {string} options.options[i].label Label to display in the option
 * @param  {string} [options.operator] The operator to use to refine
 * @param  {Object} [options.cssClasses] CSS classes to be added
 * @param  {string} [options.cssClasses.root] CSS classes added to the parent `<select>`
 * @param  {string} [options.cssClasses.item] CSS classes added to each `<option>`
 * @param  {boolean} [options.autoHideContainer=false] Hide the container when no results match
 * @return {Object}
 */

function numericSelector({
    container,
    operator = '=',
    attributeName,
    options,
    cssClasses: userCssClasses = {},
    autoHideContainer = false
  }) {
  let containerNode = utils.getContainerNode(container);
  let usage = 'Usage: numericSelector({container, attributeName, options[, cssClasses.{root,item}, autoHideContainer]})';

  let Selector = require('../../components/Selector');
  if (autoHideContainer === true) {
    Selector = autoHideContainerHOC(Selector);
  }

  if (!container || !options || options.length === 0 || !attributeName) {
    throw new Error(usage);
  }

  return {
    init: function(state, helper) {
      const currentValue = this._getRefinedValue(helper);
      this._refine(helper, currentValue || options[0].value);
    },

    render: function({helper, results}) {
      const currentValue = this._getRefinedValue(helper);
      const hasNoResults = results.nbHits === 0;

      const cssClasses = {
        root: cx(bem(null), userCssClasses.root),
        item: cx(bem('item'), userCssClasses.item)
      };
      ReactDOM.render(
        <Selector
          cssClasses={cssClasses}
          currentValue={currentValue}
          options={options}
          setValue={this._refine.bind(this, helper)}
          shouldAutoHideContainer={hasNoResults}
        />,
        containerNode
      );
    },

    _refine: function(helper, value) {
      if (value !== undefined) {
        helper.clearRefinements(attributeName);
        helper.addNumericRefinement(attributeName, operator, value);
        helper.search();
      }
    },

    _getRefinedValue: function(helper) {
      const refinements = helper.getRefinements(attributeName);
      let res;
      refinements.forEach(v => {
        if (v.operator === operator) {
          res = v.value[0];
          return false;
        }
      });
      return res;
    }
  };
}

module.exports = numericSelector;
