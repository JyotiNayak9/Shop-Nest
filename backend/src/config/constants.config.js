const fileFilterType = {
    IMAGE : 'image',
    AUDIO : 'audio',
    DOC : 'doc',
    VIDEO : 'video'
}
const UserRoles  = {
    ADMIN : "admin",
    CUSTOMER: "customer",
    SELLER: "seller"
}
const StatusType = {
    ACTIVE: "active",
    INACTIVE: "inactive"
}
const ProductStatus = {
    AVAIL: "available",
    UNAVAIL: "unavailable",
    OUT_OF_STOCK: "out_of_stock"
}
const ProductApprovalStatus = {
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected"
}
module.exports = {
    fileFilterType,
    UserRoles,
    StatusType,
    ProductStatus,
    ProductApprovalStatus
}