import { mockTools, mockCustomers, mockLoans, mockCustomersDTO, mockKardexMovements, mockToolRanking } from './mockData';

/**
 * Servicio mock que simula respuestas de API
 * Usado cuando el backend no está disponible
 */

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const mockToolService = {
    getTools: async () => {
        await delay(300);
        return { data: mockTools };
    },

    createTool: async (payload) => {
        await delay(500);
        const newTool = {
            id: String(mockTools.length + 1),
            ...payload,
            brand: "Mock Brand",
            model: "Mock Model",
            condition: "excelente",
            location: "Bodega Mock",
            tool_imageUrl: null
        };
        mockTools.push(newTool);
        return { data: newTool };
    },

    deleteTool: async (id) => {
        await delay(300);
        const index = mockTools.findIndex(t => t.id === id);
        if (index !== -1) {
            mockTools[index].status = "Dada de baja";
        }
        return { data: { message: "Herramienta dada de baja" } };
    },

    updateTool: async (id, payload) => {
        await delay(500);
        const index = mockTools.findIndex(t => t.id === id);
        if (index !== -1) {
            mockTools[index] = {
                ...mockTools[index],
                ...payload
            };
            return { data: mockTools[index] };
        }
        throw new Error("Herramienta no encontrada");
    },

    getToolsRanking: async () => {
        await delay(300);
        return { data: mockToolRanking };
    }
};

export const mockCustomerService = {
    getAllCustomers: async () => {
        await delay(300);
        return { data: mockCustomers };
    },

    getAllCustomersDTO: async () => {
        await delay(300);
        return { data: mockCustomersDTO };
    },

    createCustomer: async (payload) => {
        await delay(500);
        const newCustomer = {
            id: String(mockCustomers.length + 1),
            ...payload,
            status: "Activo",
            registrationDate: new Date().toISOString().split('T')[0]
        };
        mockCustomers.push(newCustomer);
        return { data: newCustomer };
    },

    deleteCustomer: async (id) => {
        await delay(300);
        const index = mockCustomers.findIndex(c => String(c.id) === String(id));
        if (index !== -1) {
            mockCustomers.splice(index, 1);
        }
        return { data: { message: "Cliente eliminado" } };
    }
};

export const mockLoanService = {
    getAllLoans: async () => {
        await delay(300);
        return { data: mockLoans };
    },

    createLoan: async (payload) => {
        await delay(500);
        const tool = mockTools.find(t => t.id === payload.toolId);
        const customer = mockCustomers.find(c => c.id === payload.customerId);

        const newLoan = {
            id: String(mockLoans.length + 1),
            toolId: payload.toolId,
            toolName: tool?.name || "Herramienta desconocida",
            customerId: payload.customerId,
            customerName: customer?.name || "Cliente desconocido",
            deliveryDate: payload.deliveryDate,
            dueDate: payload.dueDate,
            returnDate: null,
            status: "ACTIVE",
            fine: 0,
            comments: null
        };

        mockLoans.push(newLoan);
        return { data: newLoan };
    },

    returnLoan: async (loanId) => {
        await delay(500);
        const loan = mockLoans.find(l => l.id === loanId);

        if (loan) {
            loan.returnDate = new Date().toISOString().split('T')[0];
            loan.status = "RETURNED";

            // Simular multa si está vencido
            if (loan.status === "EXPIRED" || new Date(loan.dueDate) < new Date()) {
                const daysLate = Math.floor((new Date() - new Date(loan.dueDate)) / (1000 * 60 * 60 * 24));
                loan.fine = daysLate > 0 ? daysLate * 2000 : 0;
            }
        }

        return { data: loan };
    }
};

export const mockKardexService = {
    getAllKardex: async () => {
        await delay(300);
        return { data: mockKardexMovements };
    }
};
