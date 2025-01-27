import { pocustdTable, pocusthTable } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { ilike, sql, eq, and, or, isNull } from "drizzle-orm";
import { date } from "drizzle-orm/pg-core";
import { error } from "console";

export const GET = async ( request: Request ) => { 
    const { searchParams } = new URL(request.url);
    const userName = searchParams.get("userName")
  //  const kodeSales = searchParams.get("kodeSales");
    
    if (userName) {
        try {
            const pobycode = await db.select({
                            label: pocusthTable.nomorPo,
                            value: pocusthTable.poCode}).from(pocusthTable).where(and(ilike(pocusthTable.userName, "%"+userName+"%"), isNull(pocusthTable.deletedAt)));
            return new NextResponse(JSON.stringify(pobycode), { status: 200});
        } catch (err: any) {
        return new NextResponse("Error in fetching po data" + err.message, {
            status: 500,
        });      
        } 
    }
};