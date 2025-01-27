import { canvasTable, inqheadTable, pocustdTable, pocusthTable, quoteheadTable } from "@/db/schema";
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
            const canvasbycode = await db.select({
                            label: canvasTable.namaCan,
                            value: canvasTable.canvasCode}).from(canvasTable).where(and(ilike(canvasTable.userName, "%"+userName+"%"), isNull(canvasTable.deletedAt)));
            return new NextResponse(JSON.stringify(canvasbycode), { status: 200});
        } catch (err: any) {
        return new NextResponse("Error in fetching canvass data" + err.message, {
            status: 500,
        });      
        } 
    }
};