const user = require('../model/user')
const customer = require('../model/customer')
const transaction = require('../model/transaction')
const payment = require('../model/payment')

async function autoId (typeId)
{
    let newId;
    switch (typeId) {
        case 'Admin':
        {
            
            let countAdmin = await user.countDocuments({Type:"Admin"})
            if(!countAdmin)
            {
                newId="AD_01"
            }
            if(countAdmin < 10)
            {
                countAdmin++
                newId = "AD_0" + countAdmin
            }
            else
            {
                countAdmin++
                newId = "AD_" + countAdmin
            }
            return newId
        }
        case 'Employee':
        {
            
                let countEmp = await user.countDocuments({Type:"Employee"})
                if(!countEmp)
                {
                    newId="EMP_01"
                }
                else if(countEmp < 10)
                {
                    countEmp++
                    newId = "EMP_0" + countEmp
                }
                else
                {
                    countEmp++
                    newId = "EMP_" + countAdmin
                }
                return newId
        }
        case 'Customer':
            {
                let countCus = await customer.find().countDocuments()
                if(!countCus)
                {
                    newId = "CUS_01"
                }
                else if(countCus < 10)
                {
                    countCus++
                    newId = "CUS_0" + countCus
                }
                else
                {
                    countCus++
                    newId = "CUS_" + countCus
                }
                return newId
            }
        case 'Transaction':
            {
                let countTrans = await transaction.find().countDocuments()
                if(!countTrans)
                {
                    newId = "TRANS_01"
                }
                else if(countTrans < 10)
                {
                    countTrans++
                    newId = "TRANS_0" + countTrans
                }
                else
                {
                    countTrans++
                    newId = "TRANS_" + countTrans
                }
                return newId
            }
        case 'Payment':
        {
            let countPay = await payment.find().countDocuments()
                if(!countPay)
                {
                    newId = "PAY_01"
                }
                else if(countPay< 10)
                {
                    countPay++
                    newId = "TRANS_0" + countPay
                }
                else
                {
                    countPay++
                    newId = "TRANS_" + countPay
                }
                return newId
        }
        default:
            break;
    }
   
}

module.exports = autoId