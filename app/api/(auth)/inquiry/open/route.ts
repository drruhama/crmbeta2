import { canvasTable, inqheadTable, salesTable } from "@/db/schema";
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
            const inqbycode = await db.select().from(inqheadTable).where (and(and(eq(inqheadTable.userName, username), isNull(inqheadTable.deletedAt)),isNull(inqheadTable.status)));
            return new NextResponse(JSON.stringify(inqbycode), { status: 200});
        } catch (err: any) {
        return new NextResponse("Error in fetching inquiry data" + err.message, {
            status: 500,
        });      
        } 
    }
    try {
            const allInquiry = await db.select().from(inqheadTable).where(isNull(inqheadTable.deletedAt));
            return new NextResponse(JSON.stringify(allInquiry), { status: 200});
    } catch (err: any) {
        return new NextResponse("Error in fetching inquiry data" + err.message, {
            status: 500,
        });      
    }
};

export const POST = async ( request: Request) => { 
    try {
  const body = await request.json();
  const newInquiry = await db.insert(inqheadTable).values(body);
  return new NextResponse(
    JSON.stringify({ message: "Inquiry data is created", user: newInquiry }),
    { status: 200 }
   )        
} catch (error: any) {
    return new NextResponse("Error in creating an inquiry" + error.message, {
        status: 500,
    });
}
};

export const PATCH = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const kodeInquiry = searchParams.get("kodeInquiry");
        const body = await request.json();
        const {
            tglInq,
            custCd,
            namaPic,
            jabatanPic,
            noKontak,
            note,
            status,
            deletedAt } = body;
       
        if (!kodeInquiry) {
            return new NextResponse (
                JSON.stringify({ message: "Inquiry Code not found"}),
                { status: 400 }
            );
        }
        
        if (deletedAt) {
            const deletedInquiry = await db
      .update(inqheadTable)
      .set({ 
        deletedAt: sql `NOW()` })
      .where(eq(inqheadTable.inqCode, kodeInquiry));

        if (!deletedInquiry) {
            return new NextResponse(JSON.stringify({ message: "Failed, delete inquiry"}), { status: 400 })
        }
        return new NextResponse(JSON.stringify({ message: "Inquiry data is deleted" }), { status: 200 });
        }

        const updatedInquiry = await db
      .update(inqheadTable)
      .set({ tglInq,
        custCd,
        namaPic,
        jabatanPic,
        noKontak,
        note,
        status,
       })
      .where(eq(inqheadTable.inqCode, kodeInquiry));

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
    const kodeInquiry = searchParams.get("kodeInquiry");
    //bisa juga kalau di folder api ditambah folder [userId] maka codenya berubah: const userId = context.params.userId;
    if (!kodeInquiry) {
        return new NextResponse(JSON.stringify({ message: "Inquiry Code not found"}), { status: 400 });
    }
    const deletedInquriy = await db.delete(inqheadTable).where(eq(inqheadTable.inqCode, kodeInquiry));
    //bisa juga : const deletedUser = await User.findByIdAndDelete(userId) // kalau dua kriteria misal ( { _id: uerId, category: categoryId })
    if (!deletedInquriy) {
        return new NextResponse(JSON.stringify({ message: "Inquiry not found"}), { status: 400 });
    }
    return new NextResponse( JSON.stringify({ message: "Inquiry is deleted", user: deletedInquriy }), { status: 200 })
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: "Error in deleting inquiry"}), { status : 500 })
    }
}

