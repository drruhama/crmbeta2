import { canvasTable, inqheadTable, pocusthTable, projectTable, quoteheadTable } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { ilike, sql, eq, and, or, isNull } from "drizzle-orm";
import { date } from "drizzle-orm/pg-core";
import { error } from "console";

export const GET = async ( request: Request ) => { 
    
    const { searchParams } = new URL(request.url);
    const userName = searchParams.get("userName");
    const quoteCode = searchParams.get("quoteCode");
 //   const namapo = searchParams.get("namaPo");
  //  const nomorpo = searchParams.get("nomorPo");
  //  const kodeSales = searchParams.get("kodeSales");
  if (quoteCode) {  
    try {
        const quotebycode = await db.select().from(quoteheadTable).where(ilike(quoteheadTable.quoteCode, "%"+quoteCode+"%"));
        return new NextResponse(JSON.stringify(quotebycode), { status: 200});
    } catch (err: any) {
    return new NextResponse("Error in fetching quotation data" + err.message, {
        status: 500,
    });      
    }    
  }
  
    if (userName) {
        try {
            const quotebycode2 = await db.select().from(quoteheadTable).where(and(ilike(quoteheadTable.userName, "%"+userName+"%"), isNull(quoteheadTable.deletedAt)));
            return new NextResponse(JSON.stringify(quotebycode2), { status: 200});
        } catch (err: any) {
        return new NextResponse("Error in fetching quote data" + err.message, {
            status: 500,
        });      
        }   
    }
};
