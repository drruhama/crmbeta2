import { canvasTable, inqdtTable, inqheadTable, quotedtTable, produkTable, salesTable, pocustdTable } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { ilike, sql, eq, and, or, isNull } from "drizzle-orm";
import { date } from "drizzle-orm/pg-core";
import { error } from "console";

export const GET = async ( request: Request ) => { 
    const { searchParams } = new URL(request.url);
    const kodePo = searchParams.get("kodePo")
    //const kodeSales = searchParams.get("kodeSales");
    
    if (kodePo) {
        try {
            const pobycode = await db.select({poNo: pocustdTable.poNo, poCode: pocustdTable.poCode, kodeBrg: pocustdTable.kodeBrg, namaBrg: pocustdTable.namaBrg, qty: pocustdTable.qty, harga: pocustdTable.harga, remark: pocustdTable.remark, namaBarang: produkTable.namaBarang}).from(pocustdTable).leftJoin(produkTable, eq(pocustdTable.kodeBrg, produkTable.kodeBarang)).where (and(eq(pocustdTable.poCode, kodePo), isNull(pocustdTable.deletedAt)));
            return new NextResponse(JSON.stringify(pobycode), { status: 200});
        } catch (err: any) {
        return new NextResponse("Error in fetching PO data" + err.message, {
            status: 500,
        });      
        } 
    }
};


export const DELETE = async ( request: Request) => {
    // bisa juga kalau di folder api ditambah folder [userId] maka codenya berubah: export const DELETE = async (request: Request, context: { params: any }) => {
    try {
    const { searchParams } = new URL(request.url);
    const noPo = Number(searchParams.get("kodePo"));
    //bisa juga kalau di folder api ditambah folder [userId] maka codenya berubah: const userId = context.params.userId;
    if (!noPo) {
        return new NextResponse(JSON.stringify({ message: "No PO not found"}), { status: 400 });
    }
    const deletedPo = await db.delete(pocustdTable).where(eq(pocustdTable.poNo, noPo));
    //bisa juga : const deletedUser = await User.findByIdAndDelete(userId) // kalau dua kriteria misal ( { _id: uerId, category: categoryId })
    if (!deletedPo) {
        return new NextResponse(JSON.stringify({ message: "No PO not found"}), { status: 400 });
    }
    return new NextResponse( JSON.stringify({ message: "No PO is deleted", user: deletedPo }), { status: 200 })
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: "Error in deleting no PO"}), { status : 500 })
    }
}



