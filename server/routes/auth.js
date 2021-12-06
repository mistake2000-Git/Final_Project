const express = require('express')
const router = express.Router();
const argon2 = require('argon2')
const user = require('../model/user')
const jwt = require('jsonwebtoken')
require('dotenv').config() 

/*Initial admin
const createadmin = async ()=>{
        const adpassword = "password"
        const adminpassword = await argon2.hash(adpassword)
        const useradmin = new user({
        id:"AD_01",
        Type:"Admin",
        Name:"Tan Loc",
        Phone:"0344254080",
        Email:"tanloc1611@gmail.com",
        Account:"admin",
        Password:adminpassword
    })
    useradmin.save()
}
createadmin()*/

router.post('/login',async (req,res)=>{
    const {Account,Password}= req.body
    if(!Account||!Password)
    {
        return res.status(400).json({success:false,message:"Missing user name or password"})
    }
    try
    {
        const User = await user.findOne({Account})
        if(!User)
        {
            return res.status(400).json({success:false,message:'Incorrect user name or password'})
        }
        const passwordValid = await argon2.verify(User.Password,Password)
        if(!passwordValid)
        {
            return res.status(400).json({success:false,message:'Incorrect user name or password'})
        }
        const accessToken = jwt.sign({id:User._id,},process.env.ACCESS_TOKEN_SECRET)
        res.json(
            {
                success:true,
                message:'User login successfully',
                accessToken,
                UserType:User.Type,
                UserName:User.Name
            }
        )
    }
    catch(error) {
        console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

module.exports= router



/**
 * @api {post} /api/auth/login Login into system
 * @apiDescription This api will login into system and return access token
 * @apiName Login
 * @apiGroup Auth
 *
 * @apiSuccess {Boolean} success The status of the login.
 * @apiSuccess {String} message Message for login successfully or false.
 * @apiSuccess {String} accessToken The access token of the user.
 * @apiSuccess {String} UserType Type of user(admin or employee).
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *    [
        {
            "success": true,
            "message": "User login successfully",
            "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYTNjODQ4N2RhMjQ1ZjlhZjg1NmQ1OSIsImlhdCI6MTYzODcxMjc1MX0.bfY8VxApHdjCJL-BW_3rtZAcGy04aF1EucEOQ4w-ZHs",
            "UserType": "Admin"
        }
      ]
 * @apiError (400) {Object} UserNotFound Incorrect user name or password
 * @apiErrorExample {json} Error-Response:
 *      HTTP/1.1 400 Bad Request 
 *        {
            "success": false,
            "message": "Incorrect user name or password"
          }
 * @apiBody {string} [Account=admin] Account of the User
 * @apiBody {string} [Password=admin] Password of the User
 * @apiSampleRequest https://backend-apidoc.herokuapp.com/api/auth/login
 * 
 */


      /**
 * @api {get} /api/manage/getone/:id Request query specific user profile
 * @apiDescription This api will return a user profile with id input in!
 * @apiName GetSpecificUser
 * @apiGroup Manage
 *
 * @apiSuccess {String} ID Id of the user.
 * @apiSuccess {String} Type Type of the user.
 * @apiSuccess {String} Img Image profile of the user.
 * @apiSuccess {String} Name The user name.
 * @apiSuccess {String} Phone The user phone number.
 * @apiSuccess {String} Gender Gender of the user.
 * @apiSuccess {String} Email Email of the user.
 * @apiSuccess {String} Date_of_Birth The date of birth of the user.
 * @apiSuccess {String} Address The address of the user.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *    [
          {
                "id": "AD_01",
                "Type": "Admin",
                "Img" : "asdhlqkwjhelkajsbflkj",
                "Name": "min",
                "Phone": "0969066865",
                "Gender": "Male",
                "Email": "admin.email@gmail.com",
                "Date_of_Birth": "2000-01-03",
                "Address": "HCM City",
            }
      ]
 * @apiError (400) {object} UserNotFound Can not find the user!
 * @apiErrorExample {json} Error-Response:
 *    HTTP/1.1 400 Bad Request 
 *        {
            "success": false,
            "message": "Can not find user or internal error!"
          }
 * @apiQuery {string} [id] The id of the specific user
 * @apiHeader {String} Authorization=Bearer Users unique access-key.
 * @apiSampleRequest https://backend-apidoc.herokuapp.com/api/manage/getone/:id
 */


/**
 * @api {get} /api/manage/getprofile Get profile of the user logged in
 * @apiDescription This api will return profile of the user who logged in!
 * @apiName GetProfile
 * @apiGroup Manage
 *
 * @apiSuccess {String} ID Id of the user.
 * @apiSuccess {String} Type Type of the user.
 * @apiSuccess {String} Img Image profile  of the user.
 * @apiSuccess {String} Name The user name.
 * @apiSuccess {String} Phone The user phone number.
 * @apiSuccess {String} Gender Gender of the user.
 * @apiSuccess {String} Email Email of the user.
 * @apiSuccess {String} Date_of_Birth The date of birth of the user.
 * @apiSuccess {String} Address The address of the user.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *    [
          {
                "id": "AD_01",
                "Type": "Admin",
                "Img":"asdkfhpoqwkheqeugali",
                "Name": "min",
                "Phone": "0969066865",
                "Gender": "Male",
                "Email": "admin.email@gmail.com",
                "Date_of_Birth": "2000-01-03",
                "Address": "HCM City",
            }
      ]
 * @apiError (400) UserNotFound Can not found the user or internal error!
 * @apiErrorExample {object} Error-Response:
 *      HTTP/1.1 400 Bad Request 
 *        {
            "success": false,
            "message": "Can not find user or internal error!"
          }
 * @apiHeader {String} Authorization=Bearer Users unique access-key.
 * @apiSampleRequest  https://backend-apidoc.herokuapp.com/api/manage/getprofile/
 */


/**
 * @api {get} /api/manage/ Get all the user 
 * @apiDescription This api return list of user in system!
 * @apiName GetAllUser
 * @apiGroup Manage
 *
 * @apiSuccess {String} ID Id of the user.
 * @apiSuccess {String} Type Type of the user.
 * @apiSuccess {String} Img Image profile  of the user.
 * @apiSuccess {String} Name The user name.
 * @apiSuccess {String} Phone The user phone number.
 * @apiSuccess {String} Gender Gender of the user.
 * @apiSuccess {String} Email Email of the user.
 * @apiSuccess {String} Date_of_Birth The date of birth of the user.
 * @apiSuccess {String} Address The address of the user.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *   [
        {
            "_id": "61a3c8487da245f9af856d59",
            "id": "AD_01",
            "Type": "Admin",
            "Name": "min",
            "Phone": "0969066865",
            "Gender": "Male",
            "Email": "admin.email@gmail.com",
            "Date_of_Birth": "2000-01-03",
            "Address": "HCM City",
            "Account": "admin",
            "Password": "$argon2i$v=19$m=4096,t=3,p=1$UEk2hMIj+Bs2VTaiTA2UGg$AOypqMMlf6/nsAe+NNop2ri7hjjgTt8uy/NgSteBKeg",
            "__v": 0
        },
        {
            "_id": "61a4b67cecc899da55839618",
            "id": "EMP_01",
            "Type": "Employee",
            "Name": "Bao Nam",
            "Phone": "0969066866",
            "Gender": "Male",
            "Email": "18521123@gm.uit.edu.vn",
            "Date_of_Birth": "",
            "Address": "HCM City",
            "Account": "employee",
            "Password": "$argon2i$v=19$m=4096,t=3,p=1$KtVe8pYGPc1B+4Zr/TfwTA$cuIIxQeg4DqGFH5jAMIumO4SgQn1XghsA8jeAzlScPI",
            "__v": 0
        }
    ]
 * @apiError (400) InternalError Internal Error!
 * @apiErrorExample {object} Error-Response:
 *     HTTP/1.1 400 Bad Request 
 *        {
            "success": false,
            "message": "Internal Error!"
          }
 * @apiHeader {String} Authorization=Bearer Users unique access-key.
 * @apiSampleRequest  https://backend-apidoc.herokuapp.com/api/manage/
 */


/**
 * @api {post} /api/manage/ Create new user.
 * @apiDescription This api will create new user into system.
 * @apiName CreateUser
 * @apiGroup Manage
 *
 * @apiSuccess {Boolean} success The status of create user fail or success.
 * @apiSuccess {String} Message Message create user successfully or error.
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *   
        {
            success:true,
            message:"Create user successfully"
        }
    
 * @apiError (400) Userexist The phone number,account of new user is exist.
 * @apiErrorExample{object} Error-Response:
 *  HTTP/1.1 400 Bad Request 
 *        { 
 *             success:false,
 *              message:"Account or phone number is exist!"
 *         }
 * @apiBody {string} [Type] Type or position of the User
 * @apiBody {string} [Img] Image profile of the User
 * @apiBody {string} [Name] Name of the User
 * @apiBody {string} [Phone] Phone of the User
 * @apiBody {string} [Gender] Gender of the User
 * @apiBody {string} [Date_of_Birth] Date of birth of the User
 * @apiBody {string} [Address] Address of the User
 * @apiBody {string} [Email] Email of the User
 * @apiBody {string} [Account] Account of the User
 * @apiBody {string} [Password] Password of the User
 * @apiHeader {String} Authorization=Bearer Users unique access-key.
 * @apiSampleRequest https://backend-apidoc.herokuapp.com/api/manage/
 */

/**
 * @api {delete} /api/manage  Delete the user.
 * @apiDescription This api will delete the user by id.
 * @apiName DeleteUser
 * @apiGroup Manage
 *
 * @apiSuccess {Boolean} success The status of delete user fail or success.
 * @apiSuccess {String} Message Message delete user successfully or error.
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *   
        {
            success:true,
            message:"User has been deleted"
        }
    
 * @apiError (400) UsernotFound Can not find the user to delete.
 * @apiErrorExample{object} Error-Response:
 *  HTTP/1.1 400 Bad Request 
 *        { 
 *             success:false,
 *             message:"Can not find the user to delete"
 *         }
 * @apiHeader {String} Authorization=Bearer Users unique access-key.
 * @apiBody {string} [Type] Type or position of the User
 * @apiBody {string} [Img] Image profile of the User
 * @apiBody {string} [Name] Name of the User
 * @apiBody {string} [Phone] Phone of the User
 * @apiBody {string} [Gender] Gender of the User
 * @apiBody {string} [Date_of_Birth] Date of birth of the User
 * @apiBody {string} [Address] Address of the User
 * @apiBody {string} [Email] Email of the User
 * @apiBody {string} [Account] Account of the User
 * @apiBody {string} [Password] Password of the User
 * @apiSampleRequest https://backend-apidoc.herokuapp.com/api/manage/
 */


/**
 * @api {patch} /api/manage/  Update user information.
 * @apiDescription This api will update user information.
 * @apiName UpdateUser
 * @apiGroup Manage
 *
 * @apiSuccess {Boolean} success The status of update user fail or success.
 * @apiSuccess {String} Message Message update user successfully or error.
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *   
        {
            success:true,
            message:"Update user infomation successfully"
        }
    
 * @apiError (400) UsernotFound Can not find the user to update.
 * @apiError (404) UsernotFound Can not find the user or id input is empty!
 * @apiErrorExample{object} Error-Response:
 *  HTTP/1.1 400 Bad Request 
 *        {
 *              success:false,
 *              message:"Can not find the user to delete"
 *         }
 * @apiErrorExample{object} Error-Response:
 *  HTTP/1.1 404 Bad Request 
 *        {
 *              success:false,
 *              message:"Can not find the user or id input is empty!"
 *         }
 * @apiHeader {String} Authorization=Bearer Users unique access-key.
 * @apiBody {string} [Type] Type or position of the User
 * @apiBody {string} [Img] Image profile of the User
 * @apiBody {string} [Name] Name of the User
 * @apiBody {string} [Phone] Phone of the User
 * @apiBody {string} [Gender] Gender of the User
 * @apiBody {string} [Date_of_Birth] Date of birth of the User
 * @apiBody {string} [Address] Address of the User
 * @apiBody {string} [Email] Email of the User
 * @apiSampleRequest https://backend-apidoc.herokuapp.com/api/manage/
 */

/**
 * @api {patch} /api/manage  Update user information.
 * @apiDescription This api will update user information.
 * @apiName UpdateUser
 * @apiGroup Manage
 *
 * @apiSuccess {Boolean} success The status of update user fail or success.
 * @apiSuccess {String} Message Message update user successfully or error.
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *   
        {
            success:true,
            message:"Update user infomation successfully"
        }
    
 * @apiError (400) UsernotFound Can not find the user to update.
 * @apiError (404) UsernotFound Can not find the user or id input is empty!
 * @apiErrorExample{object} Error-Response:
 *  HTTP/1.1 400 Bad Request 
 *        {
 *              success:false,
 *              message:"Can not find the user to delete"
 *         }
 * @apiErrorExample{object} Error-Response:
 *  HTTP/1.1 404 Bad Request 
 *        {
 *              success:false,
 *              message:"Can not find the user or id input is empty!"
 *         }
 * @apiHeader {String} Authorization=Bearer Users unique access-key.
 * @apiBody {string} [Type] Type or position of the User
 * @apiBody {string} [Img] Image profile of the User
 * @apiBody {string} [Name] Name of the User
 * @apiBody {string} [Phone] Phone of the User
 * @apiBody {string} [Gender] Gender of the User
 * @apiBody {string} [Date_of_Birth] Date of birth of the User
 * @apiBody {string} [Address] Address of the User
 * @apiBody {string} [Email] Email of the User
 * @apiSampleRequest https://backend-apidoc.herokuapp.com/api/manage/
 */

/**
 * @api {get} /api/payment/getone/:id  Get information of specific payment
 * @apiDescription This api will return a specific payment.
 * @apiName GetOnePayment
 * @apiGroup Payment
 
 * @apiSuccess {String} id Payment id.
 * @apiSuccess {Float} Customer_Id_Card Customer ID Card.
 * @apiSuccess {String} Payment_Method Payment method of transaction such as card or cash
 * @apiSuccess {String} Payment_Status The status of the payment such as paid or unpaid.
 * @apiSuccess {Float} Total Total of the payment
 * @apiSuccess {Date} Create_Date Create Date of payment.
 * @apiSuccess {Float} Surcharge The surcharge of transaction.
 * @apiSuccess {String} Create_By The id of the user create payment.
 * @apiSuccess {Date} Create_Date_Formatted Date create payment.
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
       {
            "id": "PAY_01",
            "Customer_Id_Card": "251254123",
            "Payment_method": "Cash",
            "Payment_Status": "Calculating",
            "Total": 0,
            "Create_Date": "2021-12-05T06:46:29.515Z",
            "Surcharge": 36,
            "Create_By": "AD_01",
            "Create_Date_Formatted": "12/5/2021, 6:46:29 AM"
        }
 * @apiError (400) CanNotFound Can not find the payment or internal error.
 * @apiErrorExample{object} Error-Response:
 *  HTTP/1.1 400 Bad Request 
 *        {
 *              success:false,
 *              message:"Internal Error"
 *         }
 * @apiHeader {String} Authorization=Bearer Users unique access-key.
 * @apiQuery {string} [id] The id of the specific payment
 * @apiSampleRequest https://backend-apidoc.herokuapp.com/api/payment/getone/:id
 */


/**
 * @api {get} /api/payment  Get all payment
 * @apiDescription This api will return a list of payment/.
 * @apiName GetAllPayment
 * @apiGroup Payment
 
 * @apiSuccess {String} id Payment id.
 * @apiSuccess {Float} Customer_Id_Card Customer ID Card.
 * @apiSuccess {String} Payment_Method Payment method of transaction such as card or cash
 * @apiSuccess {String} Payment_Status The status of the payment such as paid or unpaid.
 * @apiSuccess {Float} Total Total of the payment
 * @apiSuccess {Date} Create_Date Create Date of payment.
 * @apiSuccess {Float} Surcharge The surcharge of transaction.
 * @apiSuccess {String} Create_By The id of the user create payment.
 * @apiSuccess {Date} Create_Date_Formatted Date create payment.
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
       [
           {
                "id": "PAY_01",
                "Customer_Id_Card": "251254123",
                "Payment_method": "Cash",
                "Payment_Status": "Calculating",
                "Total": 0,
                "Create_Date": "2021-12-05T06:46:29.515Z",
                "Surcharge": 36,
                "Create_By": "AD_01",
                "Create_Date_Formatted": "12/5/2021, 6:46:29 AM"
             }
        ]
 * @apiError (400) CanNotFound Internal Error.
 * @apiErrorExample{object} Error-Response:
 *  HTTP/1.1 400 Bad Request 
 *        {
 *              success:false,
 *              message:"Internal Error"
 *         }
 * @apiHeader {String} Authorization=Bearer Users unique access-key.
 * @apiSampleRequest https://backend-apidoc.herokuapp.com/api/payment/
 */

/**
 * @api {get} /api/room/getone/:id  Get information of specific room
 * @apiDescription This api will return information of a specific room.
 * @apiName GetOneRoom
 * @apiGroup Room
 
 * @apiSuccess {String} id Room ID.
 * @apiSuccess {String} Room_Name Name of the room.
 * @apiSuccess {Float} Price_per_Hour Price per hour of the room.
 * @apiSuccess {Float} Price_per_Night Price per Night of the room.
 * @apiSuccess {Float} Price_per_Day Price per Day of the room.
 * @apiSuccess {String} Status Status of the room.
 * @apiSuccess {String} Create_By The id of user create the room.
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
       {
            "id": "A101",
            "Room_Name": "High Top Delux",
            "Price_per_Hour": 20,
            "Price_per_Night": 60,
            "Price_per_Day": 120,
            "Status": "Unbooked",
            "Create_By": "AD_01",
        }
 * @apiError (400) CanNotFound Can not find the payment or internal error.
 * @apiErrorExample{object} Error-Response:
 *  HTTP/1.1 400 Bad Request 
 *        {
 *             success:false,
 *             message:"Room not found or Internal Error!"
 *         }
 * @apiHeader {String} Authorization=Bearer Users unique access-key.
 * @apiQuery {string} [id] The id of the specific room
 * @apiSampleRequest https://backend-apidoc.herokuapp.com/api/room/getone/:id
 */

/**
 * @api {get} /api/room  Get all room
 * @apiDescription This api will return a list of room.
 * @apiName GetAllRoom
 * @apiGroup Room
 
 * @apiSuccess {String} id Room ID.
 * @apiSuccess {String} Room_Name Name of the room.
 * @apiSuccess {Float} Price_per_Hour Price per hour of the room.
 * @apiSuccess {Float} Price_per_Night Price per Night of the room.
 * @apiSuccess {Float} Price_per_Day Price per Day of the room.
 * @apiSuccess {String} Status Status of the room.
 * @apiSuccess {String} Create_By The id of user create the room.
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
       [
           {
                "id": "A101",
                "Room_Name": "High Top Delux",
                "Price_per_Hour": 20,
                "Price_per_Night": 60,
                "Price_per_Day": 120,
                "Status": "Unbooked",
                "Create_By": "AD_01",
            }
        ]
 * @apiError (400) CanNotFound Internal Error.
 * @apiErrorExample{object} Error-Response:
 *  HTTP/1.1 400 Bad Request 
 *        {
 *              success:false,
 *              message:"Internal Error"
 *         }
 * @apiHeader {String} Authorization=Bearer Users unique access-key.
 * @apiSampleRequest https://backend-apidoc.herokuapp.com/api/room/
 */

/**
 * @api {post} /api/room  Add new room
 * @apiDescription This api will create a room in the system.
 * @apiName AddNewRoom
 * @apiGroup Room
 
 * @apiSuccess {Boolean} success The status of add new room fail or success.
 * @apiSuccess {String} Message Message add new room successfully or error.
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
       [
          { 
              success:true,
              message:"Create Room successfully"
          }
        ]
 * @apiError (400) CanNotFound Internal Error or Room id existing.
 * @apiErrorExample{object} Error-Response:
 *  HTTP/1.1 400 Bad Request 
 *       {
 *          success:false,
 *          message:"Room id existing"
 *        }
 * @apiHeader {String} Authorization=Bearer Users unique access-key.
 * @apiBody {string} [id] Id of the room.
 * @apiBody {string} [Room_Name] Room name.
 * @apiBody {float} [Price_per_Hour] Price per Hour of the room.
 * @apiBody {float} [Pricer_per_Night] Price per Night of the room.
 * @apiBody {float} [Price_per_Day] Price per Day of the room
 * @apiBody {float} [Status] Date of birth of the User
 * @apiSampleRequest https://backend-apidoc.herokuapp.com/api/room/
 */

/**
 * @api {delete} /api/room/:id  Delete the specific room
 * @apiDescription This api will delete the specific room.
 * @apiName DeleteRoom
 * @apiGroup Room
 
 * @apiSuccess {Boolean} success The status of add new room fail or success.
 * @apiSuccess {String} Message Message add new room successfully or error.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
            {
              success:true,
              message:"Delete Successfully"
            }
 * @apiError (400) CanNotFound Can not find the room to delete  or internal error.
 * @apiErrorExample{object} Error-Response:
 *  HTTP/1.1 400 Bad Request 
 *        {
 *              success:false,
 *              message:"Can't not find room to delete"
 *         }
 * @apiHeader {String} Authorization=Bearer Users unique access-key.
 * @apiQuery {string} [id] The id of the specific room
 * @apiSampleRequest https://backend-apidoc.herokuapp.com/api/room/:id
 */


/**
 * @api {patch} /api/room  Update room information.
 * @apiDescription This api will update room information.
 * @apiName UpdateRoom
 * @apiGroup Room
 *
 * @apiSuccess {Boolean} success The status of update user fail or success.
 * @apiSuccess {String} Message Message update user successfully or error.
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *   
        {
            success:true,
            message:"Update room infomation successfully"
        }
    
 * @apiError (400) RoomNotFound Can not find the room to update.
 * @apiError (404) RoomNotFound Can not find the room or id input is empty.
 * @apiErrorExample{object} Error-Response:
 *  HTTP/1.1 400 Bad Request 
 *        {
 *              success:false,
 *              message:"Can not find the user to delete"
 *         }
 * @apiErrorExample{object} Error-Response:
 *  HTTP/1.1 404 Bad Request 
 *        {
 *              message:false,
 *              message:"Can not find the room or id input is empty!"
 *         }
 * @apiHeader {String} Authorization=Bearer Users unique access-key.
 * @apiBody {string} [id] Id of the room.
 * @apiBody {string} [Room_Name] Room name.
 * @apiBody {float} [Price_per_Hour] Price per Hour of the room.
 * @apiBody {float} [Pricer_per_Night] Price per Night of the room.
 * @apiBody {float} [Price_per_Day] Price per Day of the room
 * @apiBody {float} [Status] Date of birth of the User
 * @apiSampleRequest https://backend-apidoc.herokuapp.com/api/room/
 */


/**
 * @api {patch} /api/room/checkRoom  Check room available between two date.
 * @apiDescription This api will return rooms available between two date.
 * @apiName CheckRoom
 * @apiGroup Room
 *
 * @apiSuccess {String} id Room ID.
 * @apiSuccess {String} Room_Name Name of the room.
 * @apiSuccess {Float} Price_per_Hour Price per hour of the room.
 * @apiSuccess {Float} Price_per_Night Price per Night of the room.
 * @apiSuccess {Float} Price_per_Day Price per Day of the room.
 * @apiSuccess {String} Status Status of the room.
 * @apiSuccess {String} Create_By The id of user create the room.
 * @apiSuccessExample Success-Response:
         HTTP/1.1 200 OK
       [
           {
                "id": "A101",
                "Room_Name": "High Top Delux",
                "Price_per_Hour": 20,
                "Price_per_Night": 60,
                "Price_per_Day": 120,
                "Status": "Unbooked",
                "Create_By": "AD_01",
            }
        ]
    
 * @apiError (400) RoomNotFound There are no room available.
 * @apiError (404) RoomNotFound Internal Error.
 * @apiErrorExample{object} Error-Response:
 *  HTTP/1.1 400 Bad Request 
 *        {
 *              success:false,
 *              message:"There are no room available"
 *         }
 * @apiErrorExample{object} Error-Response:
 *  HTTP/1.1 404 Bad Request 
 *          {
    *          success:false,
    *          message:"Internal Error"
 *          }
 * @apiHeader {String} Authorization=Bearer Users unique access-key.
 * @apiBody {string} [Start_Date] Start date.
 * @apiBody {string} [End_Date] End date.
 * @apiSampleRequest https://backend-apidoc.herokuapp.com/api/room/checkRoom
 */


/**
 * @api {post} /api/trans  Add new transaction
 * @apiDescription This api will create new transaction into system.
 * @apiName AddNewTransaction
 * @apiGroup Transaction
 
 * @apiSuccess {Boolean} success The status of add new transaction fail or success.
 * @apiSuccess {String} Message Message add new transaction successfully or error.
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
       { 
           success:true,
           message:"Create transaction successfully!"
        }
 * @apiError (400) CanNotFound Internal Error.
 * @apiErrorExample{object} Error-Response:
 *  HTTP/1.1 400 Bad Request 
 *       {
 *          success:false,
 *          message:"Internal Error"
 *        }
 * @apiHeader {String} Authorization=Bearer Users unique access-key. 
 * @apiBody {string} [Customer_Name] The name of customer.
 * @apiBody {int} [Customer_Id_Card] ID card of customer.
 * @apiBody {string} [Phone_Number] Phone number of customer.
 * @apiBody {string} [Room_Num] Room number.
 * @apiBody {string} [Start_Date] Start date of transaction.
 * @apiBody {string} [End_Date] End Date of transaction.
 * @apiSampleRequest https://backend-apidoc.herokuapp.com/api/trans/
 */

/**
 * @api {delete} /api/trans/:id  Delete the specific transaction.
 * @apiDescription This api will delete the specific transaction.
 * @apiName DeleteTransaction
 * @apiGroup Transaction
 
 * @apiSuccess {Boolean} success The status of delete fail or success.
 * @apiSuccess {String} Message Message of delete successfully or error.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
            { 
                success:true,
                message:"Delete transaction successfully"
            }
 * @apiError (400) CanNotFound Internal Error.
 * @apiErrorExample{object} Error-Response:
 *  HTTP/1.1 400 Bad Request 
 *        {
 *              success:false,
 *              message:"Internal error!"
 *         }
 * @apiHeader {String} Authorization=Bearer Users unique access-key.
 * @apiQuery {string} [id] The id of the specific transaction
 * @apiSampleRequest https://backend-apidoc.herokuapp.com/api/trans/:id
 */


/**
 * @api {get} /api/trans/  Get all transaction
 * @apiDescription This api will return a list of transaction.
 * @apiName GetAllTransaction
 * @apiGroup Transaction
 
 * @apiSuccess {String} id Transaction ID.
 * @apiSuccess {String} Customer_Name Name of the customer.
 * @apiSuccess {Int} Customer_Id_Card Customer id card number.
 * @apiSuccess {String} Phone_Number Phone number of customer.
 * @apiSuccess {String} Room_Num Room number of transaction.
 * @apiSuccess {String} Start_Date Start date of transaction.
 * @apiSuccess {String} End_Date End date of transaction.
 * @apiSuccess {String} Create_Date Create date of transaction.
 * @apiSuccess {String} Payment_Id Payment id of transaction.
 * @apiSuccess {String} Payment_Method Payment method of transaction.
 * @apiSuccess {String} Status Status of transaction.
 * @apiSuccess {String} Status_Payment Status of transaction payment.
 * @apiSuccess {float} Total Total of transaction payment.
 
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
       [
           {
                "id": "TRANS_01",
                "Customer_Name": "Nam Le",
                "Customer_Id_Card": 251254123,
                "Phone_Number": "0969066865",
                "Room_Num": "A101",
                "Start_Date": "2021-12-05T06:47:19.328Z",
                "End_Date": "2021-12-07T05:00:00.000Z",
                "Create_Date": "2021-12-05T06:46:29.512Z",
                "Payment_Id": "PAY_02",
                "Payment_Method": "Cash",
                "Status": "Checked-out",
                "Status_Payment": "Paid",
                "Total": 240,
            },
        ]
 * @apiError (400) CanNotFound Internal Error.
 * @apiErrorExample{object} Error-Response:
 *  HTTP/1.1 400 Bad Request 
 *        {
 *             success:false,
 *              message:"Internal Error!"
 *         }
 * @apiHeader {String} Authorization=Bearer Users unique access-key.
 * @apiSampleRequest https://backend-apidoc.herokuapp.com/api/trans/
 */


/**
 * @api {get} /api/trans/getone/:id  Get specific transaction
 * @apiDescription This api will return a specific transaction.
 * @apiName GetOneTransaction
 * @apiGroup Transaction
 
 * @apiSuccess {String} id Transaction ID.
 * @apiSuccess {String} Customer_Name Name of the customer.
 * @apiSuccess {Int} Customer_Id_Card Customer id card number.
 * @apiSuccess {String} Phone_Number Phone number of customer.
 * @apiSuccess {String} Room_Num Room number of transaction.
 * @apiSuccess {String} Start_Date Start date of transaction.
 * @apiSuccess {String} End_Date End date of transaction.
 * @apiSuccess {String} Create_Date Create date of transaction.
 * @apiSuccess {String} Payment_Id Payment id of transaction.
 * @apiSuccess {String} Payment_Method Payment method of transaction.
 * @apiSuccess {String} Status Status of transaction.
 * @apiSuccess {String} Status_Payment Status of transaction payment.
 * @apiSuccess {float} Total Total of transaction payment.
 
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
           {
                "id": "TRANS_01",
                "Customer_Name": "Nam Le",
                "Customer_Id_Card": 251254123,
                "Phone_Number": "0969066865",
                "Room_Num": "A101",
                "Start_Date": "2021-12-05T06:47:19.328Z",
                "End_Date": "2021-12-07T05:00:00.000Z",
                "Create_Date": "2021-12-05T06:46:29.512Z",
                "Payment_Id": "PAY_02",
                "Payment_Method": "Cash",
                "Status": "Checked-out",
                "Status_Payment": "Paid",
                "Total": 240,
            }
 * @apiError (400) CanNotFound Internal Error.
 * @apiErrorExample{object} Error-Response:
 *  HTTP/1.1 400 Bad Request 
 *        {
 *             success:false,
 *              message:"Internal Error!"
 *         }
 * @apiHeader {String} Authorization=Bearer Users unique access-key.
 * @apiQuery {string} [id] The id of the specific transaction
 * @apiSampleRequest https://backend-apidoc.herokuapp.com/api/trans/getone/:id
 */


/**
 * @api {patch} /api/trans/check-in  Customer check-in
 * @apiDescription This api will update the specific transaction status to checked-in and create payment for that transaction.
 * @apiName CustomerCheck-in
 * @apiGroup Transaction
 
 * @apiSuccess {Boolean} success The status of check-in fail or success.
 * @apiSuccess {String} Message Message of check-in successfully or error.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
            {   
                success:true,
                message:"Check-in successfully"
            }
 * @apiError (400) CanNotFound Internal Error.
 * @apiErrorExample{object} Error-Response:
 *  HTTP/1.1 400 Bad Request 
 *        { 
    *          success:false,
    *          message:"Internal Error!"
 *          }
 * @apiHeader {String} Authorization=Bearer Users unique access-key.
 * @apiBody {string} [id] The id of transaction.
 * @apiBody {int} [Customer_Id_Card] ID card of customer.
 * @apiBody {string} [Room_Num] Room number.
 * @apiBody {string} [Start_Date] Start date of transaction.
 * @apiBody {string} [End_Date] End Date of transaction.
 * @apiSampleRequest https://backend-apidoc.herokuapp.com/api/trans/check-in
 */


/**
 * @api {patch} /api/trans/check-out Customer check-out
 * @apiDescription This api will update the specific transaction status to checked-out and show the payment of transaction.
 * @apiName CustomerCheck-out
 * @apiGroup Transaction
 
 * @apiSuccess {Float} surcharge The surcharge of transaction.
 * @apiSuccess {Float} total Total payment of transaction.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
           {    
                surcharge:surcharge,
                total:total
           }
 * @apiError (400) CanNotFound Internal Error.
 * @apiErrorExample{object} Error-Response:
 *  HTTP/1.1 400 Bad Request 
 *        { 
    *          success:false,
    *          message:"Internal Error!"
 *          }
 * @apiHeader {String} Authorization=Bearer Users unique access-key.
 * @apiBody {string} [id] The id of transaction.
 * @apiBody {int} [Payment_Id] Payment id of transaction.
 * @apiBody {string} [Room_Num] Room number.
 * @apiBody {string} [Start_Date] Start date of transaction.
 * @apiBody {string} [End_Date] End Date of transaction.
 * @apiSampleRequest https://backend-apidoc.herokuapp.com/api/trans/check-out
 */


/**
 * @api {patch} /api/trans/pay Customer pay bill
 * @apiDescription This api will update the specific transaction payment status to be paid and update room status of transaction.
 * @apiName CustomerPayment
 * @apiGroup Transaction
 
 * @apiSuccess {Boolean} success The status of customer pay bill.
 * @apiSuccess {String} message Message  of pay bill successfully or error.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
           {     
              success:true,
              message:"Successful transaction payment"
            }
 * @apiError (400) CanNotFound Internal Error.
 * @apiErrorExample{object} Error-Response:
 *  HTTP/1.1 400 Bad Request 
 *        { 
             success:false,
             message:"Internal Error"
 *          }
 * {id,Payment_Id,Payment_Method,Room_Num}
 * @apiHeader {String} Authorization=Bearer Users unique access-key.
 * @apiBody {string} [id] The id of transaction.
 * @apiBody {int} [Payment_Id] Payment id of transaction.
 * @apiBody {string} [Room_Num] Room number.
 * @apiBody {string} [Payment_Method] Payment method of transaction.
 * @apiSampleRequest https://backend-apidoc.herokuapp.com/api/trans/pay
 */
