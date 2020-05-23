import {BaseMixin, constants, events, redrawAll} from 'dc';


const INPUT_CSS_CLASS = 'dc-text-filter-input form-control';

export class CustomSearch extends BaseMixin {
    /**
     * Create Text Filter widget
     * @example
     *
     * var data = [{"firstName":"John","lastName":"Coltrane"}{"firstName":"Miles",lastName:"Davis"}]
     * var ndx = crossfilter(data);
     * var dimension = ndx.dimension(function(d) {
     *     return d.lastName.toLowerCase() + ' ' + d.firstName.toLowerCase();
     * });
     *
     * new TextFilterWidget('#search')
     *     .dimension(dimension);
     *     // you don't need the group() function
     *
     * @param {String|node|d3.selection|CompositeChart} parent - Any valid
     * {@link https://github.com/d3/d3-selection/blob/master/README.md#select d3 single selector}
     * specifying a dom block element such as a div; or a dom element or d3 selection.
     * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
     * Interaction with a chart will only trigger events and redraws within the chart's group.
     */
    constructor (parent, chartGroup) {
        super();

        this._normalize = s => s.toLowerCase();

        this._filterFunctionFactory = query => {
            query = this._normalize(query);
            return d => this._normalize(d).indexOf(query) !== -1;
        };

        this._placeHolder = 'search';

        this.group(() => {
            throw 'the group function on textFilterWidget should never be called, please report the issue';
        });

        this.anchor(parent, chartGroup);
    }

    _doRender () {
        this.select('input').remove();

        this._input = this.root().append('input')
            .classed(INPUT_CSS_CLASS, true);

        const chart = this;
        this._input.on('input', function () {
            chart.dimension().filterFunction(chart._filterFunctionFactory(this.value));
            events.trigger(() => {
                redrawAll();
            }, constants.EVENT_DELAY);
        });

        this._doRedraw();

        return this;
    }

    _doRedraw () {
        this.root().selectAll('input')
            .attr('placeholder', this._placeHolder);

        return this;
    }

    /**
     * This function will be called on values before calling the filter function.
     * @example
     * // This is the default
     * chart.normalize(function (s) {
     *   return s.toLowerCase();
     * });
     * @param {function} [normalize]
     * @returns {TextFilterWidget|function}
     */
    normalize (normalize) {
        if (!arguments.length) {
            return this._normalize;
        }
        this._normalize = normalize;
        return this;
    }

    /**
     * Placeholder text in the search box.
     * @example
     * // This is the default
     * chart.placeHolder('type to filter');
     * @param {function} [placeHolder='search']
     * @returns {TextFilterWidget|string}
     */
    placeHolder (placeHolder) {
        if (!arguments.length) {
            return this._placeHolder;
        }
        this._placeHolder = placeHolder;
        return this;
    }

    /**
     * This function will be called with the search text, it needs to return a function that will be used to
     * filter the data. The default function checks presence of the search text.
     * @example
     * // This is the default
     * function (query) {
     *     query = _normalize(query);
     *     return function (d) {
     *         return _normalize(d).indexOf(query) !== -1;
     *     };
     * };
     * @param {function} [filterFunctionFactory]
     * @returns {TextFilterWidget|function}
     */
    filterFunctionFactory (filterFunctionFactory) {
        if (!arguments.length) {
            return this._filterFunctionFactory;
        }
        this._filterFunctionFactory = filterFunctionFactory;
        return this;
    }
}


export const customSearch = (parent, chartGroup) => new CustomSearch(parent, chartGroup);
