import React from 'react'
import { Table, Tag, Space } from 'antd';



class ProductTable extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div>
                < Table columns={this.props.columns} dataSource={this.props.data} />
            </div>
        )
    }
}
export default ProductTable