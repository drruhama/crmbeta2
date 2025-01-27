import {inqdtTable, inqheadTable, projectTable} from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { ilike, sql, eq, and, or, isNull } from "drizzle-orm";
import { date } from "drizzle-orm/pg-core";
import { error } from "console";


export const POST = async ( request: Request) => { 
    try {
  const body = await request.json();
  const newInquiry = await db.insert(inqheadTable).values(body);
 // const newVisit = await db.insert(kunjunganTable).values(body);
 // const newProject = await db.insert(projectTable).values(body);
  return new NextResponse(
    JSON.stringify({ message: "Inquiry data is created", inquiry: newInquiry}),
    { status: 200 }
   )        
} catch (error: any) {
    return new NextResponse("Error in creating an inquiry : " + error.message, {
        status: 500,
    });
}
};


export const PATCH = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const kodeInq = searchParams.get("inqCode");
        const body = await request.json();
        const { 
            namaPic,
            jabatanPic,
            noKontak,
            kodeProyek, 
            note } = body;
       
        if (!kodeInq) {
            return new NextResponse (
                JSON.stringify({ message: "Inquiry Code not found"}),
                { status: 400 }
            );
        }
        
        const updatedInquiry = await db
        .update(inqheadTable)
        .set({ 
          namaPic,
          jabatanPic,
          noKontak,
          note,
          kodeProyek
         })
        .where(eq(inqheadTable.inqCode, kodeInq));
  
          if (!updatedInquiry) {
              console.log(error)
              return new NextResponse(JSON.stringify({ message: "Failed, update inquiry"}), { status: 400 })
          }
          return new NextResponse(JSON.stringify({ message: "Inquiry data is updated" }), { status: 200 });
      } catch (error) {
          console.log (error)
          return new NextResponse(JSON.stringify({ message: "Error in updating inquiry"}), { status: 500, });
      }
}


export const DELETE = async ( request: Request) => {
    // bisa juga kalau di folder api ditambah folder [userId] maka codenya berubah: export const DELETE = async (request: Request, context: { params: any }) => {
    try {
    const { searchParams } = new URL(request.url);
    const kodeInq = searchParams.get("inqCode");
    //bisa juga kalau di folder api ditambah folder [userId] maka codenya berubah: const userId = context.params.userId;
    if (!kodeInq) {
        return new NextResponse(JSON.stringify({ message: "Inquiry Code not found"}), { status: 400 });
    }
    const deletedInquiry1 = await db.delete(inqdtTable).where(eq(inqdtTable.inqCode, kodeInq));
    const deletedInquiry2 = await db.delete(inqheadTable).where(eq(inqheadTable.inqCode, kodeInq));
    //bisa juga : const deletedUser = await User.findByIdAndDelete(userId) // kalau dua kriteria misal ( { _id: uerId, category: categoryId })
    if (!deletedInquiry1) {
        return new NextResponse(JSON.stringify({ message: "Inquiry detail not found"}), { status: 400 });
    }
    if (!deletedInquiry2) {
        return new NextResponse(JSON.stringify({ message: "Inquiry header not found"}), { status: 400 });
    }
    return new NextResponse( JSON.stringify({ message: "Inquiry is deleted", user: deletedInquiry2 }), { status: 200 })
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: "Error in deleting inquiry"}), { status : 500 })
    }
}

//sudah semua

