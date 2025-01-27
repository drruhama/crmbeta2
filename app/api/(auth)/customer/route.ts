import { customerTable, jadwalvisitTable, salesTable } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { eq, and, isNull } from "drizzle-orm";
import { date } from "drizzle-orm/pg-core";
import { error } from "console";
import { sql } from "drizzle-orm";

export const GET = async ( request: Request ) => { 
    const { searchParams } = new URL(request.url);
    const kodeCustomer = searchParams.get("kodeCustomer");
    if (kodeCustomer) {
        try {
            const custbycode = await db.select().from(customerTable).where(and(eq(customerTable.custCode, kodeCustomer), isNull(customerTable.deletedAt)));
            return new NextResponse(JSON.stringify(custbycode), { status: 200});
        } catch (err: any) {
        return new NextResponse("Error in fetching customer data" + err.message, {
            status: 500,
        });      
        } 
    }
    try {
            const allCust = await db.select().from(customerTable).where(isNull(customerTable.deletedAt));
            return new NextResponse(JSON.stringify(allCust), { status: 200});
    } catch (err: any) {
        return new NextResponse("Error in fetching customer data" + err.message, {
            status: 500,
        });      
    }
};

export const POST = async ( request: Request) => { 
    try {
  const body = await request.json();
  const newCust = await db.insert(customerTable).values(body);
  return new NextResponse(
    JSON.stringify({ message: "Customer is created", user: newCust }),
    { status: 200 }
   )        
} catch (error: any) {
    console.log(error.message)
    return new NextResponse("Error in creating customer" + error.message, {
        status: 500,
    });
}
};

export const PATCH = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const kodeCustomer = searchParams.get("kodeCustomer");
        const body = await request.json();
        const { 
            fullName,
            tier,
            type,
            provinsi,
            kabKota,
            kecamatan,
            kelurahDs,
            alamat,
            lat,
            longi,
            phone1,
            phone2,
            email,
            kdFoto,
            foto,
            note,
            remark,
            berkas,
            target,
            registeredBy,
            approve,
            custAsign,
            deletedAt } = body;
       
        if (!kodeCustomer) {
            return new NextResponse (
                JSON.stringify({ message: "Customer Code not found"}),
                { status: 400 }
            );
        }
        
        if (deletedAt) {
            const deletedCust = await db
      .update(customerTable)
      .set({ 
        deletedAt: sql `NOW()` })
      .where(eq(customerTable.custCode, kodeCustomer));

        if (!deletedCust) {
            return new NextResponse(JSON.stringify({ message: "Failed, delete customer"}), { status: 400 })
        }
        return new NextResponse(JSON.stringify({ message: "Customer data is deleted" }), { status: 200 });
        }

        const updatedCustomer = await db
      .update(customerTable)
      .set({ 
        fullName,
        tier,
        type,
        provinsi,
        kabKota,
        kecamatan,
        kelurahDs,
        alamat,
        lat,
        longi,
        phone1,
        phone2,
        email,
        kdFoto,
        foto,
        note,
        remark,
        berkas,
        target,
        registeredBy,
        approve,
        custAsign,
        deletedAt
       })
      .where(eq(customerTable.custCode, kodeCustomer));

        if (!updatedCustomer) {
            console.log(error)
            return new NextResponse(JSON.stringify({ message: "Failed, update customer"}), { status: 400 })
        }
        return new NextResponse(JSON.stringify({ message: "Customer data is updated" }), { status: 200 });
    } catch (error) {
        console.log (error)
        return new NextResponse(JSON.stringify({ message: "Error in updating customer data"}), { status: 500, });
    }
}

export const DELETE = async ( request: Request) => {
    // bisa juga kalau di folder api ditambah folder [userId] maka codenya berubah: export const DELETE = async (request: Request, context: { params: any }) => {
    try {
    const { searchParams } = new URL(request.url);
    const kodeCustomer = searchParams.get("kodeCustomer");
    //bisa juga kalau di folder api ditambah folder [userId] maka codenya berubah: const userId = context.params.userId;
    if (!kodeCustomer) {
        return new NextResponse(JSON.stringify({ message: "Customr Code not found"}), { status: 400 });
    }
    const deletedCust = await db.delete(customerTable).where(eq(customerTable.custCode, kodeCustomer));
    //bisa juga : const deletedUser = await User.findByIdAndDelete(userId) // kalau dua kriteria misal ( { _id: uerId, category: categoryId })
    if (!deletedCust) {
        return new NextResponse(JSON.stringify({ message: "Customer not found"}), { status: 400 });
    }
    return new NextResponse( JSON.stringify({ message: "Customer is deleted", user: deletedCust }), { status: 200 })
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: "Error in deleting customer data"}), { status : 500 })
    }
}

