const trans = require('../model/transaction')

async function checkDate(startDate,endDate,roomNum,transId)
{
    if(!transId)
    {
        const checkDate = await trans.find({$and:[{Room_Num:roomNum},
            {$or:[
            {$and: [{Start_Date:{$lte: new Date(startDate)}},{End_Date:{$gte: new Date(startDate)}}]},
            {$and: [{Start_Date:{$lte: new Date(endDate)}},{End_Date:{$gte: new Date(endDate)}}]}]}]})
        if (checkDate.length==0)
        {
            return true
        }
        else 
        {
            return false
        }
    }
    else if(transId)
    {
        const checkDate = await trans.find({$nor:[{Trans_Id:transId}],$and:[{Room_Num:roomNum},
            {$or:[
            {$and: [{Start_Date:{$lte: new Date(startDate)}},{End_Date:{$gte: new Date(startDate)}}]},
            {$and: [{Start_Date:{$lte: new Date(endDate)}},{End_Date:{$gte: new Date(endDate)}}]}]}]})
        if (checkDate.length==0)
        {
            return true
        }
        else 
        {
            return false
        }
    }
}
module.exports = checkDate