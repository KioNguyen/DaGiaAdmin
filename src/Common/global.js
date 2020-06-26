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