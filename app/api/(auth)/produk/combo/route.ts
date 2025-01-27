import { canvasTable, inqdtTable, inqheadTable, pocustdTable, produkTable, salesTable } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { ilike, sql, eq, and, or, isNull } from "drizzle-orm";
import { date } from "drizzle-orm/pg-core";
import { error } from "console";

export const GET = async ( request: Request ) => { 
  //  const { searchParams } = new URL(request.url);
    //const kodeBrg = searchParams.get("kodeBrg")
    //const kodeSales = searchParams.get("kodeSales");
    
    try {
        const allProduk = await db.select({label: produkTable.namaBarang, value: produkTable.kodeBarang, hargabrg: produkTable.hargaBarang, hargajual: produkTable.hargaJual, hargamodal: produkTable.hargaModal, hargabeli: produkTable.hargaBeli}).from(produkTable).where(and(eq(produkTable.status,"active"), isNull(produkTable.deletedAt)));
        return new NextResponse(JSON.stringify(allProduk), { status: 200});
} catch (err: any) {
    return new NextResponse("Error in fetching Produk data" + err.message, {
        status: 500,
    });      
}
};