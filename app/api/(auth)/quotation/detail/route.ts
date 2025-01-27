import { canvasTable, inqdtTable, inqheadTable, quotedtTable, produkTable, salesTable } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { ilike, sql, eq, and, or, isNull } from "drizzle-orm";
import { date } from "drizzle-orm/pg-core";
import { error } from "console";

export const GET = async ( request: Request ) => { 
    const { searchParams } = new URL(request.url);
    const kodeQuote = searchParams.get("kodeQuote")
    //const kodeSales = searchParams.get("kodeSales");
    
    if (kodeQuote) {
        try {
            const quotebycode = await db.select({quoteNo: quotedtTable.quoteNo, quoteCode: quotedtTable.quoteCode, kodeBrg: quotedtTable.kodeBrg, namaBrg: quotedtTable.namaBrg, qty: quotedtTable.qty, harga: quotedtTable.harga, remark: quotedtTable.remark, namaBarang: produkTable.namaBarang}).from(quotedtTable).leftJoin(produkTable, eq(quotedtTable.kodeBrg, produkTable.kodeBarang)).where (and(eq(quotedtTable.quoteCode, kodeQuote), isNull(quotedtTable.deletedAt)));
            return new NextResponse(JSON.stringify(quotebycode), { status: 200});
        } catch (err: any) {
        return new NextResponse("Error in fetching quote data" + err.message, {
            status: 500,
        });      
        } 
    }
};


export const DELETE = async ( request: Request) => {
    // bisa juga kalau di folder api ditambah folder [userId] maka codenya berubah: export const DELETE = async (request: Request, context: { params: any }) => {
    try {
    const { searchParams } = new URL(request.url);
    const noQuotation = Number(searchParams.get("kodeQuote"));
    //bisa juga kalau di folder api ditambah folder [userId] maka codenya berubah: const userId = context.params.userId;
    if (!noQuotation) {
        return new NextResponse(JSON.stringify({ message: "No quo not found"}), { status: 400 });
    }
    const deletedQuotation = await db.delete(quotedtTable).where(eq(quotedtTable.quoteNo, noQuotation));
    //bisa juga : const deletedUser = await User.findByIdAndDelete(userId) // kalau dua kriteria misal ( { _id: uerId, category: categoryId })
    if (!deletedQuotation) {
        return new NextResponse(JSON.stringify({ message: "No quo not found"}), { status: 400 });
    }
    return new NextResponse( JSON.stringify({ message: "No quo is deleted", user: deletedQuotation }), { status: 200 })
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: "Error in deleting no quo"}), { status : 500 })
    }
}



