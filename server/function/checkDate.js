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
        startDate = new Date(startDate)
        endDate = new Date(endDate) 
        let checkRoomInTwoDate = await trans.find({$and:[{Trans_Id:{$ne:transId}},{$and:[{$not:{Status:"Checked-out"}},{$and:[{Room_Num:roomNum},
            {$or:[{$and:[{Start_Date:{$lte:startDate.getTime()}},{End_Date:{$gte:startDate.getTime()}}]},
            {$and:[{Start_Date:{$lte:endDate.getTime()}},{End_Date:{$gte:endDate.getTime()}}]}]}]}]}]})

        let checkRoomOverTwoDate = await trans.find({$and:[{Trans_Id:{$ne:transId}},{$and:[{$not:{Status:"Checked-out"}},{$and:[{Room_Num:roomNum},
            {$and:[{Start_Date:{$gt:startDate.getTime()}},{End_Date:{$lt:endDate.getTime()}}]}]}]}]})

        if (checkRoomInTwoDate.length==0 && checkRoomOverTwoDate.length==0)
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