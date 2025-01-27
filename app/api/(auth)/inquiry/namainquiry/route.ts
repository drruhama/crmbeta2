import { inqheadTable, pocustdTable, pocusthTable, quoteheadTable } from "@/db/schema";
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
            const inquirybycode = await db.select({
                            label: inqheadTable.namaInq,
                            value: inqheadTable.inqCode}).from(inqheadTable).where(and(ilike(inqheadTable.userName, "%"+userName+"%"), isNull(inqheadTable.deletedAt)));
            return new NextResponse(JSON.stringify(inquirybycode), { status: 200});
        } catch (err: any) {
        return new NextResponse("Error in fetching inquriy data" + err.message, {
            status: 500,
        });      
        } 
    }
};