export const MessageConstants = {
    TOKEN_EXPIRED: "Token expired"
}

export const UserRoles = {
    ADMIN : "admin",
    CUSTOMER : "customer",
    SELLER: "seller"
}

export interface SearchParams {
    page?: number | 1;
    limit: number|10;
    search?: string | null| undefined;
    filter?: any;
    sort?: any;
}