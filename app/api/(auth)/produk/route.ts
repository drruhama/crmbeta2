import { canvasTable, inqdtTable, inqheadTable, pocustdTable, produkTable, salesTable } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { ilike, sql, eq, and, or, isNull } from "drizzle-orm";
import { date } from "drizzle-orm/pg-core";
import { error } from "console";

export const GET = async ( request: Request ) => { 
    const { searchParams } = new URL(request.url);
    const kodeBrg = searchParams.get("kodeBrg")
    //const kodeSales = searchParams.get("kodeSales");
    
    if (kodeBrg) {
        try {
            const produkbycode = await db.select().from(produkTable).where (and(and(eq(produkTable.kodeBarang, kodeBrg), isNull(produkTable.deletedAt)),eq(produkTable.status,"active")));
            return new NextResponse(JSON.stringify(produkbycode), { status: 200});
        } catch (err: any) {
        return new NextResponse("Error in fetching Produk data" + err.message, {
            status: 500,
        });      
        } 
    }
    try {
        const allProduk = await db.select().from(produkTable).where(and(eq(produkTable.status,"active"), isNull(produkTable.deletedAt)));
        return new NextResponse(JSON.stringify(allProduk), { status: 200});
} catch (err: any) {
    return new NextResponse("Error in fetching Produk data" + err.message, {
        status: 500,
    });      
}
};

export const POST = async ( request: Request) => { 
try {
const body = await request.json();
const newProduk = await db.insert(produkTable).values(body);
return new NextResponse(
JSON.stringify({ message: "Produk data is created", user: newProduk }),
{ status: 200 }
)        
} catch (error: any) {
return new NextResponse("Error in creating Produk" + error.message, {
    status: 500,
});
}
};

export const PATCH = async (request: Request) => {
try {
    const { searchParams } = new URL(request.url);
    const kodeBrg = searchParams.get("kodeBrg");
    const body = await request.json();
    const {
        namaBarang,
        hargaBarang,
        hargaJual,
        hargaModal,
        hargaBeli,
        status,
        newCode,
        group,
        category,
        weight,
        foto,
        note,
        remark,
        deletedAt } = body;
   
    if (!kodeBrg) {
        return new NextResponse (
            JSON.stringify({ message: "Product Code not found"}),
            { status: 400 }
        );
    }

    if (status==="inactive") {
        const deactivateProduk = await db
        .update(produkTable)
        .set({ 
          status: "inactive" })
        .where(eq(produkTable.kodeBarang, kodeBrg));
      
          if (!deactivateProduk) {
              return new NextResponse(JSON.stringify({ message: "Failed, deactivate produk"}), { status: 400 })
          }
          return new NextResponse(JSON.stringify({ message: "Produk data is inactive" }), { status: 200 });
    }

    if (deletedAt) {
        const deletedProduk = await db
  .update(produkTable)
  .set({ 
    deletedAt: sql `NOW()` })
  .where(eq(produkTable.kodeBarang, kodeBrg));

    if (!deletedProduk) {
        return new NextResponse(JSON.stringify({ message: "Failed, delete produk"}), { status: 400 })
    }
    return new NextResponse(JSON.stringify({ message: "Produk data is deleted" }), { status: 200 });
    }

    const updatedProduk = await db
  .update(produkTable)
  .set({  
        namaBarang,
        hargaBarang,
        hargaJual,
        hargaModal,
        hargaBeli,
        status,
        newCode,
        group,
        category,
        weight,
        foto,
        note,
        remark,
   })
  .where(eq(produkTable.kodeBarang, kodeBrg));
    
    if (!updatedProduk) {
        return new NextResponse(JSON.stringify({ message: "Failed, update Produk"}), { status: 400 })
    }
    return new NextResponse(JSON.stringify({ message: "Produk data is updated" }), { status: 200 });
} catch (error) {
    console.log (error)
    return new NextResponse(JSON.stringify({ message: "Error in updating Produk"}), { status: 500, });
}
}

export const DELETE = async ( request: Request) => {
// bisa juga kalau di folder api ditambah folder [userId] maka codenya berubah: export const DELETE = async (request: Request, context: { params: any }) => {
try {
const { searchParams } = new URL(request.url);
const kodeBrg = searchParams.get("kodeBrg");
//bisa juga kalau di folder api ditambah folder [userId] maka codenya berubah: const userId = context.params.userId;
if (!kodeBrg) {
    return new NextResponse(JSON.stringify({ message: "Product Code not found"}), { status: 400 });
}
const deletedProduk = await db.delete(produkTable).where(eq(produkTable.kodeBarang, kodeBrg));
//bisa juga : const deletedUser = await User.findByIdAndDelete(userId) // kalau dua kriteria misal ( { _id: uerId, category: categoryId })
if (!deletedProduk) {
    return new NextResponse(JSON.stringify({ message: "Product not found"}), { status: 400 });
}
return new NextResponse( JSON.stringify({ message: "Product is deleted", user: deletedProduk }), { status: 200 })
} catch (error: any) {
    return new NextResponse(JSON.stringify({ message: "Error in deleting Product"}), { status : 500 })
}
}






