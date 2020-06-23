import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const data = {
    labels: [
        'Sản phẩm mới',
        'Sản phẩm đã bán',
        'Sản phẩm đang đấu giá'
    ],
    datasets: [{
        data: [300, 50, 100],
        backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
        ],
        hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#ffc024'
        ]
    }]
};

export default class ProductChart extends React.Component {
    render() {
        return (
            <div>
                <h2>Biểu đồ sản phẩm</h2>
                <Doughnut
                    data={data}
                    width={100}
                    height={40}
                />
            </div>
        );
    }
};