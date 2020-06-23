import React, { Component } from 'react'
import ProductChart from './Chart/Product'
import CustomerChart from './Chart/Customer'


class Dashboard extends Component {
    render() {
        return (
            <div>
                <ProductChart />
                <CustomerChart />
            </div>
        )
    }
}
export default Dashboard