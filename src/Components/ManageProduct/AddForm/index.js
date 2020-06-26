import React, { useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
    Form,
    Input,
    Button,
    Radio,
    Select,
    Cascader,
    DatePicker,
    InputNumber,
    TreeSelect,
    Switch,
    TimePicker
} from 'antd';
import moment from 'moment'
import * as productActions from '../../../store/actions/productActions'
import { connect } from 'react-redux'
import './style.scss'


function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
class AddForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            categoryTree: [],
            bidNow: true,
            timeStart: Date.now(),
            editorState: EditorState.createEmpty(),
            addModalVisible: props.addModalVisible,
            productName: '',
            priceStart: '',
            priceStep: 0,
            productCondition: 0,
            timeDuration: {
                day: 0,
                hour: 0,
                minute: 0,
                second: 0
            },
            previewVisible: false,
            previewImage: '',
            previewTitle: '',
            fileList: [],
            loadingButton: false
        }
    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };
    componentDidMount() {
        console.log(this.props)
        if (this.props) {
            let categoryTree = this.props.category.reduce((arr, ele) => {
                let obj = {
                    title: ele.name,
                    value: ele._id
                }
                return [...arr, obj]
            }, [])
            console.log(categoryTree)
            this.setState({ categoryTree })
        }
    }
    componentWillReceiveProps(nextProps) {
        const { addModalVisible } = this.state
        if (nextProps.addModalVisible !== addModalVisible) {
            this.setState({ addModalVisible: nextProps.addModalVisible })
        }
        if (this.props.category) {
            let categoryTree = this.props.category.reduce((arr, ele) => {
                let obj = {
                    title: ele.name,
                    value: ele._id
                }
                return [...arr, obj]
            }, [])
            console.log(categoryTree)
            this.setState({ categoryTree })
        }
    }
    onChangeBidNow(bidNow) {
        this.setState({
            bidNow
        })
    }
    handleTimeStart(value, type) {
        let { timeDuration } = this.state
        switch (type) {
            case 'DAY': {
                timeDuration.day = value
            }
                break;
            case 'HOUR': {
                timeDuration.hour = value
            }
                break;
            case 'MINU': {
                timeDuration.minute = value
            }
                break;
            case 'SECO': {
                timeDuration.second = value
            }
                break;
        }
        let timeStart = (timeDuration.day * 24 * 60 * 60 +
            timeDuration.hour * 60 * 60 +
            timeDuration.minute * 60 + timeDuration.second) * 1000
        this.setState({
            timeDuration,
            timeStart
        })
        console.log(timeDuration, timeStart)
        const days = Math.floor(timeStart / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeStart % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeStart % (1000 * 60)) / 1000);
        console.log(`${days > 0 ? days + ' ngày,' : ''} ${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`)
    }
    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    handleChange = ({ fileList }) => this.setState({ fileList });
    handleChangeText(value, type) {
        this.setState({
            [type]: value
        })
    }
    showModal = () => {
        this.setState({
            addModalVisible: true,
        });
    };
    handleCancelModal = e => {
        console.log(e);
        this.setState({
            addModalVisible: false,
        });
        this.props.callbackVisibleAddForm(false)
    };
    handleOpenModal = e => {
        console.log(e);
        this.setState({
            addModalVisible: true,
        });
    };

    createProduct = e => {
        this.setState({ loadingButton: true })
        const { productName,
            priceStart,
            priceStep,
            productCondition,
            productCategory,
            editorState, timeStart, bidNow, fileList } = this.state
        const imgArr = fileList.map((ele) => { return ele.response.data.url })
        const dataPost = {
            name: productName,
            condition: productCondition,
            category: productCategory,
            description: draftToHtml(convertToRaw(editorState.getCurrentContent())),
            status: bidNow ? 1 : 0,
            images: imgArr,
            auction: {
                startPrice: priceStart,
                currentPrice: priceStart,
                priceStep: priceStep,
                timeDuration: timeStart
            }
        }
        this.props.createProduct(dataPost).then((res) => {
            this.setState({ loadingButton: false })
            if (res.data.code === 0) {
                Modal.destroyAll();
                message.success('Thêm sản phẩm thành công!')
                this.props.getProducts();
                this.props.getCategories()
                this.handleCancelModal()
            }
            else {
                Modal.destroyAll();
                message.error('Thêm sản phẩm không thành công!')
            }
        })
    };
    render() {
        // console.log(this.state.f)
        const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div className="ant-upload-text">Tải lên</div>
            </div>
        );
        return (
            <Modal
                title="Thêm sản phẩm mới"
                visible={this.state.addModalVisible}
                onOk={this.handleOk}
                onCancel={this.handleCancelModal}
                destroyOnClose={true}
                width='55%'
                footer={[
                    <Button key="back" onClick={this.handleCancelModal} className='CloseModalButton'>
                        Đóng
                    </Button>
                ]}
            >
                <Form
                    labelCol={{
                        span: 6,
                    }}
                    wrapperCol={{
                        span: 20,
                    }}
                    layout="horizontal"
                    initialValues={{
                        size: 'middle',
                    }}
                    onValuesChange={console.log('Changed!')}
                    size={'middle'}
                    onFinish={this.createProduct}
                >
                    <Form.Item label="Tên sản phẩm"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập tên!'
                            }
                        ]}>
                        <Input
                            placeholder='Điền tên sản phẩm'
                            onChange={e => this.handleChangeText(e.target.value, 'productName')}
                        />
                    </Form.Item>
                    <Form.Item label="Tình trạng">
                        <InputNumber
                            min={0}
                            max={100}
                            formatter={value => `${value}%`}
                            parser={value => value.replace('%', '')}
                            onChange={value => this.handleChangeText(value, 'productCondition')}
                        />
                    </Form.Item>
                    <Form.Item label="Danh mục"
                        name='category'
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn danh mục!'
                            }
                        ]}>
                        <TreeSelect
                            placeholder="Chọn danh mục sản phẩm"
                            treeData={this.state.categoryTree}
                            onChange={value => this.setState({ productCategory: value })}
                        />
                    </Form.Item>
                    {/* <Form.Item label="Cascader">
                        <Cascader
                            options={[
                                {
                                    value: 'zhejiang',
                                    label: 'Zhejiang',
                                    children: [
                                        {
                                            value: 'hangzhou',
                                            label: 'Hangzhou',
                                        },
                                    ],
                                },
                            ]}
                        />
                    </Form.Item> */}
                    <Form.Item label="Giá khởi điểm"
                        name='startPrice'
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập giá khởi điểm!'
                            }
                        ]}>
                        <InputNumber
                            className='InputPriceStart'
                            defaultValue={1000}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            step={1000}
                            onChange={value => this.handleChangeText(value, 'priceStart')}
                        />
                    </Form.Item>
                    <Form.Item label="Bước giá"
                        name='priceStep'
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập bước giá!'
                            }
                        ]}>
                        <InputNumber
                            className='InputPriceStep'
                            defaultValue={1000}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            step={1000}
                            onChange={value => this.handleChangeText(value, 'priceStep')}
                        />
                    </Form.Item>
                    {/* <Form.Item label="Thời gian bắt đầu">
                        <DatePicker
                            defaultValue={moment()}
                            format='DD/MM/YYYY'
                            disabled={!this.state.bidNow}
                            onChange={M => this.handleTimeStart(M, 'DATE')}
                        />
                        <TimePicker
                            defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
                            disabled={!this.state.bidNow}
                            onChange={M => this.handleTimeStart(M, 'TIME')}
                        />
                    </Form.Item> */}
                    <Form.Item label="Thời gian đấu giá"
                        name='timeDuration'
                        rules={[
                            {
                                types: 'number',
                                min: 1,
                                message: 'Vui lòng chọn thời gian đấu giá!'
                            }
                        ]}>
                        <InputNumber
                            className='InputTimeStart'
                            min={0}
                            defaultValue={0}
                            formatter={value => `${value} Ngày`}
                            parser={value => value.replace(' Ngày', '')}
                            onChange={value => this.handleTimeStart(value, 'DAY')}
                        />
                        <InputNumber
                            className='InputTimeStart'
                            defaultValue={0}
                            min={0}
                            max={23}
                            formatter={value => `${value} Giờ`}
                            parser={value => value.replace(' Giờ', '')}
                            onChange={value => this.handleTimeStart(value, 'HOUR')}
                        />
                        <InputNumber
                            className='InputTimeStart'
                            defaultValue={0}
                            min={0}
                            max={59}
                            formatter={value => `${value} Phút`}
                            parser={value => value.replace(' Phút', '')}
                            onChange={value => this.handleTimeStart(value, 'MINU')}
                        />
                        <InputNumber
                            className='InputTimeStart'
                            defaultValue={0}
                            min={0}
                            max={59}
                            formatter={value => `${value} Giây`}
                            parser={value => value.replace(' Giây', '')}
                            onChange={value => this.handleTimeStart(value, 'SECO')}
                        />
                    </Form.Item>
                    <Form.Item label="Đấu giá ngay">
                        <Switch defaultChecked={this.state.bidNow} onChange={checked => this.onChangeBidNow(checked)} />
                    </Form.Item>
                    <Form.Item label="Thông tin sản phẩm"
                        name='description'
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập thông tin sản phẩm!'
                            }
                        ]}>
                        <Editor
                            editorState={this.state.editorState}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editorClassName"
                            onEditorStateChange={this.onEditorStateChange}
                        />
                    </Form.Item>
                    <Form.Item label="Ảnh sản phẩm">
                        <div className="clearfix">
                            <Upload
                                action="http://localhost:3000/api/image/upload"
                                listType="picture-card"
                                fileList={fileList}
                                onPreview={this.handlePreview}
                                onChange={this.handleChange}
                            >
                                {fileList.length >= 8 ? null : uploadButton}
                            </Upload>
                            <Modal
                                visible={previewVisible}
                                title={previewTitle}
                                footer={null}
                                onCancel={this.handleCancel}
                            >
                                <img alt="example" style={{ width: '100%' }} src={previewImage} />
                            </Modal>
                        </div>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={this.state.loadingButton} className='SubmitButton'>
                            Xác nhận
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
};

const mapDispatchToProps = dispatch => {
    return {
        createProduct: (data) => dispatch(productActions.createProduct(data)),
        getProducts: (categoryId, filter) => dispatch(productActions.getProducts(categoryId, filter)),
        getCategories: () => dispatch(productActions.getCategories())
    }
}
const mapStateToProps = state => {
    return {
        products: state.products,
        categories: state.categories
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddForm);