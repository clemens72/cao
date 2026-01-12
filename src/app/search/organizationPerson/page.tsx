"use client"

import { useState, useEffect } from "react";

type Person = {
    entityId: string;
    firstName: string;
    lastName: string;
};

type OrganizationPerson = {
    id: number;
    organizationEntityId: string;
    personEntityId: string;
    organizationName: string;
    personFirstName: string;
    personLastName: string;
};

type SearchResult = {
    type: 'person' | 'organizationPerson';
    displayName: string;
    personEntityId: string;
    organizationEntityId: string | null;
    data: Person | OrganizationPerson;
};

const ClientSearchPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectorId, setSelectorId] = useState<string>("");

    // Extract selectorId from URL on mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setSelectorId(params.get('selectorId') || '');
    }, []);

    const handleSearch = async () => {
        if (!searchTerm.trim()) return;
        
        setIsLoading(true);
        try {
            const response = await fetch(`/api/search/clients?q=${encodeURIComponent(searchTerm)}`);
            const data = await response.json();
            
            const results: SearchResult[] = [
                ...data.persons.map((p: Person) => ({
                    type: 'person' as const,
                    displayName: `${p.firstName} ${p.lastName}`,
                    personEntityId: p.entityId,
                    organizationEntityId: null,
                    data: p
                })),
                ...data.organizationPersons.map((op: OrganizationPerson) => ({
                    type: 'organizationPerson' as const,
                    displayName: `${op.organizationName} - ${op.personFirstName} ${op.personLastName}`,
                    personEntityId: op.personEntityId,
                    organizationEntityId: op.organizationEntityId,
                    data: op
                }))
            ];
            
            setSearchResults(results);
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdd = () => {
        console.log("Adding client");
        // Add client creation logic here
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                <div className="p-6 border-b">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-6">Client Search</h1>
                    
                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Search by name or organization..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="flex-1 p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange focus:border-orange"
                            autoFocus
                        />
                        <button
                            onClick={handleSearch}
                            disabled={isLoading}
                            className="px-6 py-2 bg-orange hover:bg-orange/80 text-white rounded-md text-sm font-medium disabled:opacity-50"
                        >
                            {isLoading ? "Searching..." : "Search"}
                        </button>
                        <button
                            onClick={handleAdd}
                            className="px-6 py-2 bg-orange hover:bg-orange/80 text-white rounded-md text-sm font-medium"
                        >
                            Add
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {searchResults.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">
                            {searchTerm ? "No results found" : "Enter a search term to find clients"}
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {searchResults.map((result, index) => (
                                <div
                                    key={`${result.type}-${result.personEntityId}-${index}`}
                                    className="p-3 rounded-md hover:bg-gray-100 cursor-pointer border border-gray-200 transition-colors"
                                    onClick={() => {
                                        window.opener.postMessage({
                                            type: 'CLIENT_SELECTED',
                                            selectorId: selectorId,
                                            personId: result.personEntityId,
                                            organizationId: result.organizationEntityId,
                                            displayName: result.displayName
                                        }, '*');
                                        window.close();
                                    }}
                                >
                                    <div className="font-medium text-gray-800">
                                        {result.displayName}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {result.type === 'person' ? 'Person' : 'Organization Contact'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientSearchPage;
