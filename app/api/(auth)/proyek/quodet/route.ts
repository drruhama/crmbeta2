import {quotedtTable, projectTable} from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { ilike, sql, eq, and, or, isNull } from "drizzle-orm";
import { date } from "drizzle-orm/pg-core";
import { error } from "console";


export const POST = async ( request: Request) => { 
    try {
  const body = await request.json();
  const newQuote = await db.insert(quotedtTable).values(body);
 // const newVisit = await db.insert(kunjunganTable).values(body);
 // const newProject = await db.insert(projectTable).values(body);
  return new NextResponse(
    JSON.stringify({ message: "Quotation's product is created", quote: newQuote}),
    { status: 200 }
   )        
} catch (error: any) {
    return new NextResponse("Error in creating detail quotation : " + error.message, {
        status: 500,
    });
}
};

//baru sampai diatas

export const PATCH = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const kodeProyek = searchParams.get("kodeProyek");
        const body = await request.json();
        const { 
           deletedAt } = body;
       
        if (!kodeProyek) {
            return new NextResponse (
                JSON.stringify({ message: "Project Code not found"}),
                { status: 400 }
            );
        }
        
        if (deletedAt) {
            const deletedProject = await db
      .update(projectTable)
      .set({ 
        closedAt: sql `NOW()` })
      .where(eq(projectTable.kodeProyek, kodeProyek));

        if (!deletedProject) {
            return new NextResponse(JSON.stringify({ message: "Failed, delete project"}), { status: 400 })
        }
        return new NextResponse(JSON.stringify({ message: "Project data is deleted" }), { status: 200 });
        }
    } catch (error) {
        console.log (error)
        return new NextResponse(JSON.stringify({ message: "Error in delete project"}), { status: 500, });
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

