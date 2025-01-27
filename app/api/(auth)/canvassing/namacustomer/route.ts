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
            const canbynama = await db.select({
                            label: customerTable.fullName,
                            value: canvasTable.canvasCode}).from(canvasTable).leftJoin(customerTable, eq(canvasTable.custCd, customerTable.custCode)).where(and(ilike(canvasTable.userName, "%"+userName+"%"), isNull(canvasTable.deletedAt)));
            return new NextResponse(JSON.stringify(canbynama), { status: 200});
        } catch (err: any) {
        return new NextResponse("Error in fetching Canvass data" + err.message, {
            status: 500,
        });      
        } 
 //   }
};