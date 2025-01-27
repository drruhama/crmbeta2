import {quoteheadTable, projectTable, quotedtTable} from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { ilike, sql, eq, and, or, isNull } from "drizzle-orm";
import { date } from "drizzle-orm/pg-core";
import { error } from "console";


export const POST = async ( request: Request) => { 
    try {
  const body = await request.json();
  const newQuote = await db.insert(quoteheadTable).values(body);
 // const newVisit = await db.insert(kunjunganTable).values(body);
 // const newProject = await db.insert(projectTable).values(body);
  return new NextResponse(
    JSON.stringify({ message: "Quote data is created", inquiry: newQuote}),
    { status: 200 }
   )        
} catch (error: any) {
    return new NextResponse("Error in creating a quotation : " + error.message, {
        status: 500,
    });
}
};

export const PATCH = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const kodeQuo = searchParams.get("quoCode");
        const body = await request.json();
        const { 
            namaPic,
            jabatanPic,
            noKontak,
            kodeProyek, 
            note, 
            discount, 
            vat } = body;
       
        if (!kodeQuo) {
            return new NextResponse (
                JSON.stringify({ message: "Quotation Code not found"}),
                { status: 400 }
            );
        }
        
        const updatedQuotation = await db
        .update(quoteheadTable)
        .set({ 
          namaPic,
          jabatanPic,
          noKontak,
          note,
          kodeProyek,
          discount, 
          vat
         })
        .where(eq(quoteheadTable.quoteCode, kodeQuo));
  
          if (!updatedQuotation) {
              console.log(error)
              return new NextResponse(JSON.stringify({ message: "Failed, update quotation"}), { status: 400 })
          }
          return new NextResponse(JSON.stringify({ message: "Quote is updated" }), { status: 200 });
      } catch (error) {
          console.log (error)
          return new NextResponse(JSON.stringify({ message: "Error in updating quotation"}), { status: 500, });
      }
}

export const DELETE = async ( request: Request) => {
    // bisa juga kalau di folder api ditambah folder [userId] maka codenya berubah: export const DELETE = async (request: Request, context: { params: any }) => {
    try {
    const { searchParams } = new URL(request.url);
    const kodeQuo = searchParams.get("quoCode");
    //bisa juga kalau di folder api ditambah folder [userId] maka codenya berubah: const userId = context.params.userId;
    if (!kodeQuo) {
        return new NextResponse(JSON.stringify({ message: "Quotation Code not found"}), { status: 400 });
    }
    const deletedQuotation1 = await db.delete(quotedtTable).where(eq(quotedtTable.quoteCode, kodeQuo));
    const deletedQuotation2 = await db.delete(quoteheadTable).where(eq(quoteheadTable.quoteCode, kodeQuo));
    //bisa juga : const deletedUser = await User.findByIdAndDelete(userId) // kalau dua kriteria misal ( { _id: uerId, category: categoryId })
    if (!deletedQuotation1) {
        return new NextResponse(JSON.stringify({ message: "Quotation detail not found"}), { status: 400 });
    }
    if (!deletedQuotation2) {
        return new NextResponse(JSON.stringify({ message: "Quotation header not found"}), { status: 400 });
    }
    return new NextResponse( JSON.stringify({ message: "Quotation is deleted", user: deletedQuotation2 }), { status: 200 })
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: "Error in deleting quotation"}), { status : 500 })
    }
}

//sudah semua