/**
 * Datos de prueba para desarrollo
 * Estos datos se usan cuando el backend no está disponible
 */

export const mockTools = [
    {
        id: "1",
        name: "Taladro Percutor Bosch GSB",
        brand: "Bosch",
        model: "GSB 13 RE",
        category: "Electrica",
        rentalPrice: 5000,
        replacementValue: 89000,
        status: "Disponible",
        stock: 3,
        condition: "excelente",
        location: "Bodega A - Est. 2",
        tool_imageUrl: null
    },
    {
        id: "2",
        name: "Sierra Circular DeWalt",
        brand: "DeWalt",
        model: "DWE575",
        category: "Electrica",
        rentalPrice: 7500,
        replacementValue: 120000,
        status: "Prestada",
        stock: 1,
        condition: "bueno",
        location: "Bodega A - Est. 5",
        tool_imageUrl: null
    },
    {
        id: "3",
        name: "Amoladora Makita",
        brand: "Makita",
        model: "GA9020",
        category: "Electrica",
        rentalPrice: 4500,
        replacementValue: 75000,
        status: "Disponible",
        stock: 5,
        condition: "excelente",
        location: "Bodega B - Est. 1",
        tool_imageUrl: null
    },
    {
        id: "4",
        name: "Martillo Demoledor",
        brand: "Hilti",
        model: "TE 500",
        category: "Electrica",
        rentalPrice: 12000,
        replacementValue: 450000,
        status: "En reparación",
        stock: 0,
        condition: "regular",
        location: "Taller",
        tool_imageUrl: null
    },
    {
        id: "5",
        name: "Llave de Impacto",
        brand: "Stanley",
        model: "STMT74839",
        category: "Manual",
        rentalPrice: 2500,
        replacementValue: 35000,
        status: "Disponible",
        stock: 8,
        condition: "bueno",
        location: "Bodega A - Est. 3",
        tool_imageUrl: null
    }
];

export const mockCustomers = [
    {
        id: "1",
        name: "Juan Pérez González",
        email: "juan.perez@email.com",
        phone: "+56912345678",
        address: "Av. Libertador 1234, Santiago",
        rut: "12.345.678-9",
        status: "Activo",
        registrationDate: "2024-01-15"
    },
    {
        id: "2",
        name: "María López Fernández",
        email: "maria.lopez@email.com",
        phone: "+56987654321",
        address: "Calle Los Pinos 567, Providencia",
        rut: "23.456.789-0",
        status: "Activo",
        registrationDate: "2024-02-10"
    },
    {
        id: "3",
        name: "Carlos Muñoz Silva",
        email: "carlos.munoz@email.com",
        phone: "+56911223344",
        address: "Pasaje Las Rosas 890, Las Condes",
        rut: "34.567.890-1",
        status: "Suspendido",
        registrationDate: "2023-11-20"
    },
    {
        id: "4",
        name: "Ana Torres Rojas",
        email: "ana.torres@email.com",
        phone: "+56955667788",
        address: "Av. Grecia 2345, Ñuñoa",
        rut: "45.678.901-2",
        status: "Activo",
        registrationDate: "2024-03-05"
    }
];

export const mockLoans = [
    {
        id: "1",
        toolId: "1",
        toolName: "Taladro Percutor Bosch GSB",
        customerId: "1",
        customerName: "Juan Pérez González",
        deliveryDate: "2024-01-10",
        dueDate: "2024-01-20",
        returnDate: null,
        status: "ACTIVE",
        fine: 0,
        comments: "Cliente requiere extensión eléctrica adicional"
    },
    {
        id: "2",
        toolId: "2",
        toolName: "Sierra Circular DeWalt",
        customerId: "2",
        customerName: "María López Fernández",
        deliveryDate: "2024-01-05",
        dueDate: "2024-01-12",
        returnDate: null,
        status: "EXPIRED",
        fine: 15000,
        comments: "Cliente notificado vía email y teléfono"
    },
    {
        id: "3",
        toolId: "3",
        toolName: "Amoladora Makita",
        customerId: "4",
        customerName: "Ana Torres Rojas",
        deliveryDate: "2023-12-20",
        dueDate: "2024-01-05",
        returnDate: "2024-01-04",
        status: "RETURNED",
        fine: 0,
        comments: "Devolución en perfecto estado"
    },
    {
        id: "4",
        toolId: "5",
        toolName: "Llave de Impacto",
        customerId: "1",
        customerName: "Juan Pérez González",
        deliveryDate: "2024-01-08",
        dueDate: "2024-01-18",
        returnDate: null,
        status: "ACTIVE",
        fine: 0,
        comments: null
    },
    {
        id: "5",
        toolId: "3",
        toolName: "Amoladora Makita",
        customerId: "2",
        customerName: "María López Fernández",
        deliveryDate: "2023-12-01",
        dueDate: "2023-12-15",
        returnDate: "2023-12-28",
        status: "RETURNED",
        fine: 26000,
        comments: "Multa pagada en efectivo"
    }
];

export const mockRates = [
    {
        id: "1",
        category: "Electrica",
        minDays: 1,
        maxDays: 3,
        discount: 0,
        description: "Tarifa estándar 1-3 días"
    },
    {
        id: "2",
        category: "Electrica",
        minDays: 4,
        maxDays: 7,
        discount: 10,
        description: "10% descuento 4-7 días"
    },
    {
        id: "3",
        category: "Manual",
        minDays: 1,
        maxDays: 7,
        discount: 0,
        description: "Tarifa estándar herramientas manuales"
    }
];

// Clientes con formato DTO (con estadísticas)
export const mockCustomersDTO = [
    {
        id: "1",
        name: "Juan Pérez González",
        email: "juan.perez@email.com",
        phone: "+56912345678",
        address: "Av. Libertador 1234, Santiago",
        rut: "12.345.678-9",
        status: "Activo",
        registrationDate: "2024-01-15",
        totalLoans: 12,
        activeLoans: 2,
        unpaidFines: 0,
        createdAt: "2024-01-15"
    },
    {
        id: "2",
        name: "María López Fernández",
        email: "maria.lopez@email.com",
        phone: "+56987654321",
        address: "Calle Los Pinos 567, Providencia",
        rut: "23.456.789-0",
        status: "Activo",
        registrationDate: "2024-02-10",
        totalLoans: 8,
        activeLoans: 1,
        unpaidFines: 1,
        createdAt: "2024-02-10"
    },
    {
        id: "3",
        name: "Carlos Muñoz Silva",
        email: "carlos.munoz@email.com",
        phone: "+56911223344",
        address: "Pasaje Las Rosas 890, Las Condes",
        rut: "34.567.890-1",
        status: "Restringido",
        registrationDate: "2023-11-20",
        totalLoans: 15,
        activeLoans: 0,
        unpaidFines: 2,
        createdAt: "2023-11-20"
    },
    {
        id: "4",
        name: "Ana Torres Rojas",
        email: "ana.torres@email.com",
        phone: "+56955667788",
        address: "Av. Grecia 2345, Ñuñoa",
        rut: "45.678.901-2",
        status: "Activo",
        registrationDate: "2024-03-05",
        totalLoans: 5,
        activeLoans: 1,
        unpaidFines: 0,
        createdAt: "2024-03-05"
    },
    {
        id: "5",
        name: "Roberto Sánchez",
        email: "roberto.sanchez@email.com",
        phone: "+56944556677",
        address: "Calle Principal 123, Maipú",
        rut: "56.789.012-3",
        status: "Activo",
        registrationDate: "2024-01-20",
        totalLoans: 3,
        activeLoans: 0,
        unpaidFines: 0,
        createdAt: "2024-01-20"
    }
];

// Movimientos de Kardex
export const mockKardexMovements = [
    {
        id: "1",
        toolName: "Taladro Percutor Bosch GSB",
        type: "Ingreso",
        quantity: 5,
        movementDate: "2024-01-05",
        comments: "Compra inicial de inventario",
        userName: "Admin"
    },
    {
        id: "2",
        toolName: "Taladro Percutor Bosch GSB",
        type: "Préstamo",
        quantity: -1,
        movementDate: "2024-01-10",
        comments: "Préstamo a Juan Pérez",
        userName: "Empleado 1"
    },
    {
        id: "3",
        toolName: "Sierra Circular DeWalt",
        type: "Ingreso",
        quantity: 3,
        movementDate: "2024-01-08",
        comments: "Nueva adquisición",
        userName: "Admin"
    },
    {
        id: "4",
        toolName: "Sierra Circular DeWalt",
        type: "Préstamo",
        quantity: -1,
        movementDate: "2024-01-12",
        comments: "Préstamo a María López",
        userName: "Empleado 2"
    },
    {
        id: "5",
        toolName: "Amoladora Makita",
        type: "Ingreso",
        quantity: 8,
        movementDate: "2024-01-03",
        comments: "Stock inicial",
        userName: "Admin"
    },
    {
        id: "6",
        toolName: "Amoladora Makita",
        type: "Préstamo",
        quantity: -2,
        movementDate: "2024-01-14",
        comments: "Doble préstamo para obra",
        userName: "Empleado 1"
    },
    {
        id: "7",
        toolName: "Amoladora Makita",
        type: "Devolución",
        quantity: 2,
        movementDate: "2024-01-16",
        comments: "Devolución en buen estado",
        userName: "Empleado 1"
    },
    {
        id: "8",
        toolName: "Martillo Demoledor",
        type: "Ingreso",
        quantity: 2,
        movementDate: "2023-12-20",
        comments: "Compra para temporada alta",
        userName: "Admin"
    },
    {
        id: "9",
        toolName: "Martillo Demoledor",
        type: "Reparación",
        quantity: -1,
        movementDate: "2024-01-07",
        comments: "Mantenimiento preventivo",
        userName: "Técnico"
    },
    {
        id: "10",
        toolName: "Llave de Impacto",
        type: "Ingreso",
        quantity: 10,
        movementDate: "2024-01-02",
        comments: "Stock inicial - herramientas manuales",
        userName: "Admin"
    },
    {
        id: "11",
        toolName: "Llave de Impacto",
        type: "Préstamo",
        quantity: -2,
        movementDate: "2024-01-15",
        comments: "Préstamo múltiple",
        userName: "Empleado 2"
    },
    {
        id: "12",
        toolName: "Sierra Circular DeWalt",
        type: "Baja",
        quantity: -1,
        movementDate: "2024-01-18",
        comments: "Equipo antiguo dado de baja por desgaste",
        userName: "Admin"
    }
];

// Ranking de herramientas para reportes
export const mockToolRanking = [
    {
        id: "3",
        name: "Amoladora Makita",
        category: "Electrica",
        totalLoans: 24,
        activeLoans: 1,
        totalRevenue: 108000
    },
    {
        id: "1",
        name: "Taladro Percutor Bosch GSB",
        category: "Electrica",
        totalLoans: 18,
        activeLoans: 1,
        totalRevenue: 90000
    },
    {
        id: "2",
        name: "Sierra Circular DeWalt",
        category: "Electrica",
        totalLoans: 15,
        activeLoans: 1,
        totalRevenue: 112500
    },
    {
        id: "5",
        name: "Llave de Impacto",
        category: "Manual",
        totalLoans: 12,
        activeLoans: 2,
        totalRevenue: 30000
    },
    {
        id: "4",
        name: "Martillo Demoledor",
        category: "Electrica",
        totalLoans: 8,
        activeLoans: 0,
        totalRevenue: 96000
    }
];
