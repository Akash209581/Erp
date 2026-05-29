import React from 'react';

interface RouteStop {
    stop_id: number;
    stop_name: string;
    stop_order: number;
}

interface Route {
    route_id: number;
    route_name: string;
    start_point: string;
    end_point: string;
    status: string;
    stops?: RouteStop[];
}

interface RouteDetailsProps {
    route: Route;
    onEdit?: () => void;
    onDelete?: () => void;
    onManageStops?: () => void;
}

const RouteDetails: React.FC<RouteDetailsProps> = ({
    route,
    onEdit,
    onDelete,
    onManageStops,
}) => {
    const getStatusColor = (status: string) => {
        return status === 'active'
            ? 'bg-green-100 text-green-800'
            : 'bg-yellow-100 text-yellow-800';
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-2xl font-bold text-gray-800">{route.route_name}</h3>
                    <p className="text-gray-600">Route ID: #{route.route_id}</p>
                </div>
                <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                        route.status,
                    )}`}
                >
                    {route.status.charAt(0).toUpperCase() + route.status.slice(1)}
                </span>
            </div>

            {/* Route Path */}
            <div className="mb-6 bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Route Path</h4>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-xs uppercase">From</p>
                        <p className="text-lg font-semibold text-gray-800">{route.start_point}</p>
                    </div>
                    <div className="flex-1 mx-4 flex items-center">
                        <div className="flex-1 h-1 bg-gradient-to-r from-purple-400 to-purple-600"></div>
                        <span className="mx-2 text-2xl">→</span>
                    </div>
                    <div>
                        <p className="text-gray-600 text-xs uppercase">To</p>
                        <p className="text-lg font-semibold text-gray-800">{route.end_point}</p>
                    </div>
                </div>
            </div>

            {/* Stops Information */}
            {route.stops && route.stops.length > 0 && (
                <div className="mb-6">
                    <h4 className="font-semibold text-gray-700 mb-3">Route Stops ({route.stops.length})</h4>
                    <div className="space-y-2">
                        {route.stops.map((stop, index) => (
                            <div
                                key={stop.stop_id}
                                className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                            >
                                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
                                    {stop.stop_order}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800">{stop.stop_name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2 mt-6">
                {onManageStops && (
                    <button
                        onClick={onManageStops}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition"
                    >
                        Manage Stops
                    </button>
                )}
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

export default RouteDetails;
