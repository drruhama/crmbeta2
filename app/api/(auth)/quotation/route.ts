import { canvasTable, inqheadTable, quoteheadTable, salesTable } from "@/db/schema";
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
            const quotebycode = await db.select().from(quoteheadTable).where (and(eq(quoteheadTable.userName, username), isNull(quoteheadTable.deletedAt)));
            return new NextResponse(JSON.stringify(quotebycode), { status: 200});
        } catch (err: any) {
        return new NextResponse("Error in fetching quotation data" + err.message, {
            status: 500,
        });      
        } 
    }
    try {
            const allQuote = await db.select().from(quoteheadTable).where(isNull(quoteheadTable.deletedAt));
            return new NextResponse(JSON.stringify(allQuote), { status: 200});
    } catch (err: any) {
        return new NextResponse("Error in fetching quote data" + err.message, {
            status: 500,
        });      
    }
};

export const POST = async ( request: Request) => { 
    try {
  const body = await request.json();
  const newQuote = await db.insert(quoteheadTable).values(body);
  return new NextResponse(
    JSON.stringify({ message: "Quote data is created", user: newQuote }),
    { status: 200 }
   )        
} catch (error: any) {
    return new NextResponse("Error in creating a quotation" + error.message, {
        status: 500,
    });
}
};

export const PATCH = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const kodeQuotation = searchParams.get("kodeQuotation");
        const body = await request.json();
        const {
    tglQuote,
    custCd,
    namaPic,
    jabatanPic,
    noKontak,
    note,
    approval,
    approveAt,
    discount,
    vat,
    total, 
    deletedAt } = body;
       
        if (!kodeQuotation) {
            return new NextResponse (
                JSON.stringify({ message: "Quote Code not found"}),
                { status: 400 }
            );
        }

        if (approval==='yes') {
            const approvedQuote = await db
      .update(quoteheadTable)
      .set({ 
        approveAt: sql `NOW()` })
      .where(eq(quoteheadTable.quoteCode, kodeQuotation));

        if (!approvedQuote) {
            return new NextResponse(JSON.stringify({ message: "Failed, approve quotation"}), { status: 400 })
        }
        return new NextResponse(JSON.stringify({ message: "Quote data is approved" }), { status: 200 });
        }
        
        if (deletedAt) {
            const deletedQuote = await db
      .update(quoteheadTable)
      .set({ 
        deletedAt: sql `NOW()` })
      .where(eq(quoteheadTable.quoteCode, kodeQuotation));

        if (!deletedQuote) {
            return new NextResponse(JSON.stringify({ message: "Failed, delete quotation"}), { status: 400 })
        }
        return new NextResponse(JSON.stringify({ message: "Quote data is deleted" }), { status: 200 });
        }

        const updatedQuote = await db
      .update(quoteheadTable)
      .set({ tglQuote,
        custCd,
        namaPic,
        jabatanPic,
        noKontak,
        note,
        discount,
        vat,
        total, 
       })
      .where(eq(quoteheadTable.quoteCode, kodeQuotation));
        if (!updatedQuote) {
            console.log(error)
            return new NextResponse(JSON.stringify({ message: "Failed, update quote"}), { status: 400 })
        }
        return new NextResponse(JSON.stringify({ message: "Quote data is updated" }), { status: 200 });
        } catch (error) {
        console.log (error)
        return new NextResponse(JSON.stringify({ message: "Error in updating quote"}), { status: 500, });
        }
}

export const DELETE = async ( request: Request) => {
    // bisa juga kalau di folder api ditambah folder [userId] maka codenya berubah: export const DELETE = async (request: Request, context: { params: any }) => {
    try {
    const { searchParams } = new URL(request.url);
    const kodeQuotation = searchParams.get("kodeQuotation");
    //bisa juga kalau di folder api ditambah folder [userId] maka codenya berubah: const userId = context.params.userId;
    if (!kodeQuotation) {
        return new NextResponse(JSON.stringify({ message: "Quote Code not found"}), { status: 400 });
    }
    const deletedQuote = await db.delete(quoteheadTable).where(eq(quoteheadTable.quoteCode, kodeQuotation));
    //bisa juga : const deletedUser = await User.findByIdAndDelete(userId) // kalau dua kriteria misal ( { _id: uerId, category: categoryId })
    if (!deletedQuote) {
        return new NextResponse(JSON.stringify({ message: "Quote not found"}), { status: 400 });
    }
    return new NextResponse( JSON.stringify({ message: "Quote is deleted", user: deletedQuote }), { status: 200 })
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: "Error in deleting quote"}), { status : 500 })
    }
}

