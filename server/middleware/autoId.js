const user = require('../model/user')
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
            if(countAdmin < 9)
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
                else if(countEmp < 9)
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
        case 'Transaction':
            {
                let countTrans = await transaction.find().countDocuments()
                if(!countTrans)
                {
                    newId = "TRANS_01"
                }
                else if(countTrans < 9)
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
                else if(countPay< 9)
                {
                    countPay++
                    newId = "PAY_0" + countPay
                }
                else
                {
                    countPay++
                    newId = "PAY_" + countPay
                }
                return newId
        }
        default:
            break;
    }
   
}

module.exports = autoId