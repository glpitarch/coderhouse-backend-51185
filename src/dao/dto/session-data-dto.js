class GetSessionDataDto {
    constructor(sessionData){
        if (sessionData.first_name && sessionData.last_name) {
            this.fullName = sessionData.first_name + ' ' + sessionData.last_name
        } else if (!sessionData.first_name) {
            this.last_name = sessionData.last_name
        } else if (!sessionData.last) {
            this.first_name = sessionData.first_name
        }
        this.email = sessionData.email
        this.role = sessionData.role
        this.cart = sessionData.cart
    }
}

export default GetSessionDataDto