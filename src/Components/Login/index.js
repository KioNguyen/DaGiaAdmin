import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import './style.scss';
import MobileTypeInput from '../../Components/UI/MobileTypeInput';
import SubmitGradientButton from '../../Components/UI/SubmitGradientButton';
import Error from '../../Components/Error';

import * as authActions from '../../store/actions/authActions';
import { connect } from 'react-redux';
import { Row, Col, Spin, Alert } from 'antd';


class Login extends Component {

    state = {
        redirectToReferrer: false,
        userName: '',
        password: '',
        isError: false,
        errorMessage: '',
        loading: false
    }

    textHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    setError = (error, message) => {
        this.setState({
            error: error,
            errorMessage: message
        })
    }

    loginHandler = (e) => {
        this.setState({ loading: true })
        e.preventDefault();

        if (this.state.userName === '') {
            this.setError(true, 'Vui lòng nhập số điện thoại hoặc email!'); return;
        }

        const emailPattern = new RegExp(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);
        const vnf_regex = new RegExp(/((09|03|07|08|05)+([0-9]{8})\b)/g)
        const number_regex = new RegExp(/^[0-9]*$/gm)
        if (!emailPattern.test(this.state.userName) && !number_regex.test(this.state.userName)) {
            this.setError(true, 'Không đúng định dạng email!'); return;
        }
        if (!vnf_regex.test(this.state.userName) && number_regex.test(this.state.userName)) {
            this.setError(true, 'Không đúng định dạng số điện thoại!'); return;
        }

        if (this.state.password === '') {
            this.setError(true, 'Vui lòng nhập mật khẩu!'); return;
        }

        this.props.authenticate(this.state.userName, this.state.password)
            .then(response => {
                this.setState({ loading: false })
                console.log(response);
                if (response.data) {
                    this.setState({
                        redirectToReferrer: true
                    });
                } else {
                    this.setError(true, response.message);
                }
            })
            .catch(error => {
                this.setState({ loading: false })
                console.log(error)
                this.setError(error, error.message)
            })
    }
    componentDidMount() {
        if (!this.props.auth.isAuthenticated) {
            this.props.getToken()
                .then(result => {
                    // result will be either true or false
                    if (result) {
                        this.setState({
                            redirectToReferrer: true
                        });
                    }
                })
                .catch(er => {
                    console.log(er);
                });
        }
    }
    render() {
        const responseGoogle = (response) => {
            console.log(response);
        }
        if (this.state.redirectToReferrer) {
            return <Redirect to="/" />
        }
        return (
            <Spin size="large" tip='Đang xử lý...' spinning={this.state.loading}>

                <Row align='middle' justify='center' className='LoginAllWrapper'>
                    <Col className='LoginContainer'>
                        <div className="LogoLogin">
                            <Link to="/">
                                <img src={process.env.PUBLIC_URL + '/logo192px.png'} alt="Logo" className="Logo" />
                                <br />
                                <img src={process.env.PUBLIC_URL + '/Logo.png'} alt="Logo" className="Logo" />
                            </Link>
                        </div>
                        <div className="WelcomeText">
                            <h3>ĐĂNG NHẬP</h3>
                        </div>
                        <div className="LoginWrapper">
                            <p></p>
                            <form onSubmit={this.loginHandler} autoComplete="on">

                                <MobileTypeInput
                                    type="text"
                                    placeholder="Số điện thoại hoặc Email"
                                    value={this.state.userName}
                                    textHandler={this.textHandler}
                                    name="userName"
                                />
                                <MobileTypeInput
                                    type="password"
                                    placeholder="Mật khẩu"
                                    value={this.state.password}
                                    textHandler={this.textHandler}
                                    name="password"
                                />
                                <Error>
                                    {this.state.errorMessage}
                                </Error>
                                <SubmitGradientButton
                                    label="Đăng nhập"
                                    style={{ marginTop: '30px' }}
                                />
                            </form>

                        </div>
                    </Col>
                </Row>
            </Spin>
        );

    }
}

const mapDispatchToProps = dispatch => {
    return {
        authenticate: (email, password) => dispatch(authActions.authenticate(email, password)),
        getToken: () => dispatch(authActions.getToken()),
        authenticateSocial: (userInfor) => dispatch(authActions.authenticateSocial(userInfor))
    }
}
const mapStateToProps = state => {
    return {
        auth: state.auth
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);