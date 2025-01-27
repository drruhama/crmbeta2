import { canvasTable, inqdtTable, inqheadTable, produkTable, salesTable } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { ilike, sql, eq, and, or, isNull } from "drizzle-orm";
import { date } from "drizzle-orm/pg-core";
import { error } from "console";

export const GET = async ( request: Request ) => { 
    const { searchParams } = new URL(request.url);
    const kodeInq = searchParams.get("kodeInq")
    //const kodeSales = searchParams.get("kodeSales");
    
    if (kodeInq) {
        try {
            const inqbycode = await db.select({inqNo: inqdtTable.inqNo, inqCode: inqdtTable.inqCode, kodeBrg: inqdtTable.kodeBrg, namaBrg: inqdtTable.namaBrg, qty: inqdtTable.qty, remark: inqdtTable.remark, namaBarang: produkTable.namaBarang}).from(inqdtTable).leftJoin(produkTable, eq(inqdtTable.kodeBrg, produkTable.kodeBarang)).where (and(eq(inqdtTable.inqCode, kodeInq), isNull(inqdtTable.deletedAt)));
            return new NextResponse(JSON.stringify(inqbycode), { status: 200});
        } catch (err: any) {
        return new NextResponse("Error in fetching inquiry data" + err.message, {
            status: 500,
        });      
        } 
    }
};

export const DELETE = async ( request: Request) => {
    // bisa juga kalau di folder api ditambah folder [userId] maka codenya berubah: export const DELETE = async (request: Request, context: { params: any }) => {
    try {
    const { searchParams } = new URL(request.url);
    const noInquiry = Number(searchParams.get("inqNo"));
    //bisa juga kalau di folder api ditambah folder [userId] maka codenya berubah: const userId = context.params.userId;
    if (!noInquiry) {
        return new NextResponse(JSON.stringify({ message: "No inq not found"}), { status: 400 });
    }
    const deletedInquiry = await db.delete(inqdtTable).where(eq(inqdtTable.inqNo, noInquiry));
    //bisa juga : const deletedUser = await User.findByIdAndDelete(userId) // kalau dua kriteria misal ( { _id: uerId, category: categoryId })
    if (!deletedInquiry) {
        return new NextResponse(JSON.stringify({ message: "No inq not found"}), { status: 400 });
    }
    return new NextResponse( JSON.stringify({ message: "No inq is deleted", user: deletedInquiry }), { status: 200 })
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: "Error in deleting no inq"}), { status : 500 })
    }
}




