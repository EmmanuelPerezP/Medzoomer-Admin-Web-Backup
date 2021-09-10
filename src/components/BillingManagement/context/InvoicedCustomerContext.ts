import React from 'react';

const InvoicedCustomerContext = React.createContext('');

export const InvoicedCustomerProvider = InvoicedCustomerContext.Provider;

export default InvoicedCustomerContext;