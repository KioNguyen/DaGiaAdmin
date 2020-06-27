import React, { Component } from 'react'
import { connect } from 'react-redux'
import ProductChart from './Chart/Product'
import CustomerChart from './Chart/Customer'
import ProductTable from '../Table/Product'
import CustomerTable from '../Table/Customer'
import { Tag, Space, Button, Input, Avatar } from 'antd';
import { SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words';
import { Controls, PlayState, Tween } from 'react-gsap';
import * as productActions from '../../store/actions/productActions'
import * as userActions from '../../store/actions/userActions'
import * as global from '../../Common/global'

class Dashboard extends Component {
    state = {
        products: [],
        users: [],
        tableLoading: true
    }
    componentDidMount() {
        this.props.getProducts()
            .then(response => {
                try {
                    console.log(response)
                    this.setState({
                        tableLoading: false,
                        products: response.data.data
                    })
                } catch (error) {
                    this.setState({
                        tableLoading: false,
                        products: []
                    })
                    console.log(error)
                }
            });
        this.props.getAllUser()
            .then(response => {
                try {
                    console.log(response)
                    this.setState({
                        tableLoading: false,
                        users: response
                    })
                } catch (error) {
                    this.setState({
                        tableLoading: false,
                        users: []
                    })
                    console.log(error)
                }
            });
    }
    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Tìm theo ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Tìm
          </Button>
                    <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Bỏ lọc
          </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: text =>
            this.state.searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[this.state.searchText]}
                    autoEscape
                    textToHighlight={text.toString()}
                />
            ) : (
                    text
                ),
    });
    render() {
        let dataUser = global.mapUserToTable(this.state.users)
        let dataProduct = global.mapProductToTable(this.props.products.products ? this.props.products.products : [])
        let columnsProduct = [
            {
                dataIndex: 'image',
                key: 'image',
                render: url => <img src={url} />,
                align: 'center'
            },
            {
                title: 'Tên sản phẩm',
                dataIndex: 'name',
                key: 'name',
                render: text => <a>{text}</a>,
                ...this.getColumnSearchProps('name')
            },
            {
                title: 'Người bán',
                dataIndex: 'seller',
                key: 'seller',
                ...this.getColumnSearchProps('seller')
            },
            {
                title: 'Trạng thái',
                key: 'status',
                dataIndex: 'status',
                filters: [
                    {
                        text: 'Chờ duyệt',
                        value: 'Chờ duyệt',
                    },
                    {
                        text: 'Đang đấu giá',
                        value: 'Đang đấu giá',
                    },
                    {
                        text: 'Đã kết thúc',
                        value: 'Đã kết thúc',
                    }, {
                        text: 'Đã xoá',
                        value: 'Đã xoá',
                    }
                ],
                render: status => {
                    let color = status === 'Đang đấu giá' ? 'green' : status === 'Chờ duyệt' ? 'geekblue' : 'volcano'
                    return (<Tag color={color} key={status}>
                        {status.toUpperCase()}
                    </Tag>)
                },
                onFilter: (value, record) => record.status.indexOf(value) === 0,
            },
            {
                title: 'Giá hiện tại',
                dataIndex: 'currentPrice',
                key: 'currentPrice',
                sorter: (a, b) => a.currentPrice - b.currentPrice
            },
            {
                title: 'Bước giá',
                dataIndex: 'priceStep',
                key: 'priceStep',
                sorter: (a, b) => a.priceStep - b.priceStep
            },
        ];
        const columnsUser = [
            {
                title: 'Avatar',
                dataIndex: 'avatarUrl',
                key: 'avatarUrl',
                render: url => <div><Avatar size="large" src={url} /></div>,
            },
            {
                title: 'Tên khách hàng',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: 'Tuổi',
                dataIndex: 'age',
                key: 'age'
            },
            {
                title: 'Giới tính',
                dataIndex: 'gender',
                key: 'gender',
                filters: [
                    {
                        text: 'Nam',
                        value: 'Nam',
                    },
                    {
                        text: 'Nữ',
                        value: 'Nữ',
                    }
                ]
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email'
            },
            {
                title: 'Số điện thoại',
                dataIndex: 'phone',
                key: 'phone'
            },
            {
                title: 'Address',
                dataIndex: 'address',
                key: 'address'
            },
            {
                title: 'Trạng thái',
                key: 'status',
                dataIndex: 'status',
                render: status => {
                    let color = status === 'Đang sử dụng' ? 'green' : 'geekblue';
                    if (status === 'Đã chặn') {
                        color = 'volcano';
                    }
                    return (
                        <Tag color={color} key={status}>
                            {status.toUpperCase()}
                        </Tag>
                    );
                }
            }
        ]
        return (
            <Tween from={{ x: '-500px' }} to={{ x: '0px' }} duration={1} ease="back.out(0.7)">
                <ProductChart />
                <div className='ProductTable'>
                    <ProductTable columns={columnsProduct} data={dataProduct} loading={this.state.tableLoading} />
                </div>
                <CustomerChart />
                <div>
                    <CustomerTable columns={columnsUser} data={dataUser} loading={this.state.tableLoading} />
                </div>
            </Tween>
        )
    }
}
const mapDispatchToProps = dispatch => {
    return {
        deleteProduct: (id) => dispatch(productActions.deleteProduct(id)),
        getProducts: (categoryId, filter) => dispatch(productActions.getProducts(categoryId, filter)),
        getCategories: () => dispatch(productActions.getCategories()),
        getSingleProduct: (id) => dispatch(productActions.getSingleProduct(id)),
        getAllUser: () => dispatch(userActions.getAllUser())
    }
}
const mapStateToProps = state => {
    return {
        products: state.products,
        categories: state.categories,
        user: state.users
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard); 