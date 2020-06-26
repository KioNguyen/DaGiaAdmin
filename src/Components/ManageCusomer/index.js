import React, { Component } from 'react'
import CustomerTable from '../Table/Customer'
import { Tag, Space, Avatar } from 'antd';
import { Controls, PlayState, Tween } from 'react-gsap';
import { UserOutlined } from '@ant-design/icons'
import global from '../../Common/global'
const columns = [
    {
        title: 'Avatar',
        dataIndex: 'avatar',
        key: 'avatar',
        render: url => <div><Avatar size="large" icon={<UserOutlined />} /></div>,
    },

    {
        title: 'Tên khách hàng',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>,
    },
    {
        title: 'Tuổi',
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
class ManageCustomer extends Component {

    render() {
        // let data = global.mapProductToTable()
        console.log(this.props.products)
        return (
            <Tween from={{ x: '-500px' }} to={{ x: '0px' }} duration={0.5} ease="back.out(1)">
                <div>
                    <CustomerTable columns={columns} data={data} />
                </div>
            </Tween>
        )
    }
}
export default ManageCustomer