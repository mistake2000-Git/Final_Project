const trans = require('../model/transaction')

async function checkDate(startDate,endDate,roomNum,transId)
{
    if(!transId)
    {
        startDate = new Date(startDate)
        endDate = new Date(endDate)
        let checkRoomInTwoDate = await trans.find({$and:[{$not:{Status:"Checked-out"}},{$and:[{Room_Num:roomNum},
            {$or:[{$and:[{Start_Date:{$lte:startDate.getTime()}},{End_Date:{$gte:startDate.getTime()}}]},
            {$and:[{Start_Date:{$lte:endDate.getTime()}},{End_Date:{$gte:endDate.getTime()}}]}]}]}]})

        let checkRoomOverTwoDate = await trans.find({$and:[{$not:{Status:"Checked-out"}},{$and:[{Room_Num:roomNum},
            {$and:[{Start_Date:{$gt:startDate.getTime()}},{End_Date:{$lt:endDate.getTime()}}]}]}]})
        
        if(checkRoomInTwoDate.length==0 && checkRoomOverTwoDate.length==0)
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
        const checkDate = await trans.find({$not:[{Trans_Id:transId}],$and:[{Room_Num:roomNum},
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