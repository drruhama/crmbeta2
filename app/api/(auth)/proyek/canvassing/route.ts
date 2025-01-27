import { canvasTable, kunjunganTable, projectTable, salesTable } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { ilike, sql, eq, and, or, isNull } from "drizzle-orm";
import { date } from "drizzle-orm/pg-core";
import { error } from "console";


export const POST = async ( request: Request) => { 
    try {
  const body = await request.json();
  const newCanvas = await db.insert(canvasTable).values(body);
 // const newVisit = await db.insert(kunjunganTable).values(body);
 // const newProject = await db.insert(projectTable).values(body);
  return new NextResponse(
    JSON.stringify({ message: "Canvass data is created", canvass: newCanvas}),
    { status: 200 }
   )        
} catch (error: any) {
    return new NextResponse("Error in creating a canvass data : " + error.message, {
        status: 500,
    });
}
};

export const PATCH = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const kodeCanvas = searchParams.get("kodeCanvas");
        const body = await request.json();
        const { 
            metode,
            tujuan,
            hasil,
            custCd,
            namaPic,
            jabatanPic,
            noKontak,
            kodeProyek, 
            note } = body;
       
        if (!kodeCanvas) {
            return new NextResponse (
                JSON.stringify({ message: "Canvas Code not found"}),
                { status: 400 }
            );
        }
        
        const updatedCanvas = await db
        .update(canvasTable)
        .set({ 
            metode,
            tujuan,
            hasil,
            custCd,
            namaPic,
            jabatanPic,
            noKontak,
            kodeProyek, 
            note
         })
        .where(eq(canvasTable.canvasCode, kodeCanvas));
  
          if (!updatedCanvas) {
              console.log(error)
              return new NextResponse(JSON.stringify({ message: "Failed, update canvas"}), { status: 400 })
          }
          return new NextResponse(JSON.stringify({ message: "Canvas data is updated" }), { status: 200 });
      } catch (error) {
          console.log (error)
          return new NextResponse(JSON.stringify({ message: "Error in updating canvas"}), { status: 500, });
      }
}

export const DELETE = async ( request: Request) => {
    // bisa juga kalau di folder api ditambah folder [userId] maka codenya berubah: export const DELETE = async (request: Request, context: { params: any }) => {
    try {
    const { searchParams } = new URL(request.url);
    const kodeCanvas = searchParams.get("kodeCanvas");
    //bisa juga kalau di folder api ditambah folder [userId] maka codenya berubah: const userId = context.params.userId;
    if (!kodeCanvas) {
        return new NextResponse(JSON.stringify({ message: "Canvass Code not found"}), { status: 400 });
    }
    const deletedCanvass = await db.delete(canvasTable).where(eq(canvasTable.canvasCode, kodeCanvas));
    //bisa juga : const deletedUser = await User.findByIdAndDelete(userId) // kalau dua kriteria misal ( { _id: uerId, category: categoryId })
    if (!deletedCanvass) {
        return new NextResponse(JSON.stringify({ message: "Canvass not found"}), { status: 400 });
    }
    return new NextResponse( JSON.stringify({ message: "Canvass is deleted", user: deletedCanvass }), { status: 200 })
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: "Error in deleting canvass"}), { status : 500 })
    }
}

