exports.mapProductToTable = (data, field) => {
    return data.reduce((res, ele) => {
        let obj = {
            name: ele.name,
            image: ele.images !== [] ? ele.images[0] ? ele.images[0] : 'https://storage.googleapis.com/dagia-system.appspot.com/_1589217276500_sample3.jpg'
                : 'https://storage.googleapis.com/dagia-system.appspot.com/_1589217276500_sample3.jpg',
            key: ele._id,
            name: ele.name,
            seller: 'Nguyễn Bá Test',
            currentPrice: ele.auction ? ele.auction.currentPrice : 1000000,
            priceStep: ele.auction ? ele.auction.priceStep : 1000,
            status: ele.status === -1 ? 'Đã xoá' : ele.status === 0 ? 'Chờ duyệt' : ele.status === 1 ? 'Đang đấu giá' : 'Đã kết thúc'
        }
        return res = [...res, obj]
    }, [])
}
exports.mapUserToTable = (data, field) => {
    return data.reduce((res, ele) => {
        let obj = {
            key: ele._id,
            name: ele.name,
            age: calculate_age(ele.dateOfBirth),
            gender: ele.gender === 'M' ? 'Nam' : 'Nữ',
            address: 'New York No. 1 Lake Park',
            status: ele.status === 0 || ele.status === 3 ? 'Chưa cập nhật' : ele.status === 1 ? 'Đang sử dụng' : 'Đã chặn',
            avatarUrl: 'https://storage.googleapis.com/dagia-system.appspot.com/_1593106817010__MG_9157.jpg',
            phone: ele.phone ? ele.phone : '-',
            email: ele.email ? ele.email : '-'
        }
        return res = [...res, obj]
    }, [])
}
function calculate_age(birthDay) {
    let nowYear = new Date();
    let birthYear = new Date(birthDay);
    return nowYear.getFullYear() - birthYear.getFullYear()
}

