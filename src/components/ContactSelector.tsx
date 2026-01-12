"use client"

import { useState } from "react";
import Image from "next/image";

type Person = {
    entityId: string;
    firstName: string;
    lastName: string;
};

type ContactSelectorProps = {
    label: string;
    contacts: Person[];
    selectedContactId?: string;
    onContactSelect: (contactId: string, contactName: string) => void;
    error?: any;
};

const ContactSelector = ({ label, contacts, selectedContactId, onContactSelect, error }: ContactSelectorProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const selectedContact = contacts?.find(c => c.entityId === selectedContactId);
    const selectedContactName = selectedContact
        ? `${selectedContact.firstName} ${selectedContact.lastName}`
        : "";

    const filteredContacts = contacts?.filter(contact =>
        `${contact.firstName} ${contact.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    ) || [];

    const handleSelectContact = (contact: Person) => {
        onContactSelect(contact.entityId, `${contact.firstName} ${contact.lastName}`);
        setIsOpen(false);
        setSearchTerm("");
    };

    const handleClear = () => {
        onContactSelect("", "");
    };

    return (
        <div>
            <label className="block text-xs text-gray-600 font-medium mb-1.5">{label}</label>
            
            {/* Display Field */}
            <div className="flex gap-2">
                <div
                    className="flex-1 p-2 border border-gray-300 rounded-md bg-white text-sm cursor-pointer hover:border-orange focus:ring-2 focus:ring-orange"
                    onClick={() => setIsOpen(true)}
                >
                    {selectedContactName || (
                        <span className="text-gray-400">Select a contact...</span>
                    )}
                </div>
                {selectedContactId && (
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

            {/* Modal Popup */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="px-6 py-4 border-b flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-800">Select a Contact</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <Image src="/close.png" alt="close" width={20} height={20} />
                            </button>
                        </div>

                        {/* Search */}
                        <div className="px-6 py-4 border-b">
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange focus:border-orange"
                                autoFocus
                            />
                        </div>

                        {/* Contact List */}
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            {filteredContacts.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">No contacts found</p>
                            ) : (
                                <div className="space-y-2">
                                    {filteredContacts.map((contact) => (
                                        <div
                                            key={contact.entityId}
                                            className={`p-3 rounded-md cursor-pointer transition-colors ${
                                                contact.entityId === selectedContactId
                                                    ? "bg-orange text-white"
                                                    : "hover:bg-gray-100"
                                            }`}
                                            onClick={() => handleSelectContact(contact)}
                                        >
                                            <div className="font-medium">
                                                {contact.firstName} {contact.lastName}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactSelector;
