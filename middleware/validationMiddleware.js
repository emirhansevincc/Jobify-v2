import { body, param, validationResult } from "express-validator";
import { BadRequestError, NotFoundError } from "../errors/customErrors.js";
import { JOB_STATUS, JOB_TYPE } from "../utils/constants.js";
import mongoose from "mongoose";
import Job from "../models/JobModel.js";

const withValidationErrors = (validateValues) => { // validateValues is an array of validation functions
    return [
        validateValues,
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorMessages = errors.array().map((error) => error.msg);
                if (errorMessages[0].startsWith("no job")) {
                    throw new NotFoundError(errorMessages);
                }
                throw new BadRequestError(errorMessages);
            }
            next();
        },
    ];
};

export const validateJobInput = withValidationErrors([
    body("company").notEmpty().withMessage("company is required"),
    body("position").notEmpty().withMessage("position is required"),
    body("jobLocation").notEmpty().withMessage("job location is required"),
    body("jobStatus")
        .isIn(Object.values(JOB_STATUS))
        .withMessage("invalid status value"),
    body("jobType").isIn(Object.values(JOB_TYPE)).withMessage("invalid job type"),
]);

export const validateIdParam = withValidationErrors([
    // we use 'id' because that's what we named the parameter in the route
    param("id")
        .custom(async (value) => {
            const isValidId = mongoose.Types.ObjectId.isValid(value)
            // We dont need withMessage() because we are throwing our error
            if (!isValidId) throw new BadRequestError("invalid MongoDB id");
            const job = await Job.findById(value);
            if (!job) throw new NotFoundError(`no job with id ${value}`);

        }) // It returns true if the value is a valid MongoDB ObjectId else false.
    // .withMessage("invalid MongoDB id"),
]); 