export const productQueryErrorInfo = (query) => {
    return `
    The following queries should be:
    page: must be a positive NUMBER but less than 3, but received: ${query.page}
    sort: must be a STRING of "asc" or "desc" value, but received: ${query.sort}
    limit: must be a positive NUMBER, but received: ${query.limit}
    `
}