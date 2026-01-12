"use client"

import { useEffect, useState } from "react";

type ClientSelectorProps = {
    label: string;
    selectorId: string;
    selectedPersonId?: string;
    selectedOrganizationId?: string | null;
    initialClientName?: string;
    onClientSelect: (personId: string, organizationId: string | null, clientName: string) => void;
    error?: any;
};

const ClientSelector = ({ label, selectorId, selectedPersonId = "", selectedOrganizationId = null, initialClientName = "", onClientSelect, error }: ClientSelectorProps) => {
    const [selectedClientName, setSelectedClientName] = useState(initialClientName);
    const [isActive, setIsActive] = useState(false);

    // Register initial values on mount if they exist
    useEffect(() => {
        if (selectedPersonId) {
            onClientSelect(selectedPersonId, selectedOrganizationId, initialClientName);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClear = () => {
        onClientSelect("", null, "");
        setSelectedClientName("");
    };

    const openClientSearchWindow = () => {
        const width = 800;
        const height = 700;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        
        setIsActive(true);
        window.open(
            `/search/organizationPerson?selectorId=${selectorId}`,
            'ClientSearch',
            `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
        );
    };

    // Listen for messages from popup
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === 'CLIENT_SELECTED' && event.data.selectorId === selectorId && isActive) {
                onClientSelect(
                    event.data.personId, 
                    event.data.organizationId || null,
                    event.data.displayName
                );
                setSelectedClientName(event.data.displayName);
                setIsActive(false);
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [onClientSelect, selectorId, isActive]);

    return (
        <div>
            <label className="block text-xs text-gray-600 font-medium mb-1.5">{label}</label>
            
            {/* Display Field */}
            <div className="flex gap-2">
                <div
                    className="flex-1 p-2 border border-gray-300 rounded-md bg-white text-sm cursor-pointer hover:border-orange focus:ring-2 focus:ring-orange"
                    onClick={openClientSearchWindow}
                >
                    {selectedClientName || (
                        <span className="text-gray-400">Select...</span>
                    )}
                </div>
                {(selectedPersonId || selectedOrganizationId) && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm"
                    >
                        Clear
                    </button>
                )}
            </div>
            
            {error?.message && (
                <p className="text-xs text-red-400 mt-1">
                    {error.message.toString()}
                </p>
            )}
        </div>
    );
};

export default ClientSelector;
