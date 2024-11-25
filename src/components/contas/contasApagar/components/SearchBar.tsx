import React from 'react';
import { InputText } from 'primereact/inputtext';

interface SearchBarProps {
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBar: React.FC<SearchBarProps> = ({ search, setSearch }) => {
    return (
        <div className="p-inputgroup mb-3">
            <span className="p-inputgroup-addon">
                <i className="pi pi-search"></i>
            </span>
            <InputText
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquisar..."
            />
        </div>
    );
};

export default SearchBar;
