const { UserRoles, StatusType } = require("../config/constants.config");
const bcrypt = require("bcryptjs");
const UserModel = require("../modules/user/user.model");
require("../config/db.config")
const adminUsers =[

    {
        name: "Jyoti",
        email:"jyoti@gmail.com",
        password:bcrypt.hashSync("Admin123", 10),
        role: UserRoles.ADMIN,
        status: StatusType.ACTIVE
    }
]

const seedUser = () => {
    try{
        adminUsers.map(async (user) => {
            const userExisting = await UserModel.findOne({
                email: user.email
            })
            if(!userExisting){
                const userObj = new UserModel(user);
                await userObj.save()
            }
        })
        process.exit(1)
    }catch(exception){
        console.log(exception)
    }
}

seedUser()