import { mockToolService, mockCustomerService, mockLoanService, mockKardexService } from '../mocks/mockServices';
import * as realToolService from './toolService';
import * as realCustomerService from './customerService';
import * as realLoansService from './loansService';
import * as realKardexService from './kardexService';

/**
 * Wrapper que decide si usar servicios reales o mock
 * Detecta automáticamente si el backend está disponible
 */

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

/**
 * Intenta ejecutar una función del servicio real, si falla usa el mock
 */
async function tryRealOrMock(realFn, mockFn, ...args) {
    // Si está configurado para usar mock directamente, usar mock
    if (USE_MOCK) {
        console.log('🎭 Using MOCK data (VITE_USE_MOCK_DATA=true)');
        return mockFn(...args);
    }

    // Intentar con el servicio real
    try {
        return await realFn(...args);
    } catch (error) {
        console.warn('⚠️ Backend error, falling back to MOCK data:', error.message);
        return mockFn(...args);
    }
}

// ===== TOOL SERVICES =====
export const getTools = (...args) =>
    tryRealOrMock(realToolService.getTools, mockToolService.getTools, ...args);

export const createTool = (...args) =>
    tryRealOrMock(realToolService.createTool, mockToolService.createTool, ...args);

export const deleteTool = (...args) =>
    tryRealOrMock(realToolService.deleteTool, mockToolService.deleteTool, ...args);

export const getToolsRanking = (...args) =>
    tryRealOrMock(realToolService.getToolsRanking, mockToolService.getToolsRanking, ...args);

// ===== CUSTOMER SERVICES =====
export const getAllCustomers = (...args) =>
    tryRealOrMock(realCustomerService.getAllCustomers, mockCustomerService.getAllCustomers, ...args);

export const getAllCustomersDTO = (...args) =>
    tryRealOrMock(realCustomerService.getAllCustomersDTO, mockCustomerService.getAllCustomersDTO, ...args);

export const createCustomer = (realCustomerService.createCustomer && mockCustomerService.createCustomer)
    ? (...args) => tryRealOrMock(realCustomerService.createCustomer, mockCustomerService.createCustomer, ...args)
    : undefined;

// ===== LOAN SERVICES =====
export const getAllLoans = (...args) =>
    tryRealOrMock(realLoansService.getAllLoans, mockLoanService.getAllLoans, ...args);

export const createLoan = (...args) =>
    tryRealOrMock(realLoansService.createLoan, mockLoanService.createLoan, ...args);

export const returnLoan = (...args) =>
    tryRealOrMock(realLoansService.returnLoan, mockLoanService.returnLoan, ...args);

// ===== KARDEX SERVICES =====
export const getAllKardex = (...args) =>
    tryRealOrMock(realKardexService.getAllKardex, mockKardexService.getAllKardex, ...args);
