import { customerTable, pocustdTable, pocusthTable, projectTable, quoteheadTable } from "@/db/schema";
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
            const proyekbycode = await db.select({
                            label: customerTable.fullName,
                            value: quoteheadTable.quoteCode}).from(quoteheadTable).leftJoin(customerTable, eq(quoteheadTable.custCd, customerTable.custCode)).where(and(ilike(quoteheadTable.userName, "%"+userName+"%"), isNull(quoteheadTable.deletedAt)));
            return new NextResponse(JSON.stringify(proyekbycode), { status: 200});
        } catch (err: any) {
        return new NextResponse("Error in fetching project data" + err.message, {
            status: 500,
        });      
        } 
 //   }
};