const trans = require('../model/transaction')

async function checkDate(startDate,endDate,roomNum,transId)
{
    if(!transId)
    {
        if(new Date(startDate).getTime()==new Date(endDate).getTime())
        {
            startDate = new Date(startDate).setHours(0,0,0)
            console.log(startDate)
            endDate = new Date(endDate).setHours(23,59,0)
            console.log(endDate)
        }
        else
        {
            startDate = new Date(startDate).setHours(14,0,0)
            endDate = new Date(endDate).setHours(12,0,0)
            console.log("as")
        }
        let checkRoomInTwoDate = await trans.find({$and:[{Status:{$ne:"Checked-out"}},{$and:[{Room_Num:roomNum},
            {$or:[{$and:[{Start_Date:{$lte:startDate.getTime()}},{End_Date:{$gte:startDate.getTime()}}]},
            {$and:[{Start_Date:{$lte:endDate.getTime()}},{End_Date:{$gte:endDate.getTime()}}]}]}]}]})

        let checkRoomOverTwoDate = await trans.find({$and:[{Status:{$ne:"Checked-out"}},{$and:[{Room_Num:roomNum},
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
        let checkRoomInTwoDate = await trans.find({$and:[{id:{$ne:transId}},{$and:[{$and:[{Status:{$ne:"Checked-out"}},{Status:{$ne:"Cancelled"}}]},{$and:[{Room_Num:roomNum},
            {$or:[{$and:[{Start_Date:{$lte:startDate.getTime()}},{End_Date:{$gte:startDate.getTime()}}]},
            {$and:[{Start_Date:{$lte:endDate.getTime()}},{End_Date:{$gte:endDate.getTime()}}]}]}]}]}]})

        let checkRoomOverTwoDate = await trans.find({$and:[{id:{$ne:transId}},{$and:[{$and:[{Status:{$ne:"Checked-out"}},{Status:{$ne:"Cancelled"}}]},{$and:[{Room_Num:roomNum},
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