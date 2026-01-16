import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
import { useState } from "react";

type InputFieldProps = {
    label: string;
    type?: string;
    register: any;
    name: string;
    defaultValue?: string;
    error?: FieldError | Merge<FieldError, FieldErrorsImpl<{}>> | undefined;
    hidden?: boolean;
    disabled?: boolean;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

const InputField = ({
    label,
    type = "text",
    register,
    name,
    defaultValue,
    error,
    hidden,
    disabled,
    inputProps,
}: InputFieldProps) => {
    return (
        <div className={hidden ? "hidden" : "flex flex-col gap-2 w-full"}>
            <label className="text-xs text-gray-500">{label}</label>
            <input type={type} {...register(name)}
                className={`ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full focus:outline-none focus:ring-orange ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                {...inputProps}
                defaultValue={defaultValue}
                disabled={disabled}
            />
            {error?.message && (
                <p className="text-xs text-red-400">{error.message.toString()}</p>
            )}
        </div>
    )
}

type PhoneField = {
    id?: string;
    phoneNumber: string;
    phoneTypeId: string;
};

export const PhoneFields = ({ 
    register, 
    errors, 
    phoneTypes, 
    defaultPhones 
}: { 
    register: any; 
    errors: any; 
    phoneTypes?: any[]; 
    defaultPhones?: any[] 
}) => {
    const [phones, setPhones] = useState<PhoneField[]>(
        defaultPhones && defaultPhones.length > 0 
            ? defaultPhones.map((p: any) => ({ 
                id: p.id, 
                phoneNumber: p.phoneNumber, 
                phoneTypeId: p.phoneTypeId 
            }))
            : [{ phoneNumber: '', phoneTypeId: '' }]
    );

    const addPhone = () => {
        setPhones([...phones, { phoneNumber: '', phoneTypeId: '' }]);
    };

    const removePhone = (index: number) => {
        if (phones.length > 1) {
            setPhones(phones.filter((_, i) => i !== index));
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="block text-xs text-gray-600 font-medium">Phone Numbers</label>
                <button
                    type="button"
                    onClick={addPhone}
                    className="text-xs bg-lightblue hover:bg-blue-200 px-3 py-1 rounded-md font-medium"
                >
                    + Add Phone
                </button>
            </div>
            {phones.map((phone, index) => (
                <div key={index} className="flex gap-2 items-start">
                    <input type="hidden" {...register(`phones.${index}.id`)} value={phone.id || ''} />
                    <div className="flex-1">
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange focus:border-orange"
                            placeholder="Phone number"
                            {...register(`phones.${index}.phoneNumber`)}
                            defaultValue={phone.phoneNumber}
                        />
                    </div>
                    <div className="w-40">
                        <select
                            className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-orange focus:border-orange"
                            {...register(`phones.${index}.phoneTypeId`)}
                            defaultValue={phone.phoneTypeId}
                        >
                            <option value="">Type</option>
                            {phoneTypes?.map((type: { id: string; description: string }) => (
                                <option key={type.id} value={type.id}>
                                    {type.description}
                                </option>
                            ))}
                        </select>
                    </div>
                    {phones.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removePhone(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                            title="Remove phone"
                        >
                            ✕
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

type ElectronicAddressField = {
    id?: string;
    electronicAddress: string;
    electronicAddressTypeId: string;
};

export const ElectronicAddressFields = ({ 
    register, 
    errors, 
    electronicAddressTypes, 
    defaultElectronicAddresses 
}: { 
    register: any; 
    errors: any; 
    electronicAddressTypes?: any[]; 
    defaultElectronicAddresses?: any[] 
}) => {
    const [electronicAddresses, setElectronicAddresses] = useState<ElectronicAddressField[]>(
        defaultElectronicAddresses && defaultElectronicAddresses.length > 0 
            ? defaultElectronicAddresses.map((ea: any) => ({ 
                id: ea.id, 
                electronicAddress: ea.electronicAddress, 
                electronicAddressTypeId: ea.electronicAddressTypeId 
            }))
            : [{ electronicAddress: '', electronicAddressTypeId: '' }]
    );

    const addElectronicAddress = () => {
        setElectronicAddresses([...electronicAddresses, { electronicAddress: '', electronicAddressTypeId: '' }]);
    };

    const removeElectronicAddress = (index: number) => {
        if (electronicAddresses.length > 1) {
            setElectronicAddresses(electronicAddresses.filter((_, i) => i !== index));
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="block text-xs text-gray-600 font-medium">Electronic Addresses</label>
                <button
                    type="button"
                    onClick={addElectronicAddress}
                    className="text-xs bg-lightblue hover:bg-blue-200 px-3 py-1 rounded-md font-medium"
                >
                    + Add Address
                </button>
            </div>
            {electronicAddresses.map((ea, index) => (
                <div key={index} className="flex gap-2 items-start">
                    <input type="hidden" {...register(`electronicAddresses.${index}.id`)} value={ea.id || ''} />
                    <div className="flex-1">
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange focus:border-orange"
                            placeholder="Email or website"
                            {...register(`electronicAddresses.${index}.electronicAddress`)}
                            defaultValue={ea.electronicAddress}
                        />
                    </div>
                    <div className="w-40">
                        <select
                            className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-orange focus:border-orange"
                            {...register(`electronicAddresses.${index}.electronicAddressTypeId`)}
                            defaultValue={ea.electronicAddressTypeId}
                        >
                            <option value="">Type</option>
                            {electronicAddressTypes?.map((type: { id: string; description: string }) => (
                                <option key={type.id} value={type.id}>
                                    {type.description}
                                </option>
                            ))}
                        </select>
                    </div>
                    {electronicAddresses.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeElectronicAddress(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                            title="Remove address"
                        >
                            ✕
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default InputField