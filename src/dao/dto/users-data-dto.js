class GetUserDataDto {
    constructor(userData){
        if (userData.first_name && userData.last_name) {
            this.fullName = userData.first_name + ' ' + userData.last_name
        } else if (!userData.first_name) {
            this.last_name = userData.last_name
        } else if (!userData.last_name) {
            this.first_name = userData.first_name
        }
        this.email = userData.email
        this.role = userData.role
    }
}

export default GetUserDataDto