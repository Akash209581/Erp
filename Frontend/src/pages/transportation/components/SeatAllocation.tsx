import React, { useState } from 'react';

interface Allocation {
    allocation_id: number;
    user_id: number;
    role: 'student' | 'faculty';
    bus_id: number;
    seat_number: number;
    pickup_stop: string;
    status: string;
}

interface SeatAllocationProps {
    allocation?: Allocation;
    busCapacity?: number;
    isEditing?: boolean;
    onSave?: (data: Allocation) => void;
    onCancel?: () => void;
}

const SeatAllocation: React.FC<SeatAllocationProps> = ({
    allocation,
    busCapacity = 50,
    isEditing = false,
    onSave,
    onCancel,
}) => {
    const [formData, setFormData] = useState<Partial<Allocation>>(
        allocation || {
            user_id: 0,
            role: 'student',
            bus_id: 0,
            seat_number: 0,
            pickup_stop: '',
            status: 'active',
        }
    );

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'seat_number' || name === 'user_id' || name === 'bus_id'
                ? parseInt(value)
                : value,
        });
    };

    const handleSave = () => {
        if (onSave && formData.allocation_id) {
            onSave(formData as Allocation);
        }
    };

    if (isEditing) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Edit Seat Allocation</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">User ID</label>
                        <input
                            type="number"
                            name="user_id"
                            value={formData.user_id}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                        >
                            <option value="student">Student</option>
                            <option value="faculty">Faculty</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Seat Number (1-{busCapacity})</label>
                        <input
                            type="number"
                            name="seat_number"
                            min="1"
                            max={busCapacity}
                            value={formData.seat_number}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Pickup Stop</label>
                        <input
                            type="text"
                            name="pickup_stop"
                            value={formData.pickup_stop}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <div className="flex gap-2 mt-6">
                        <button
                            onClick={handleSave}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
                        >
                            Save Changes
                        </button>
                        <button
                            onClick={onCancel}
                            className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded-lg transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // View mode
    return (
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-600">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-gray-800">Seat Allocation</h3>
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                    {allocation?.status || 'active'}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">User ID</p>
                    <p className="text-2xl font-bold text-blue-600">{allocation?.user_id}</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">Role</p>
                    <p className="text-lg font-bold text-purple-600 capitalize">{allocation?.role}</p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">Seat Number</p>
                    <p className="text-2xl font-bold text-orange-600">{allocation?.seat_number}</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">Pickup Stop</p>
                    <p className="text-lg font-bold text-green-600">{allocation?.pickup_stop}</p>
                </div>
            </div>
        </div>
    );
};

export default SeatAllocation;
