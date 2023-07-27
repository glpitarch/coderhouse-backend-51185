import GetUserDataDto from './../dto/users-data-dto.js'

export class UsersRepository {
    constructor(usersDao){
        this.usersDao = usersDao;
    }

    async getUsers(){
        try {
            const users = await this.usersDao.getUsers()
            let dtoUsers = []
            users.forEach(user => {
                const dtoUser = new GetUserDataDto(user)
                dtoUsers.push(dtoUser)
            })
            return dtoUsers
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async getUserById(uid) {
        try {
            const user = await this.usersDao.getUserById(uid)
            return user
        } catch (error) {
            throw new Error(error.message)
        }
    }
    
    async changeUserRole(uid){
        try {
            const user = await this.getUserById(uid)
            const userRole = user.role
            const updatedUser = await this.usersDao.changeUserRole(uid, userRole)
            return updatedUser
        } catch (error) {
            throw new Error(error.message)
        }
    }
}