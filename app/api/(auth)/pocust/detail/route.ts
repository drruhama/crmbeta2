import { canvasTable, inqdtTable, inqheadTable, pocustdTable, salesTable } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { ilike, sql, eq, and, or, isNull } from "drizzle-orm";
import { date } from "drizzle-orm/pg-core";
import { error } from "console";

export const GET = async ( request: Request ) => { 
    const { searchParams } = new URL(request.url);
    const kodePO = searchParams.get("kodePO")
    //const kodeSales = searchParams.get("kodeSales");
    
    if (kodePO) {
        try {
            const pobycode = await db.select().from(pocustdTable).where (and(eq(pocustdTable.poCode, kodePO), isNull(pocustdTable.deletedAt)));
            return new NextResponse(JSON.stringify(pobycode), { status: 200});
        } catch (err: any) {
        return new NextResponse("Error in fetching PO data" + err.message, {
            status: 500,
        });      
        } 
    }
};




