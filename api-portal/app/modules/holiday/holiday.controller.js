const SingleResponse = require("../../common/responses/single.response");
const ListResponse = require("../../common/responses/list.response");
const RESPONSE_MSG = require("../../common/const/responseMsg.const");
const optionService = require('../../common/services/options.service');
const  HolidayService = require("./holiday.service");

const getListHoliday = async(req,res,next)=>{
    try{
        const serviceRes = await HolidayService.getListHoliday(req.query);
        if(serviceRes.isFailed()){
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
        
    }catch(error){
        return next(error);
    }
}

const HolidayCreateOrUpdate = async (req,res,next)=>{
    try{
        const serviceRes = await HolidayService.HolidayCreateOrUpdate(req.body);
        if(serviceRes.isFailed()){
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    }catch(error){
        return next(error);
    }
}

const  HolidayUpdate = async (req,res,next)=>{
    try{
        
        const serviceRes = await HolidayService.HolidayCreateOrUpdate(req.body);
        if(serviceRes.isFailed()){
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    }catch(error){
        return next(error);
    }
}

const getHoliday = async (req,res,next)=>{
    try{
        const serviceRes = await HolidayService.getHoliday(req.params);
        if(serviceRes.isFailed()){
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
        
    }catch(error){
        return next(error);
    }
}


const deleteHoliday = async (req,res,next)=>{
    try {
        const holiday_id = req.params.holiday_id;
        // Check exists
        const CheckFilterID = await HolidayService.getHoliday(req.params);
        if (CheckFilterID.isFailed()) {
          return next(CheckFilterID);
        }
    
        // Delete
        const serviceRes = await HolidayService.deleteHoliday(holiday_id, req.body);
        if (serviceRes.isFailed()) {
          return next(serviceRes);
        }
        return res.json(
          new SingleResponse(null, RESPONSE_MSG.PRODUCT.DELETE_SUCCESS)
        );
      } catch (error) {
        return next(error);
      }
}


const deleteHolidayList = async (req,res,next)=>{
    try {    
        // Delete
        const serviceRes = await HolidayService.deleteHolidayList(req.body);
        if (serviceRes.isFailed()) {
          return next(serviceRes);
        }
        return res.json(
          new SingleResponse(null, RESPONSE_MSG.PRODUCT.DELETE_SUCCESS)
        );
      } catch (error) {
        return next(error);
      }
}



module.exports ={
    getListHoliday,
    HolidayCreateOrUpdate,
    getHoliday,
    deleteHoliday,
    HolidayUpdate,
    deleteHolidayList
}
