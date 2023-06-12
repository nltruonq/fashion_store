export const convertOrderStatus = (status) => {
    switch (status) {
        case "PENDING":
            return "Đã đặt hàng";
        case "CONFIRMED":
            return "Đã xác nhận";
        case "PROCESSING":
            return "Đang xử lý";
        case "DELIVERING":
            return "Đang vận chuyển";
        case "COMPLETED":
            return "Đã hoàn tất";
        case "CANCEL":
            return "Hủy đơn hàng";
        default:
            return "Đang xử lý";
    }
};
