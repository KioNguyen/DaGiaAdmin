import { domain, product_router, category_router } from "../../constants";
import axios from 'axios'

export const GET_PRODUCTS = 'GET_PRODUCTS';
export const GET_PRODUCT_CATEGORIES = 'GET_PRODUCT_CATEGORIES';
export const GET_PRODUCT = 'GET_PRODUCT';
export const GET_SIMILAR_PRODUCTS = 'GET_SIMILAR_PRODUCTS'
const tempToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWRmMzViNjdjY2UyMzQzODQwYzZkOGQiLCJyb2xlIjoiQ1VTVE9NRVIiLCJpYXQiOjE1OTE3MTExOTR9.zgLnsx8m_tDFp-eAXM11E46ka1OzPUULcKfAw6xG65w'
export const getProducts = (categorySlug = '', filter) => {
    return async dispatch => {

        try {
            categorySlug = (categorySlug === 'all') ? '' : categorySlug;
            let response = await axios({
                method: 'get',
                url: `${domain}/${product_router}?categoryId=${categorySlug}`,
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(function (res) {
                return res;
            })
                .catch(function (error) {
                    console.log(error);
                });
            const jsonResponse = await response;
            if (jsonResponse.status === 200) {
                dispatch({
                    type: GET_PRODUCTS,
                    products: jsonResponse.data
                });
            }
            return jsonResponse;
        } catch (error) {
            console.log(error);
        }
    }
}

export const getCategories = () => {
    return dispatch => {
        fetch(`${domain}/${category_router}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(jsonResponse => {
                dispatch({
                    type: GET_PRODUCT_CATEGORIES,
                    categories: jsonResponse.data
                });
            })
            .catch(error => {
                console.log(error);
            });
    }
}

export const getSingleProduct = (productId) => {
    return async dispatch => {
        try {
            let response = await axios({
                method: 'get',
                url: `${domain}/${product_router}/${productId}`,
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(function (res) {
                return res;
            })
                .catch(function (error) {
                    console.log(error);
                });
            const jsonResponse = await response;
            if (jsonResponse.status === 200) {
                dispatch({
                    type: GET_PRODUCT,
                    product: jsonResponse.data
                });
            }
            return jsonResponse;
        } catch (error) {
            console.log(error);
        }
    }
}

export const createProduct = (dataPost) => {
    return async dispatch => {
        try {
            let response = await axios({
                method: 'post',
                url: `${domain}/${product_router}`,
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': tempToken
                },
                data: dataPost
            }).then(function (res) {
                console.log(res)
                return res;
            })
                .catch(function (error) {
                    console.log(error);
                });
            const jsonResponse = await response;
            // if (jsonResponse.status === 200) {
            //     dispatch({
            //         type: GET_PRODUCT,
            //         product: jsonResponse.data
            //     });
            // }
            return jsonResponse;
        } catch (error) {
            console.log(error);
        }
    }
}

export const deleteProduct = (id, mode) => {
    return async dispatch => {
        let data = { mode: mode ? true : false }
        try {
            let response = await axios({
                method: 'delete',
                url: `${domain}/${product_router}/${id}`,
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': tempToken
                },
                data: data
            }).then(function (res) {
                console.log(res);
                dispatch(getProducts());
                getProducts();
                getCategories();
                return res;
            })
                .catch(function (error) {
                    console.log(error);
                });
            const jsonResponse = await response;
            // if (jsonResponse.status === 200) {
            //     dispatch({
            //         type: GET_PRODUCT,
            //         product: jsonResponse.data
            //     });
            // }
            return jsonResponse;
        } catch (error) {
            console.log(error);
        }
    }
}