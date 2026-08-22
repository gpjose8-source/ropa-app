"use server";

import { run, q, one } from "./db";

type DemoProducto = [
  nombre: string,
  categoria: string,
  talla: string,
  marca: string,
  estado: string,
  costo: number,
  venta: number,
  stock: number
];

const PRODUCTOS: DemoProducto[] = [
  ["Camiseta básica algodón", "Camisetas", "M", "Hanes", "A", 2.5, 6, 12],
  ["Camiseta estampada retro", "Camisetas", "L", "Fruit of the Loom", "B", 2.0, 5.5, 8],
  ["Camiseta polo piqué", "Camisetas", "S", "Ralph Lauren", "A", 4.0, 9, 6],
  ["Jeans recto clásico", "Pantalones", "32", "Levi's", "A", 6.0, 15, 10],
  ["Jeans skinny stretch", "Pantalones", "28", "American Eagle", "B", 4.5, 12, 7],
  ["Jogger deportivo", "Pantalones", "L", "Nike", "A", 5.0, 13, 5],
  ["Chaqueta denim", "Chaquetas", "M", "Wrangler", "A", 8.0, 20, 4],
  ["Chaqueta bomber", "Chaquetas", "XL", "Tommy Hilfiger", "B", 7.0, 18, 3],
  ["Sudadera con capota", "Sudaderas", "L", "Champion", "A", 5.5, 14, 9],
  ["Buso cuello redondo", "Sudaderas", "M", "Adidas", "B", 4.5, 11, 6],
  ["Camisa cuadros franela", "Camisas", "M", "Dickies", "A", 4.0, 10, 7],
  ["Camisa formal blanca", "Camisas", "16", "Van Heusen", "A", 3.5, 9, 5],
  ["Vestido floral verano", "Vestidos", "S", "H&M", "A", 4.0, 12, 6],
  ["Vestido negro coctel", "Vestidos", "M", "Zara", "B", 5.0, 14, 3],
  ["Zapatillas running", "Calzado", "41", "New Balance", "B", 9.0, 22, 4],
  ["Botines cuero", "Calzado", "42", "Timberland", "A", 12.0, 30, 2],
  ["Gorra snapback", "Accesorios", "U", "New Era", "A", 2.0, 7, 11],
  ["Gorra trucker", "Accesorios", "U", "Carhartt", "B", 1.8, 6, 9],
];

const CLIENTES = [
  ["María Fernanda Cárdenas", "0991234567"],
  ["Carlos Andrés Zambrano", "0987654321"],
  ["Daniela Quiroz", "0961122334"],
  ["Jorge Luis Paredes", "0954433221"],
  ["Antonia Salazar", "0998877665"],
];

function diasAtras(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  const pad = (x: number) => String(x).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:00`;
}

export async function seedDemo(): Promise<void> {
  const yaHay = one<{ n: number }>("SELECT COUNT(*) AS n FROM productos");
  if ((yaHay?.n ?? 0) > 0) return;

  for (const [nombre, cat, talla, marca, estado, costo, venta, stock] of PRODUCTOS) {
    run(
      `INSERT INTO productos (nombre, categoria, talla, marca, estado, precio_costo, precio_venta, stock)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      nombre,
      cat,
      talla,
      marca,
      estado,
      costo,
      venta,
      stock
    );
  }

  const idsClientes: number[] = [];
  for (const [nombre, tel] of CLIENTES) {
    run("INSERT INTO clientes (nombre, telefono) VALUES (?, ?)", nombre, tel);
    idsClientes.push(one<{ id: number }>("SELECT last_insert_rowid() AS id")!.id);
  }

  const productos = q<{
    id: number;
    precio_costo: number;
    precio_venta: number;
    categoria: string;
  }>("SELECT id, precio_costo, precio_venta, categoria FROM productos");

  let semilla = 7;
  const rnd = () => {
    semilla = (semilla * 16807) % 2147483647;
    return semilla / 2147483647;
  };

  const metodos = ["efectivo", "tarjeta", "transferencia"];
  for (let dia = 13; dia >= 0; dia--) {
    const ventasHoy = 1 + Math.floor(rnd() * 3);
    for (let v = 0; v < ventasHoy; v++) {
      const clienteId = rnd() < 0.6 ? idsClientes[Math.floor(rnd() * idsClientes.length)] : null;
      const itemsN = 1 + Math.floor(rnd() * 3);
      let total = 0;
      let costoTotal = 0;
      const lineas: { pid: number; cant: number; pu: number; cu: number }[] = [];

      for (let i = 0; i < itemsN; i++) {
        const p = productos[Math.floor(rnd() * productos.length)];
        const cant = 1 + Math.floor(rnd() * 2);
        total += p.precio_venta * cant;
        costoTotal += p.precio_costo * cant;
        lineas.push({ pid: p.id, cant, pu: p.precio_venta, cu: p.precio_costo });
      }

      run(
        `INSERT INTO ventas (cliente_id, total, costo_total, metodo_pago, fecha)
         VALUES (?, ?, ?, ?, ?)`,
        clienteId,
        total,
        costoTotal,
        metodos[Math.floor(rnd() * metodos.length)],
        diasAtras(dia)
      );
      const ventaId = one<{ id: number }>("SELECT last_insert_rowid() AS id")!.id;

      for (const l of lineas) {
        run(
          `INSERT INTO venta_items (venta_id, producto_id, cantidad, precio_unit, costo_unit)
           VALUES (?, ?, ?, ?, ?)`,
          ventaId,
          l.pid,
          l.cant,
          l.pu,
          l.cu
        );
      }
    }
  }
}
