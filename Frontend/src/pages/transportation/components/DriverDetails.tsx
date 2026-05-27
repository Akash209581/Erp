import React from 'react';

interface Driver {
    driver_id: number;
    name: string;
    phone: string;
    license_number: string;
    status: string;
    buses?: Array<{
        bus_id: number;
        bus_number: string;
    }>;
}

interface DriverDetailsProps {
    driver: Driver;
    onEdit?: () => void;
    onDelete?: () => void;
}

const DriverDetails: React.FC<DriverDetailsProps> = ({ driver, onEdit, onDelete }) => {
    const getStatusColor = (status: string) => {
        return status === 'active'
            ? 'bg-green-100 text-green-800'
            : 'bg-yellow-100 text-yellow-800';
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-2xl font-bold text-gray-800">{driver.name}</h3>
                    <p className="text-gray-600">Driver ID: #{driver.driver_id}</p>
                </div>
                <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                        driver.status,
                    )}`}
                >
                    {driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
                </span>
            </div>

            {/* Driver Information */}
            <div className="grid grid-cols-1 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">Phone Number</p>
                    <p className="text-lg font-semibold text-gray-800">{driver.phone}</p>
                    <a
                        href={`tel:${driver.phone}`}
                        className="text-blue-600 hover:underline text-sm mt-2 block"
                    >
                        Call Driver
                    </a>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">License Number</p>
                    <p className="text-lg font-semibold text-gray-800">{driver.license_number}</p>
                </div>
            </div>

            {/* Assigned Buses */}
            {driver.buses && driver.buses.length > 0 && (
                <div className="mb-6 bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-3">Assigned Buses</h4>
                    <div className="space-y-2">
                        {driver.buses.map((bus) => (
                            <div key={bus.bus_id} className="flex items-center gap-2 p-2 bg-white rounded">
                                <span className="text-lg">🚌</span>
                                <span className="font-medium text-gray-800">{bus.bus_number}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 mt-6">
                {onEdit && (
                    <button
                        onClick={onEdit}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
                    >
                        Edit
                    </button>
                )}
                {onDelete && (
                    <button
                        onClick={onDelete}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition"
                    >
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
};

export default DriverDetails;
