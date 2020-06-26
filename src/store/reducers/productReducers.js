import { GET_PRODUCTS, GET_PRODUCT_CATEGORIES, GET_PRODUCT, GET_SIMILAR_PRODUCTS } from "../actions/productActions";

const initState = {
    products: [],
    product: {},
    categories: []
}

const productReducers = (state = initState, actions) => {
    switch (actions.type) {
        case GET_PRODUCTS:
            console.log(actions)
            state = {
                ...state,
                products: actions.products.data
            }
            break;
        case GET_PRODUCT:
            state = {
                ...state,
                product: actions.product.datas
            }
            break;
        case GET_PRODUCT_CATEGORIES:
            state = {
                ...state,
                categories: actions.categories
            }
            break;
        case GET_SIMILAR_PRODUCTS:
            state = {
                ...state,
                similarProduct: actions.product.data
            }
        default:
            break;
    }

    return state;

}

export default productReducers;