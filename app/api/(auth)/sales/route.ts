import { salesTable } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { ilike, sql, eq, and, or, isNull } from "drizzle-orm";
import { date } from "drizzle-orm/pg-core";
import { error } from "console";

export const GET = async ( request: Request ) => { 
    const { searchParams } = new URL(request.url);
    const userName = searchParams.get("userName");
    const kodeSales = searchParams.get("kodeSales");

    
    if (userName) {
        try {
            const salesbycode = await db.select().from(salesTable).where(and(or(ilike(salesTable.userName, "%"+userName+"%"), ilike(salesTable.salesName, "%"+userName+"%")), isNull(salesTable.deletedAt)));;
            return new NextResponse(JSON.stringify(salesbycode), { status: 200});
        } catch (err: any) {
        return new NextResponse("Error in fetching salesmen data" + err.message, {
            status: 500,
        });      
        } 
    }
    if (kodeSales) {
        try {
            const salesbycode = await db.select().from(salesTable).where(and(eq(salesTable.salesCode, kodeSales), isNull(salesTable.deletedAt)));;
            return new NextResponse(JSON.stringify(salesbycode), { status: 200});
        } catch (err: any) {
        return new NextResponse("Error in fetching salesmen data" + err.message, {
            status: 500,
        });      
        } 
    }
    try {
            const allSales = await db.select().from(salesTable).where(isNull(salesTable.deletedAt));
            return new NextResponse(JSON.stringify(allSales), { status: 200});
    } catch (err: any) {
        return new NextResponse("Error in fetching salesmen data" + err.message, {
            status: 500,
        });      
    }
};

export const POST = async ( request: Request) => { 
    try {
  const body = await request.json();
  const newSales = await db.insert(salesTable).values(body);
  return new NextResponse(
    JSON.stringify({ message: "Salesman is created", user: newSales }),
    { status: 200 }
   )        
} catch (error: any) {
    return new NextResponse("Error in creating a salesman" + error.message, {
        status: 500,
    });
}
};

export const PATCH = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const kodeSales = searchParams.get("kodeSales");
        const body = await request.json();
        const { 
            userName,
            salesName,
            jabatan,
            alamatDomisili,
            alamatKtr,
            cabang,
            area,
            foto,
            note, deletedAt } = body;
       
        if (!kodeSales) {
            return new NextResponse (
                JSON.stringify({ message: "Sales Code not found"}),
                { status: 400 }
            );
        }
        
        if (deletedAt) {
            const deletedSales = await db
      .update(salesTable)
      .set({ 
        deletedAt: sql `NOW()` })
      .where(eq(salesTable.salesCode, kodeSales));

        if (!deletedSales) {
            return new NextResponse(JSON.stringify({ message: "Failed, delete salesman"}), { status: 400 })
        }
        return new NextResponse(JSON.stringify({ message: "Salesman data is deleted" }), { status: 200 });
        }

        const updatedSales = await db
      .update(salesTable)
      .set({ userName,
       // password,
        salesName,
        jabatan,
        alamatDomisili,
        alamatKtr,
        cabang,
        area,
        foto,
        note 
       })
      .where(eq(salesTable.salesCode, kodeSales));

        if (!updatedSales) {
            console.log(error)
            return new NextResponse(JSON.stringify({ message: "Failed, update salesman"}), { status: 400 })
        }
        return new NextResponse(JSON.stringify({ message: "Salesman data is updated" }), { status: 200 });
    } catch (error) {
        console.log (error)
        return new NextResponse(JSON.stringify({ message: "Error in updating salesman"}), { status: 500, });
    }
}

export const DELETE = async ( request: Request) => {
    // bisa juga kalau di folder api ditambah folder [userId] maka codenya berubah: export const DELETE = async (request: Request, context: { params: any }) => {
    try {
    const { searchParams } = new URL(request.url);
    const kodeSales = searchParams.get("kodeSales");
    //bisa juga kalau di folder api ditambah folder [userId] maka codenya berubah: const userId = context.params.userId;
    if (!kodeSales) {
        return new NextResponse(JSON.stringify({ message: "Sales Code not found"}), { status: 400 });
    }
    const deletedSales = await db.delete(salesTable).where(eq(salesTable.salesCode, kodeSales));
    //bisa juga : const deletedUser = await User.findByIdAndDelete(userId) // kalau dua kriteria misal ( { _id: uerId, category: categoryId })
    if (!deletedSales) {
        return new NextResponse(JSON.stringify({ message: "Sales not found"}), { status: 400 });
    }
    return new NextResponse( JSON.stringify({ message: "Sales is deleted", user: deletedSales }), { status: 200 })
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: "Error in deleting sales"}), { status : 500 })
    }
}

/*
export const FIND = async ( request: Request) => { 
    try {
        const { searchParams } = new URL(request.url);
        const kodeSales = searchParams.get("kodeSales");
    //bisa juga kalau di folder api ditambah folder [userId] maka codenya berubah: const userId = context.params.userId;
    if (!kodeSales) {
        return new NextResponse(JSON.stringify({ message: "Sales Code not found"}), { status: 400 });
    }
            const allSales = await db.select().from(salesTable).where(and(eq(salesTable.salesCode, kodeSales), isNull(salesTable.deletedAt)));
            return new NextResponse(JSON.stringify(allSales), { status: 200});
    } catch (err: any) {
        return new NextResponse("Error in fetching salesmen data" + err.message, {
            status: 500,
        });      
    }
};
*/