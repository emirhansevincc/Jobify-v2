import { UnauthenticatedError } from "../errors/customErrors.js";

export const authenticateUser = async (req, res, next) => {
    // console.log(req.cookies); 
    const { token } = req.cookies;
    if (!token) {
        throw new UnauthenticatedError("authentication invalid");
    }
    next();
};