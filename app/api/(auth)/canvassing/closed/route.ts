import { canvasTable, salesTable } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { ilike, sql, eq, and, or, isNull } from "drizzle-orm";
import { date } from "drizzle-orm/pg-core";
import { error } from "console";

export const GET = async ( request: Request ) => { 
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username")
    //const kodeSales = searchParams.get("kodeSales");
    
    if (username) {
        try {
            const canvasbycode = await db.select().from(canvasTable).where (and(and(eq(canvasTable.userName, username), isNull(canvasTable.deletedAt)), eq(canvasTable.status, "closed")));
            return new NextResponse(JSON.stringify(canvasbycode), { status: 200});
        } catch (err: any) {
        return new NextResponse("Error in fetching canvass data" + err.message, {
            status: 500,
        });      
        } 
    }
    try {
            const allCanvass = await db.select().from(canvasTable).where(isNull(canvasTable.deletedAt));
            return new NextResponse(JSON.stringify(allCanvass), { status: 200});
    } catch (err: any) {
        return new NextResponse("Error in fetching canvass data" + err.message, {
            status: 500,
        });      
    }
};

export const POST = async ( request: Request) => { 
    try {
  const body = await request.json();
  const newCanvas = await db.insert(canvasTable).values(body);
  return new NextResponse(
    JSON.stringify({ message: "Canvass data is created", user: newCanvas }),
    { status: 200 }
   )        
} catch (error: any) {
    return new NextResponse("Error in creating a canvass" + error.message, {
        status: 500,
    });
}
};

export const PATCH = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const kodeCanvas = searchParams.get("canvasCode");
        const body = await request.json();
        const { 
            tglCanvas,
            metode,
            namaPic,
            jabatanPic,
            noKontak,
            note,
            status, deletedAt } = body;
       
        if (!kodeCanvas) {
            return new NextResponse (
                JSON.stringify({ message: "Canvass Code not found"}),
                { status: 400 }
            );
        }
        
        if (deletedAt) {
            const deletedCanvass = await db
      .update(canvasTable)
      .set({ 
        deletedAt: sql `NOW()` })
      .where(eq(canvasTable.canvasCode, kodeCanvas));

        if (!deletedCanvass) {
            return new NextResponse(JSON.stringify({ message: "Failed, delete canvass"}), { status: 400 })
        }
        return new NextResponse(JSON.stringify({ message: "Canvass data is deleted" }), { status: 200 });
        }

        const updatedCanvas = await db
      .update(canvasTable)
      .set({ tglCanvas,
        metode,
        namaPic,
        jabatanPic,
        noKontak,
        note,
        status
       })
      .where(eq(canvasTable.canvasCode, kodeCanvas));

        if (!updatedCanvas) {
            console.log(error)
            return new NextResponse(JSON.stringify({ message: "Failed, update canvass"}), { status: 400 })
        }
        return new NextResponse(JSON.stringify({ message: "Canvass data is updated" }), { status: 200 });
    } catch (error) {
        console.log (error)
        return new NextResponse(JSON.stringify({ message: "Error in updating canvass"}), { status: 500, });
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

