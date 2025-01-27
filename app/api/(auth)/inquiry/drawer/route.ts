import { canvasTable, inqheadTable, pocusthTable, projectTable, quoteheadTable } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { ilike, sql, eq, and, or, isNull } from "drizzle-orm";
import { date } from "drizzle-orm/pg-core";
import { error } from "console";

export const GET = async ( request: Request ) => { 
    
    const { searchParams } = new URL(request.url);
    const userName = searchParams.get("userName");
    const inqCode = searchParams.get("inqCode");
 //   const namapo = searchParams.get("namaPo");
  //  const nomorpo = searchParams.get("nomorPo");
  //  const kodeSales = searchParams.get("kodeSales");
  if (inqCode) {  
    try {
        const inquirybycode = await db.select().from(inqheadTable).where(ilike(inqheadTable.inqCode, "%"+inqCode+"%"));
        return new NextResponse(JSON.stringify(inquirybycode), { status: 200});
    } catch (err: any) {
    return new NextResponse("Error in fetching inquiry data" + err.message, {
        status: 500,
    });      
    }    
  }
  
    if (userName) {
        try {
            const inquirybycode2 = await db.select().from(inqheadTable).where(and(ilike(inqheadTable.userName, "%"+userName+"%"), isNull(inqheadTable.deletedAt)));
            return new NextResponse(JSON.stringify(inquirybycode2), { status: 200});
        } catch (err: any) {
        return new NextResponse("Error in fetching inquiry data" + err.message, {
            status: 500,
        });      
        }   
    }
};
