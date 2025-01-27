import { canvasTable, customerTable, inqheadTable, pocustdTable, pocusthTable, projectTable, quoteheadTable } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { ilike, sql, eq, and, or, isNull } from "drizzle-orm";
import { date } from "drizzle-orm/pg-core";
import { error } from "console";

export const GET = async ( request: Request ) => { 
   const { searchParams } = new URL(request.url);
   const userName = searchParams.get("userName");
  //  const kodeSales = searchParams.get("kodeSales");
 // const kodeProyek = searchParams.get("kodeCust");
   // if (kodeProyek) {
        try {
            const custbynama = await db.select({
                            label: customerTable.fullName,
                            value: customerTable.custCode}).from(customerTable).where(and(ilike(customerTable.registeredBy, "%"+userName+"%"), isNull(customerTable.deletedAt)));
            return new NextResponse(JSON.stringify(custbynama), { status: 200});
        } catch (err: any) {
        return new NextResponse("Error in fetching Customer data" + err.message, {
            status: 500,
        });      
        } 
 //   }
};