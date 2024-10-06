import { Region } from "@prisma/client";
import databaseService from "../script";

export class RegionServices {
    public async findRegion(): Promise<Region[]> {
        try {
            return databaseService.getClient().region.findMany()
        } catch (error) {
            console.log("[src][services][RegionServices][findRegion] ", error)
            throw new Error("Failed to find region")
        }
    }
}