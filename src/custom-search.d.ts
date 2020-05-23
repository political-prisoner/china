
import {BaseMixin, IGetSet} from 'dc';


export interface CustomSearch extends BaseMixin<CustomSearch> {
    normalize: IGetSet<Function, CustomSearch>;
    placeHolder: IGetSet<Function, CustomSearch>;
    filterFunctionFactory: IGetSet<Function, CustomSearch>;
}

export function customSearch(parent: string, chartGroup?: string): CustomSearch