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
                UserType:User.Type
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
 * @api {get} /cubes/ Add a new Product
 * @apiDescription This api will add a new product to the Products List!
 * @apiName AddNewProduct
 * @apiGroup RubikShop
 *
 * @apiSuccess {String} ID id of the product.
 * @apiSuccess {String} Category name  of product.
 * @apiSuccess {String} Name name  of product.
 * @apiSuccess {Int} Quantity quantity  of product.
 * @apiSuccess {Int} Price price  of product
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *    [
            {
                "_id": "6187fe2fa2241ed2e1359b26",
                "category": "3x3",
                "name": "Rubik Moyu Weilong WR M 2020",
                "quantity": 40,
                "price": 650000,
                "__v": 0
            }
        ]
 * @apiError (404) TheProductExist The new product is exist!
 * @apiErrorExample Error-Response:
 *     The product name is exist!
 * @apiBody {string} [category] The category of the new product
 * @apiBody {string} [name] The name of the new product
 * @apiBody {int} [quantity] The quantity of the new product
 * @apiBody {int} [price] The name of the new product
 * @apiSampleRequest https://assignment4tanloc.herokuapp.com/cubes/
 */


/**
 * @api {patch} /api/ Update the quantity of the product
 * @apiDescription This api will update the quantity of the product with ID input!
 * @apiName UpdateProduct
 * @apiGroup RubikShop
 *
 * @apiSuccess {String} ID id of the product.
 * @apiSuccess {String} Category name  of product.
 * @apiSuccess {String} Name name  of product.
 * @apiSuccess {Int} Quantity quantity  of product.
 * @apiSuccess {Int} Price price  of product
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *    [
            {
                "_id": "6187fe2fa2241ed2e1359b26",
                "category": "3x3",
                "name": "Rubik Moyu Weilong WR M 2020",
                "quantity": 20,
                "price": 650000,
                "__v": 0
            }
        ]
 * @apiError (404) Theidunvalid The id to update doest not exist!
 * @apiError (404) The quantity is less than 0!
 * @apiErrorExample Error-Response:
 *     Can't not found the product ID or the quantity is less than 0!
 * @apiQuery {string} [id] The id of the specific product
 * @apiQuery {int} [quantity] The quantity of the specific product
 * @apiSampleRequest https://assignment4tanloc.herokuapp.com/cubes/:id/:quantity
 */


/**
 * @api {delete} /cubes/ Delete the product with the ID input!
 * @apiDescription This api will delete the product of the id input.
 * @apiName DeleteProduct
 * @apiGroup RubikShop
 *
 * @apiSuccess {String} ID id of the product.
 * @apiSuccess {String} Category name  of product.
 * @apiSuccess {String} Name name  of product.
 * @apiSuccess {Int} Quantity quantity  of product.
 * @apiSuccess {Int} Price price  of product
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *   [
        {
            "_id": "6187fe2fa2241ed2e1359b26",
            "category": "3x3",
            "name": "Rubik Moyu Weilong WR M 2020",
            "quantity": 20,
            "price": 650000,
            "__v": 0
        },
        {
            "_id": "6187fe4da2241ed2e1359b28",
            "category": "3x3",
            "name": "Rubik YJ MGC 3x3 V2 M Stickerless",
            "quantity": 70,
            "price": 290000,
            "__v": 0
        },
        {
            "_id": "6187fe99a2241ed2e1359b2b",
            "category": "4x4",
            "name": "Rubik 4x4 Gan 460M Stickerless",
            "quantity": 10,
            "price": 990000,
            "__v": 0
        }
    ]
 * @apiError (404) CannotFindTheProduct The id of the product to delete does not exist.
 * @apiErrorExample Error-Response:
 *    No exist the product to delete!
 * @apiQuery {string} [id] The id of the specific product
 * @apiSampleRequest  https://assignment4tanloc.herokuapp.com/cubes/:id/
 */