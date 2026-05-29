import React, { useState } from 'react';

interface Stop {
    stop_id: number;
    stop_name: string;
    stop_order: number;
}

interface RouteStopsProps {
    stops: Stop[];
    routeName: string;
    onAddStop?: (stop: Omit<Stop, 'stop_id'>) => void;
    onDeleteStop?: (stopId: number) => void;
}

const RouteStops: React.FC<RouteStopsProps> = ({
    stops,
    routeName,
    onAddStop,
    onDeleteStop,
}) => {
    const [newStop, setNewStop] = useState<Omit<Stop, 'stop_id'>>({
        stop_name: '',
        stop_order: (stops.length > 0 ? Math.max(...stops.map(s => s.stop_order)) + 1 : 1),
    });
    const [showAddForm, setShowAddForm] = useState(false);

    const handleAddStop = () => {
        if (newStop.stop_name.trim()) {
            onAddStop?.(newStop);
            setNewStop({
                stop_name: '',
                stop_order: (stops.length > 0 ? Math.max(...stops.map(s => s.stop_order)) + 1 : 1),
            });
            setShowAddForm(false);
        }
    };

    const sortedStops = [...stops].sort((a, b) => a.stop_order - b.stop_order);

    return (
        <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Route Stops</h3>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
                >
                    {showAddForm ? 'Cancel' : '+ Add Stop'}
                </button>
            </div>

            {/* Add Stop Form */}
            {showAddForm && (
                <div className="mb-6 bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                    <h4 className="font-semibold text-gray-700 mb-4">Add New Stop to {routeName}</h4>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Stop Name</label>
                            <input
                                type="text"
                                value={newStop.stop_name}
                                onChange={(e) =>
                                    setNewStop({ ...newStop, stop_name: e.target.value })
                                }
                                placeholder="Enter stop name"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Stop Order</label>
                            <input
                                type="number"
                                value={newStop.stop_order}
                                onChange={(e) =>
                                    setNewStop({ ...newStop, stop_order: parseInt(e.target.value) })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                            />
                        </div>

                        <button
                            onClick={handleAddStop}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition font-semibold"
                        >
                            Add Stop
                        </button>
                    </div>
                </div>
            )}

            {/* Stops List */}
            <div className="space-y-3">
                {sortedStops.length > 0 ? (
                    sortedStops.map((stop, index) => (
                        <div
                            key={stop.stop_id}
                            className={`flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-purple-600 ${index !== sortedStops.length - 1 ? '' : ''
                                }`}
                        >
                            <div className="flex items-center gap-4 flex-1">
                                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
                                    {stop.stop_order}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">{stop.stop_name}</p>
                                    <p className="text-xs text-gray-600">Stop ID: #{stop.stop_id}</p>
                                </div>
                            </div>

                            {onDeleteStop && (
                                <button
                                    onClick={() => onDeleteStop(stop.stop_id)}
                                    className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-lg text-sm transition"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <p>No stops added yet. Click "Add Stop" to create the first stop.</p>
                    </div>
                )}
            </div>

            {/* Summary */}
            {stops.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                    <p className="text-gray-700">
                        <span className="font-semibold">Total Stops:</span>{' '}
                        <span className="text-lg font-bold text-purple-600">{stops.length}</span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default RouteStops;
