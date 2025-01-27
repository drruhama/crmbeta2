import { canvasTable, inqheadTable, pocusthTable, projectTable, quoteheadTable } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { ilike, sql, eq, and, or, isNull } from "drizzle-orm";
import { date } from "drizzle-orm/pg-core";
import { error } from "console";

export const GET = async ( request: Request ) => { 
    
    const { searchParams } = new URL(request.url);
    const userName = searchParams.get("userName");
    const canCode = searchParams.get("canvasCode");
 //   const namapo = searchParams.get("namaPo");
  //  const nomorpo = searchParams.get("nomorPo");
  //  const kodeSales = searchParams.get("kodeSales");
  if (canCode) {  
    try {
        const canvasbycode = await db.select().from(canvasTable).where(ilike(canvasTable.canvasCode, "%"+canCode+"%"));
        return new NextResponse(JSON.stringify(canvasbycode), { status: 200});
    } catch (err: any) {
    return new NextResponse("Error in fetching canvass data" + err.message, {
        status: 500,
    });      
    }    
  }
  
    if (userName) {
        try {
            const canvasbycode2 = await db.select().from(canvasTable).where(and(ilike(canvasTable.userName, "%"+userName+"%"), isNull(canvasTable.deletedAt)));
            return new NextResponse(JSON.stringify(canvasbycode2), { status: 200});
        } catch (err: any) {
        return new NextResponse("Error in fetching canvass data" + err.message, {
            status: 500,
        });      
        }   
    }
};
