import { NextFunction, Request, Response } from "express";
import { RegionServices } from "../services/regionServices";

const regionServices = new RegionServices(); 

export class RegionController {
    public async findRegion(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const region = await regionServices.findRegion();
            res.status(200).json({
                status: 200,
                data: region
            });
        } catch (error) {
            console.log("[src][controllers][RegionController][findRegion] ", error);
            next(error);
        }
    }
}