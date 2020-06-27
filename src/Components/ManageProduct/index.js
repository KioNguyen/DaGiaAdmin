import React, { Component } from 'react'
import ProductTable from '../Table/Product'
import { Tag, Space, Popconfirm, message, Row, Button, Input, Modal, Col } from 'antd';
import Highlighter from 'react-highlight-words';
import { FileAddOutlined, SearchOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Controls, PlayState, Tween } from 'react-gsap';
import * as productActions from '../../store/actions/productActions'
import { connect } from 'react-redux'
import * as global from '../../Common/global'
import AddForm from './AddForm'
import EditForm from './EditForm'
import './style.scss'

class ManageProduct extends Component {
    state = {
        searchText: '',
        searchedColumn: '',
        tableLoading: true,
        addModalVisible: false,
        editModalVisible: false,
        productEdit: {}
    };

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

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };
    getProducts = (categoryId = '', filter = null) => {
        this.props.getProducts(categoryId, filter)
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
                        products: null
                    })
                    console.log(error)
                }
            });
    }
    deleteProduct(id) {
        this.props.deleteProduct(id).then((res) => {
            try {
                message.success('Xoá sản phẩm thành công!')
            } catch (error) {
                message.error('Xoá sản phẩm không thành công!')
            }

        })
    }
    componentDidMount() {
        this.getProducts()
        this.props.getCategories()
    }
    confirm(id) {
        console.log(id);
        message.success(`Đã xoá ${id}`);
    }
    showAddModal = () => {
        this.setState({
            addModalVisible: true,
        });
    };
    showEditModal(id) {
        this.props.getSingleProduct(id).then((res) => {
            console.log(res.data.data)
            this.setState({
                editModalVisible: true,
                productEdit: res.data.data
            })
        })
    };
    cancel(id) {
        console.log(id);
        message.error('Click on No');
    }
    handleOk = e => {
        console.log(e);
        this.setState({
            addModalVisible: false,
        });
    };
    callbackVisibleAddForm = (value) => {
        this.setState({
            addModalVisible: value,
        });
    }
    callbackVisibleEditForm = (value) => {
        this.setState({
            editModalVisible: value,
        });
    }

    handleCancel = e => {
        console.log(e);
        this.setState({
            addModalVisible: false,
        });
    };

    render() {
        let datas = global.mapProductToTable(this.props.products.products ? this.props.products.products : [])
        let columns = [
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
            }, {
                title: 'Bước giá',
                dataIndex: 'priceStep',
                key: 'priceStep',
                sorter: (a, b) => a.priceStep - b.priceStep
            },
            {
                key: 'action',
                render: (text, record) => (
                    <div className='ProductAction'>
                        <Popconfirm
                            title="Bạn có chắc muốn xoá sản phẩm này?"
                            onConfirm={() => this.deleteProduct(record.key)}
                            okText="Có"
                            cancelText="Không"
                        >
                            <Button type="primary" shape="circle" danger>
                                <DeleteOutlined />
                            </Button>
                        </Popconfirm>
                        <Button type="primary" shape="circle" ghost onClick={() => this.showEditModal(record.key)}>
                            <EditOutlined />
                        </Button>
                    </div>
                ),
                align: 'center'
            },
        ];
        return (
            <Tween from={{ x: '-500px' }} to={{ x: '0px' }} duration={0.5} ease="back.out(1)">
                <div className='ProductTable'>
                    <Row justify='end' className='Feature' align='middle'>
                        <Col>
                            <Button type="primary" shape="round" icon={<FileAddOutlined />} onClick={this.showAddModal} size={'middle'}>Thêm sản phẩm</Button>
                        </Col>
                        <AddForm
                            category={this.props.products.categories}
                            addModalVisible={this.state.addModalVisible}
                            callbackVisibleAddForm={this.callbackVisibleAddForm}
                        />
                        <EditForm
                            category={this.props.products.categories}
                            editModalVisible={this.state.editModalVisible}
                            callbackVisibleEditForm={this.callbackVisibleEditForm}
                            productEdit={this.state.productEdit}
                        />
                    </Row>
                    <ProductTable loading={this.state.tableLoading} columns={columns} data={datas} />
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
        getSingleProduct: (id) => dispatch(productActions.getSingleProduct(id))
    }
}
const mapStateToProps = state => {
    return {
        products: state.products,
        categories: state.categories
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageProduct);