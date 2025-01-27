import { customerTable, inqheadTable, pocustdTable, pocusthTable, projectTable, quoteheadTable } from "@/db/schema";
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
            const inqbynama = await db.select({
                            label: customerTable.fullName,
                            value: inqheadTable.inqCode}).from(inqheadTable).leftJoin(customerTable, eq(inqheadTable.custCd, customerTable.custCode)).where(and(ilike(inqheadTable.userName, "%"+userName+"%"), isNull(inqheadTable.deletedAt)));
            return new NextResponse(JSON.stringify(inqbynama), { status: 200});
        } catch (err: any) {
        return new NextResponse("Error in fetching inquiry data" + err.message, {
            status: 500,
        });      
        } 
 //   }
};