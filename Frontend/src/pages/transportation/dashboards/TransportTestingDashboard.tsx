import React, { useState } from 'react';
import StudentTransportDashboard from './StudentTransportDashboard';
import FacultyTransportDashboard from './FacultyTransportDashboard';
import AdminTransportDashboard from './AdminTransportDashboard';

type UserRole = 'student' | 'faculty' | 'admin';

/**
 * Testing Dashboard - For development/testing only
 * Allows switching between different user roles to test all dashboards
 * Changes only affect the transportation module (localStorage userId/role)
 * 
 * USAGE: Visit http://localhost:5173/transportation/test
 * 
 * NOTE: This is for LOCAL TESTING ONLY. 
 * In production, remove this component or gate it behind a dev environment check.
 */
const TransportationTestingDashboard: React.FC = () => {
    const [selectedRole, setSelectedRole] = useState<UserRole>('student');
    const [userId, setUserId] = useState<string>('1');

    const handleRoleChange = (role: UserRole) => {
        setSelectedRole(role);
        // Update localStorage so dashboards pick up the role
        localStorage.setItem('userRole', role);
        localStorage.setItem('userId', userId);
    };

    const handleUserIdChange = (newUserId: string) => {
        setUserId(newUserId || '1');
        localStorage.setItem('userId', newUserId || '1');
    };

    const renderDashboard = () => {
        switch (selectedRole) {
            case 'student':
                return <StudentTransportDashboard />;
            case 'faculty':
                return <FacultyTransportDashboard />;
            case 'admin':
                return <AdminTransportDashboard />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Testing Controls */}
            <div className="sticky top-0 z-50 bg-white shadow-lg border-b-4 border-yellow-400">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        {/* Warning Badge */}
                        <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <span className="text-2xl">⚠️</span>
                            <div>
                                <p className="font-bold text-sm">TESTING MODE</p>
                                <p className="text-xs text-gray-600">Transportation Module Only</p>
                            </div>
                        </div>

                        {/* Role Selector */}
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-700">Role:</span>
                            <div className="flex gap-2">
                                {(['student', 'faculty', 'admin'] as UserRole[]).map((role) => (
                                    <button
                                        key={role}
                                        onClick={() => handleRoleChange(role)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedRole === role
                                                ? 'bg-blue-600 text-white shadow-lg'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                    >
                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* User ID Input */}
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-700">User ID:</span>
                            <input
                                type="number"
                                value={userId}
                                onChange={(e) => handleUserIdChange(e.target.value)}
                                min="1"
                                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="1"
                            />
                        </div>

                        {/* Test Data Info */}
                        <div className="text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded border border-blue-200">
                            <p>
                                <span className="font-semibold">localStorage keys:</span>
                            </p>
                            <p className="text-xs">userId: {userId} | role: {selectedRole}</p>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded text-sm">
                        <p className="text-gray-700">
                            <strong>How to use:</strong> Switch roles above to test different dashboards.
                            Change User ID to test different users. Dashboard data updates based on selected role and user ID.
                        </p>
                    </div>
                </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-4">
                {renderDashboard()}
            </div>
        </div>
    );
};

export default TransportationTestingDashboard;
