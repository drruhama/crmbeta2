import {pocustdTable, projectTable} from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { ilike, sql, eq, and, or, isNull } from "drizzle-orm";
import { date } from "drizzle-orm/pg-core";
import { error } from "console";


export const POST = async ( request: Request) => { 
    try {
  const body = await request.json();
  const newPO = await db.insert(pocustdTable).values(body);
 // const newVisit = await db.insert(kunjunganTable).values(body);
 // const newProject = await db.insert(projectTable).values(body);
  return new NextResponse(
    JSON.stringify({ message: "PO's product is created", PO: newPO}),
    { status: 200 }
   )        
} catch (error: any) {
    return new NextResponse("Error in creating product PO : " + error.message, {
        status: 500,
    });
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


