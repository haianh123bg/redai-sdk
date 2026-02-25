/**
 * Chuỗi ngày định dạng YYYY-MM-DD.
 */
export type YmdString = string & { readonly __format: "Y-m-d" };

/**
 * Chuỗi ngày giờ định dạng YYYY-MM-DD HH:mm:ss.
 */
export type YmdHmsString = string & { readonly __format: "Y-m-d H:i:s" };
