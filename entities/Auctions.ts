export class Auction {

    id: number;
    articuloId: number;
    vendedorId: number;
    categoriaId: number;
    precioBase: number;
    incrementoMinimo: number;
    fechaCierre: Date;
    estado: string;

    constructor(
        id: number,
        articuloId: number,
        vendedorId: number,
        categoriaId: number,
        precioBase: number,
        incrementoMinimo: number,
        fechaCierre: Date,
        estado: string
    ) {
        this.id = id;
        this.articuloId = articuloId;
        this.vendedorId = vendedorId;
        this.categoriaId = categoriaId;
        this.precioBase = precioBase;
        this.incrementoMinimo = incrementoMinimo;
        this.fechaCierre = fechaCierre;
        this.estado = estado;
    }
}