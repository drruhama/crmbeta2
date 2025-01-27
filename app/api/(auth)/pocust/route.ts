import { canvasTable, inqheadTable, pocusthTable, salesTable } from "@/db/schema";
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
            const pobycode = await db.select().from(pocusthTable).where (and(eq(pocusthTable.userName, username), isNull(pocusthTable.deletedAt)));
            return new NextResponse(JSON.stringify(pobycode), { status: 200});
        } catch (err: any) {
        return new NextResponse("Error in fetching po data" + err.message, {
            status: 500,
        });      
        } 
    }
    try {
            const allPO = await db.select().from(pocusthTable).where(isNull(pocusthTable.deletedAt));
            return new NextResponse(JSON.stringify(allPO), { status: 200});
    } catch (err: any) {
        return new NextResponse("Error in fetching PO data" + err.message, {
            status: 500,
        });      
    }
};

export const POST = async ( request: Request) => { 
    try {
  const body = await request.json();
  const newPO = await db.insert(pocusthTable).values(body);
  return new NextResponse(
    JSON.stringify({ message: "PO data is created", user: newPO }),
    { status: 200 }
   )        
} catch (error: any) {
    return new NextResponse("Error in creating PO" + error.message, {
        status: 500,
    });
}
};

export const PATCH = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const kodePO = searchParams.get("kodePO");
        const body = await request.json();
        const {
    tglPo,
    payment,
    delivery,
    namaPic,
    jabatanPic,
    noKontak,
    note,
    approval,
    approveAt,
    noSO,
    discount,
    vat,
    total,
    remark,
    status,
    berkas,
    deletedAt } = body;
       
        if (!kodePO) {
            return new NextResponse (
                JSON.stringify({ message: "PO Code not found"}),
                { status: 400 }
            );
        }

        if (approval==='yes') {
            const approvedPO = await db
      .update(pocusthTable)
      .set({ 
        approveAt: sql `NOW()` })
      .where(eq(pocusthTable.poCode, kodePO));

        if (!approvedPO) {
            return new NextResponse(JSON.stringify({ message: "Failed, approve PO"}), { status: 400 })
        }
        return new NextResponse(JSON.stringify({ message: "PO data is approved" }), { status: 200 });
        }

        if (deletedAt) {
            const deletedPO = await db
      .update(pocusthTable)
      .set({ 
        deletedAt: sql `NOW()` })
      .where(eq(pocusthTable.poCode, kodePO));

        if (!deletedPO) {
            return new NextResponse(JSON.stringify({ message: "Failed, delete po"}), { status: 400 })
        }
        return new NextResponse(JSON.stringify({ message: "PO data is deleted" }), { status: 200 });
        }

        const updatedPO = await db
      .update(pocusthTable)
      .set({  
        tglPo,
        payment,
        delivery,
        namaPic,
        jabatanPic,
        noKontak,
        note,
        noSO,
        discount,
        vat,
        total,
        remark,
        status,
        berkas
       })
      .where(eq(pocusthTable.poCode, kodePO));
        
        if (!updatedPO) {
            console.log(error)
            return new NextResponse(JSON.stringify({ message: "Failed, update PO"}), { status: 400 })
        }
        return new NextResponse(JSON.stringify({ message: "PO data is updated" }), { status: 200 });
    } catch (error) {
        console.log (error)
        return new NextResponse(JSON.stringify({ message: "Error in updating PO"}), { status: 500, });
    }
}

export const DELETE = async ( request: Request) => {
    // bisa juga kalau di folder api ditambah folder [userId] maka codenya berubah: export const DELETE = async (request: Request, context: { params: any }) => {
    try {
    const { searchParams } = new URL(request.url);
    const kodePO = searchParams.get("kodePO");
    //bisa juga kalau di folder api ditambah folder [userId] maka codenya berubah: const userId = context.params.userId;
    if (!kodePO) {
        return new NextResponse(JSON.stringify({ message: "PO Code not found"}), { status: 400 });
    }
    const deletedPO = await db.delete(pocusthTable).where(eq(pocusthTable.poCode, kodePO));
    //bisa juga : const deletedUser = await User.findByIdAndDelete(userId) // kalau dua kriteria misal ( { _id: uerId, category: categoryId })
    if (!deletedPO) {
        return new NextResponse(JSON.stringify({ message: "PO not found"}), { status: 400 });
    }
    return new NextResponse( JSON.stringify({ message: "PO is deleted", user: deletedPO }), { status: 200 })
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: "Error in deleting PO"}), { status : 500 })
    }
}

