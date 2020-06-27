import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux'
import { Layout, Menu, Typography, Button, Tooltip } from 'antd';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Dashboard from '../Dashboard'
import ManageCustomer from '../ManageCusomer'
import ManageProduct from '../ManageProduct'
import * as AuthAction from '../../store/actions/authActions'
import {
    ShopOutlined,
    TeamOutlined,
    SoundOutlined,
    DollarCircleOutlined,
    PartitionOutlined,
    InboxOutlined,
    PieChartOutlined,
    DeleteOutlined,
    PoweroffOutlined
} from '@ant-design/icons';
import './style.scss'
const { Title } = Typography
const { Header, Content, Footer, Sider } = Layout;

class Main extends Component {
    state = {
        collapsed: false,
        isAuth: true
    }
    headerTitle = [
        {
            key: 1,
            name: 'DASHBOARD',
            path: '/'
        },
        {
            key: 1,
            name: 'DASHBOARD',
            path: '/dashboard'
        },
        {
            key: 2,
            name: 'QUẢN LÝ KHÁCH HÀNG',
            path: '/manage/customer'
        },
        {
            key: 3,
            name: 'QUẢN LÝ SẢN PHẨM',
            path: '/manage/product'
        },
        {
            key: 4,
            name: 'QUẢN LÝ DANH MỤC',
            path: '/manage/category'
        },
        {
            key: 5,
            name: 'QUẢN LÝ THANH TOÁN',
            path: '/manage/payment'
        },
        {
            key: 6,
            name: 'QUẢN LÝ THÔNG BÁO',
            path: '/dashboard'
        },

    ]
    componentDidMount() {
        setTimeout(() => {
            this.setState({
                collapsed: true
            })
        }, 2000);
    }
    handleLogout() {
        this.setState({ isAuth: false })
        this.props.logout()
    }
    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
    };
    render() {
        if (this.state.isAuth === false) {
            return <Redirect to='/login' />
        }
        let title = this.headerTitle.find(ele => ele.path === window.location.pathname)
        console.log(title)
        return (
            <Layout>
                <Sider
                    collapsible
                    collapsed={this.state.collapsed}
                    onCollapse={this.onCollapse}
                >
                    <div className="logo" >
                        <Link to='/'>
                            <img src={process.env.PUBLIC_URL + '/logo192px.png'} alt="Logo" className="LogoNav" />
                            <img src={process.env.PUBLIC_URL + '/Logo.png'} alt="Logo" className="SloganNav" hidden={this.state.collapsed} />
                        </Link>
                    </div>
                    <Menu theme="dark" mode="inline" selectedKeys={title.key.toString()}>
                        <Menu.Item key="1" icon={<PieChartOutlined />}>
                            <Link to={`/dashboard`}>Dashboard</Link>
                        </Menu.Item>
                        <Menu.Item key="2" icon={<TeamOutlined />}>
                            <Link to={`/manage/customer`}>Quản lý Khách hàng</Link>
                        </Menu.Item>
                        <Menu.Item key="3" icon={<InboxOutlined />}>
                            <Link to={`/manage/product`}>Quản lý Sản phẩm</Link>
                        </Menu.Item>
                        <Menu.Item key="4" icon={<PartitionOutlined />}>
                            Quản lý Danh mục
                        </Menu.Item>
                        <Menu.Item key="5" icon={<DollarCircleOutlined />}>
                            Quản lý Thanh toán
                        </Menu.Item>
                        <Menu.Item key="6" icon={<SoundOutlined />}>
                            Quản lý Thông báo
                        </Menu.Item>
                    </Menu>
                    <Tooltip placement="right" title='Đăng xuất!'>
                        <Button type="primary" shape="circle" danger className='LogoutButton' onClick={() => this.handleLogout()}>
                            <PoweroffOutlined />
                        </Button>
                    </Tooltip>

                </Sider>
                <Layout className="site-layout">
                    <Header className="site-layout-background Header" style={{ padding: 0 }}>
                        <Title level={4}>{title.name}</Title>
                    </Header>
                    <Content className='Container' style={{ margin: '80px 16px 0', overflow: 'initial' }}>
                        <div className="site-layout-background" style={{ padding: 24, textAlign: 'center' }}>
                            <div className="Content">
                                <Route exact path="/" component={Dashboard} />
                                <Route exact path="/dashboard" component={Dashboard} />
                                <Route exact path="/manage/customer" component={ManageCustomer} />
                                <Route exact path="/manage/product" component={ManageProduct} />
                            </div>
                        </div>
                    </Content>
                    <Footer className='Footer' style={{ textAlign: 'center' }}>DAGIA - SYSTEM ©2020 Created by Hung - Hao</Footer>
                </Layout>
            </Layout>
        )
    }
}
const mapStateToProps = state => {
    return {
        auth: state.auth
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getToken: () => dispatch(AuthAction.getToken()),
        logout: () => dispatch(AuthAction.logout())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main); 