import React from 'react';
import { Line } from 'react-chartjs-2';

const data = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7'],
    datasets: [
        {
            label: 'Khách hàng',
            fill: true,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 2,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 6,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
            label: 'Sản phẩm đã xem',
            fill: true,
            lineTension: 0.1,
            backgroundColor: 'rgba(0, 132, 255, 0.4)',
            borderColor: 'rgba(0, 132, 255, 1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(0, 132, 255, 1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 2,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(0, 132, 255, 1)',
            pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
            pointHoverBorderWidth: 6,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [49, 30, 11, 20, 49, 70, 12]
        },
    ]
};
export default class CustomerChart extends React.Component {
    render() {
        return (
            <div>
                <h2>Biểu đồ Lượng truy cập</h2>
                <Line
                    data={data}
                    width={100}
                    height={30}
                />
            </div>
        );
    }
};