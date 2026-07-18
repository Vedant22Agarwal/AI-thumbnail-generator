import {Request,Response,NextFunction} from 'express';

const protectUser = async (req : Request,res:Response , next : NextFunction) => {
    const {isLoggedIn,userId} = req.session;
    if(!isLoggedIn || !userId){
        return res.status(401).json({
            message : "You are not LoggedIn"
        })
    }
    next();
}   
export default protectUser;