import { canvasTable, inqheadTable, pocusthTable, projectTable, quoteheadTable } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { ilike, sql, eq, and, or, isNull } from "drizzle-orm";
import { date } from "drizzle-orm/pg-core";
import { error } from "console";

export const GET = async ( request: Request ) => { 
    
    const { searchParams } = new URL(request.url);
    const userName = searchParams.get("userName");
    const poCode = searchParams.get("poCode");
 //   const namapo = searchParams.get("namaPo");
  //  const nomorpo = searchParams.get("nomorPo");
  //  const kodeSales = searchParams.get("kodeSales");
  if (poCode) {  
    try {
        const pobycode = await db.select().from(pocusthTable).where(ilike(pocusthTable.poCode, "%"+poCode+"%"));
        return new NextResponse(JSON.stringify(pobycode), { status: 200});
    } catch (err: any) {
    return new NextResponse("Error in fetching project data" + err.message, {
        status: 500,
    });      
    }    
  }
  
    if (userName) {
        try {
            const pobycode2 = await db.select().from(pocusthTable).where(and(ilike(pocusthTable.userName, "%"+userName+"%"), isNull(pocusthTable.deletedAt)));
            return new NextResponse(JSON.stringify(pobycode2), { status: 200});
        } catch (err: any) {
        return new NextResponse("Error in fetching po data" + err.message, {
            status: 500,
        });      
        }   
    }
};
