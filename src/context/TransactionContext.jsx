import { createContext, useState, useEffect } from 'react';

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
    const [filters, setFilters] = useState({
        search: '',
        category: 'All',
        startDate: '',
        endDate: '',
    });

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10); // Standard pagination

    // Function to update filters
    const updateFilters = (newFilters) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
        setPage(1); // Reset to page 1 on filter change
    };

    return (
        <TransactionContext.Provider value={{ filters, updateFilters, page, setPage, limit, setLimit }}>
            {children}
        </TransactionContext.Provider>
    );
};

export default TransactionContext;
