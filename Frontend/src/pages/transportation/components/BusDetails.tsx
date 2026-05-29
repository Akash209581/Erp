import React from 'react';

interface Bus {
    bus_id: number;
    bus_number: string;
    capacity: number;
    status: string;
    route?: {
        route_name: string;
        start_point: string;
        end_point: string;
    };
    driver?: {
        driver_id: number;
        name: string;
        phone: string;
    };
}

interface BusDetailsProps {
    bus: Bus;
    onEdit?: () => void;
    onDelete?: () => void;
}

const BusDetails: React.FC<BusDetailsProps> = ({ bus, onEdit, onDelete }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'inactive':
                return 'bg-yellow-100 text-yellow-800';
            case 'maintenance':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-2xl font-bold text-gray-800">{bus.bus_number}</h3>
                    <p className="text-gray-600">Bus ID: #{bus.bus_id}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(bus.status)}`}>
                    {bus.status.charAt(0).toUpperCase() + bus.status.slice(1)}
                </span>
            </div>

            {/* Bus Information */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">Capacity</p>
                    <p className="text-2xl font-bold text-blue-600">{bus.capacity} Seats</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">Bus Number</p>
                    <p className="text-lg font-semibold text-gray-800">{bus.bus_number}</p>
                </div>
            </div>

            {/* Route Information */}
            {bus.route && (
                <div className="mb-6 bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Assigned Route</h4>
                    <p className="text-lg font-bold text-purple-600 mb-2">{bus.route.route_name}</p>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{bus.route.start_point}</span>
                        <span>→</span>
                        <span>{bus.route.end_point}</span>
                    </div>
                </div>
            )}

            {/* Driver Information */}
            {bus.driver && (
                <div className="mb-6 bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Driver</h4>
                    <p className="text-lg font-bold text-gray-800">{bus.driver.name}</p>
                    <p className="text-sm text-gray-600 mt-1">📞 {bus.driver.phone}</p>
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

export default BusDetails;
