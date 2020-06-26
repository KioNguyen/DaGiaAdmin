import React, { Component } from 'react'
import ProductChart from './Chart/Product'
import CustomerChart from './Chart/Customer'
import ProductTable from '../Table/Product'
import CustomerTable from '../Table/Customer'
import { Table, Tag, Space } from 'antd';
import { Controls, PlayState, Tween } from 'react-gsap';

const columns = [
    {
        title: 'Tên sản phẩm',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>,
    },
    {
        title: 'Hình ảnh',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: 'Tags',
        key: 'tags',
        dataIndex: 'tags',
        render: tags => (
            <>
                {tags.map(tag => {
                    let color = tag.length > 5 ? 'geekblue' : 'green';
                    if (tag === 'loser') {
                        color = 'volcano';
                    }
                    return (
                        <Tag color={color} key={tag}>
                            {tag.toUpperCase()}
                        </Tag>
                    );
                })}
            </>
        ),
    },
    {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
            <Space size="middle">
                <a>Invite {record.name}</a>
                <a>Delete</a>
            </Space>
        ),
    },
];

const data = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
    },
];
class Dashboard extends Component {
    render() {
        return (
            <Tween from={{ x: '-500px' }} to={{ x: '0px' }} duration={1} ease="back.out(0.7)">
                <ProductChart />
                <ProductTable columns={columns} data={data} />
                <CustomerChart />
                <CustomerTable />
            </Tween>
        )
    }
}
export default Dashboard