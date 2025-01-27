import { canvasTable, inqheadTable, pocusthTable, projectTable, quoteheadTable } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { ilike, sql, eq, and, or, isNull } from "drizzle-orm";
import { date } from "drizzle-orm/pg-core";
import { error } from "console";

export const GET = async ( request: Request ) => { 
    const { searchParams } = new URL(request.url);
    const userName = searchParams.get("userName");
    const kodeproyek = searchParams.get("kodeProyek");
  //  const kodeSales = searchParams.get("kodeSales");
  if (kodeproyek) {
    console.log('ini isi kodeproyek:',kodeproyek);
    try {
        const proyekbycode1 = await db.select({kodeProyek: projectTable.kodeProyek, nama: projectTable.nama, tanggal: projectTable.tanggal, note: projectTable.note, canvassing: canvasTable.namaCan, kdCan: canvasTable.canvasCode, inquiry: inqheadTable.namaInq, kdInq: inqheadTable.inqCode, quotation: quoteheadTable.namaQuo, kdQuo: quoteheadTable.quoteCode, po: pocusthTable.namaPo, kdPo: pocusthTable.poCode}).from(projectTable).leftJoin(canvasTable, eq(projectTable.kodeProyek, canvasTable.kodeProyek)).leftJoin(inqheadTable, eq(projectTable.kodeProyek, inqheadTable.kodeProyek)).leftJoin(quoteheadTable, eq(projectTable.kodeProyek, quoteheadTable.kodeProyek)).leftJoin(pocusthTable, eq(projectTable.kodeProyek, pocusthTable.kodeProyek)).where(and(and(ilike(projectTable.userName, "%"+userName+"%"), isNull(projectTable.deletedAt)), ilike(projectTable.kodeProyek, "%"+kodeproyek+"%")));
        return new NextResponse(JSON.stringify(proyekbycode1), { status: 200});
    } catch (err: any) {
    return new NextResponse("Error in fetching project data" + err.message, {
        status: 500,
    });      
    }    
  }
    if (userName) {
        try {
            const projectbycode2 = await db.select({kodeProyek: projectTable.kodeProyek, nama: projectTable.nama, tanggal: projectTable.tanggal, note: projectTable.note, canvassing: canvasTable.namaCan, inquiry: inqheadTable.namaInq, quotation: quoteheadTable.namaQuo, po: pocusthTable.namaPo}).from(projectTable).leftJoin(canvasTable, eq(projectTable.kodeProyek, canvasTable.kodeProyek)).leftJoin(inqheadTable, eq(projectTable.kodeProyek, inqheadTable.kodeProyek)).leftJoin(quoteheadTable, eq(projectTable.kodeProyek, quoteheadTable.kodeProyek)).leftJoin(pocusthTable, eq(projectTable.kodeProyek, pocusthTable.kodeProyek)).where(and(ilike(projectTable.userName, "%"+userName+"%"), isNull(projectTable.deletedAt)));
            return new NextResponse(JSON.stringify(projectbycode2), { status: 200});
        } catch (err: any) {
        return new NextResponse("Error in fetching project data" + err.message, {
            status: 500,
        });      
        } 
    }
};
