import React, { Component } from 'react'
import CustomerTable from '../Table/Customer'
import { connect } from 'react-redux'
import { Tag, Space, Avatar, Popconfirm, message, Row, Button, Input, Tooltip } from 'antd';
import Highlighter from 'react-highlight-words';
import { FileAddOutlined, SearchOutlined, StopOutlined, EditOutlined } from '@ant-design/icons'
import { Controls, PlayState, Tween } from 'react-gsap';
import { UserOutlined } from '@ant-design/icons'
import global from '../../Common/global'
import moment from 'moment';
import * as userActions from '../../store/actions/userActions'


class ManageCustomer extends Component {
    state = {
        listUser: [],
        tableLoading: true,
        loadingBan: false
    }
    componentDidMount() {
        this.props.getAllUser().then((res) => {
            try {
                this.setState({
                    listUser: res,
                    tableLoading: false
                })
            } catch (error) {
                this.setState({
                    listUser: [],
                    tableLoading: false
                })
                console.log(error)
            }
        })
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
    banAccount = (id) => {
        this.setState({ loadingBan: true })
        let dataPut = {
            userId: id,
            data: {
                status: 2
            }
        }
        this.props.updateUser(dataPut)
            .then((error, res) => {
                try {
                    console.log(res)
                    this.setState({ loadingBan: false })
                    message.success('Khoá người dùng thành công!')
                    this.props.getAllUser()
                } catch (error) {
                    console.log(error)
                    this.setState({ loadingBan: false })
                    message.success('Khoá người dùng không thành công!')
                }
            })
    }
    render() {
        const columns = [
            {
                title: 'Avatar',
                dataIndex: 'avatarUrl',
                key: 'avatarUrl',
                render: url => <div><Avatar size="large" src={url} /></div>,
            },

            {
                title: 'Tên khách hàng',
                dataIndex: 'name',
                key: 'name',
                render: text => <a>{text}</a>,
                sorter: (a, b) => a.name.localeCompare(b.name),
                ...this.getColumnSearchProps('name')
            },
            {
                title: 'Tuổi',
                dataIndex: 'age',
                key: 'age',
                sorter: (a, b) => a.age - b.age
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
                ],
                onFilter: (value, record) => record.gender.indexOf(value) === 0,
                sorter: (a, b) => a.gender - b.gender
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
                sorter: (a, b) => a.email.localeCompare(b.email),
                ...this.getColumnSearchProps('email')
            },
            {
                title: 'Số điện thoại',
                dataIndex: 'phone',
                key: 'phone',
                sorter: (a, b) => a.phone.localeCompare(b.phone),
                ...this.getColumnSearchProps('phone')
            },
            {
                title: 'Address',
                dataIndex: 'address',
                key: 'address',
                sorter: (a, b) => a.address.localeCompare(b.address),
                ...this.getColumnSearchProps('address')
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
                },
                filters: [
                    {
                        text: 'Đang sử dụng',
                        value: 'Đang sử dụng',
                    },
                    {
                        text: 'Chưa cập nhật',
                        value: 'Chưa cập nhật'
                    },
                    {
                        text: 'Đã chặn',
                        value: 'Đã chặn',
                    }
                ],
                onFilter: (value, record) => record.status.indexOf(value) === 0,
            },
            {
                title: 'Action',
                key: 'action',
                render: (text, record) => (
                    <Popconfirm
                        title="Bạn có chắc muốn khoá tài khoản này?"
                        onConfirm={() => this.banAccount(record.key)}
                        okText="Có"
                        cancelText="Không"

                    ><Tooltip placement="top" title='Khoá tài khoản!'>
                            <Button type="primary" shape="circle" danger loading={this.props.loadingBan}>
                                <StopOutlined />
                            </Button>
                        </Tooltip>

                    </Popconfirm>
                ),
            },
        ];
        console.log(this.props)
        let data = global.mapUserToTable(this.props.user.users.length > 0 ? this.props.user.users : [])
        return (
            <Tween from={{ x: '-500px' }} to={{ x: '0px' }} duration={0.5} ease="back.out(1)">
                <div>
                    <CustomerTable loading={this.state.tableLoading} columns={columns} data={data} />
                </div>
            </Tween>
        )
    }
}
const mapDispatchToProps = dispatch => {
    return {
        getAllUser: () => dispatch(userActions.getAllUser()),
        updateUser: (dataPut) => dispatch(userActions.updateUser(dataPut))
    }
}
const mapStateToProps = state => {
    return {
        user: state.users
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageCustomer);