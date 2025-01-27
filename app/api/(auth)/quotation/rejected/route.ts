import { canvasTable, inqheadTable, quoteheadTable, salesTable } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { ilike, sql, eq, and, or, isNull } from "drizzle-orm";
import { date } from "drizzle-orm/pg-core";
import { error } from "console";

export const GET = async ( request: Request ) => { 
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username")
    //const kodeSales = searchParams.get("kodeSales");
    
    if (username) {
        try {
            const quotebycode = await db.select().from(quoteheadTable).where (and(and(eq(quoteheadTable.userName, username), isNull(quoteheadTable.deletedAt)), eq(quoteheadTable.approval,'no')));
            return new NextResponse(JSON.stringify(quotebycode), { status: 200});
        } catch (err: any) {
        return new NextResponse("Error in fetching quote data" + err.message, {
            status: 500,
        });      
        } 
    }
    try {
            const allQuote = await db.select().from(quoteheadTable).where(isNull(quoteheadTable.deletedAt));
            return new NextResponse(JSON.stringify(allQuote), { status: 200});
    } catch (err: any) {
        return new NextResponse("Error in fetching quote data" + err.message, {
            status: 500,
        });      
    }
};
