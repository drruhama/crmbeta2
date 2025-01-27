import {pocustdTable, pocusthTable, projectTable} from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { ilike, sql, eq, and, or, isNull } from "drizzle-orm";
import { date } from "drizzle-orm/pg-core";
import { error } from "console";


export const POST = async ( request: Request) => { 
    try {
  const body = await request.json();
  const newPo = await db.insert(pocusthTable).values(body);
 // const newVisit = await db.insert(kunjunganTable).values(body);
 // const newProject = await db.insert(projectTable).values(body);
  return new NextResponse(
    JSON.stringify({ message: "PO is created", po: newPo}),
    { status: 200 }
   )        
} catch (error: any) {
    return new NextResponse("Error in creating PO : " + error.message, {
        status: 500,
    });
}
};


export const PATCH = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const kodePo = searchParams.get("poCode");
        const body = await request.json();
        const { 
            namaPo,
            nomorPo,
            tglPo,
            payment,
            delivery,
            namaPic,
            jabatanPic,
            noKontak,
            kodeProyek, 
            note, 
            remark,
            noSO,
            discount, 
            vat } = body;
       
        if (!kodePo) {
            return new NextResponse (
                JSON.stringify({ message: "PO Code not found"}),
                { status: 400 }
            );
        }
        
        const updatedPo = await db
        .update(pocusthTable)
        .set({ 
            namaPo,
            nomorPo,
            tglPo,
            payment,
            delivery,
            namaPic,
            jabatanPic,
            noKontak,
            kodeProyek, 
            note, 
            remark,
            noSO,
            discount, 
            vat 
         })
        .where(eq(pocusthTable.poCode, kodePo));
  
          if (!updatedPo) {
              console.log(error)
              return new NextResponse(JSON.stringify({ message: "Failed, update PO"}), { status: 400 })
          }
          return new NextResponse(JSON.stringify({ message: "PO is updated" }), { status: 200 });
      } catch (error) {
          console.log (error)
          return new NextResponse(JSON.stringify({ message: "Error in updating PO"}), { status: 500, });
      }
}

export const DELETE = async ( request: Request) => {
    // bisa juga kalau di folder api ditambah folder [userId] maka codenya berubah: export const DELETE = async (request: Request, context: { params: any }) => {
    try {
    const { searchParams } = new URL(request.url);
    const kodePo = searchParams.get("poCode");
    //bisa juga kalau di folder api ditambah folder [userId] maka codenya berubah: const userId = context.params.userId;
    if (!kodePo) {
        return new NextResponse(JSON.stringify({ message: "PO Code not found"}), { status: 400 });
    }
    const deletedPO1 = await db.delete(pocustdTable).where(eq(pocustdTable.poCode, kodePo));
    const deletedPO2 = await db.delete(pocusthTable).where(eq(pocusthTable.poCode, kodePo));
    //bisa juga : const deletedUser = await User.findByIdAndDelete(userId) // kalau dua kriteria misal ( { _id: uerId, category: categoryId })
    if (!deletedPO1) {
        return new NextResponse(JSON.stringify({ message: "PO detail not found"}), { status: 400 });
    }
    if (!deletedPO2) {
        return new NextResponse(JSON.stringify({ message: "PO header not found"}), { status: 400 });
    }
    return new NextResponse( JSON.stringify({ message: "PO is deleted", user: deletedPO2 }), { status: 200 })
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: "Error in deleting po"}), { status : 500 })
    }
}

