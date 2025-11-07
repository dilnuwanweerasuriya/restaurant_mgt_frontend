import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import OptionsButton from '../../components/OptionsButton';
import { LuUser, LuMail, LuShield, LuCalendar, LuSave, LuX, LuKey, LuCheck, LuPen } from 'react-icons/lu';

export default function ProfilePage() {
    const token = localStorage.getItem('token');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form data for editing
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });

    // Password change form
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Fetch current user data
    const fetchUserProfile = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/users/profile`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setUser(response.data);
            setFormData({
                name: response.data.name || '',
                email: response.data.email || ''
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load profile');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle password input changes
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Submit profile updates
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/users/profile`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                setUser(response.data);
                toast.success('Profile updated successfully!');
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Submit password change
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        // Validate passwords match
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        // Validate password length
        if (passwordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/users/change-password`,
                {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                toast.success('Password changed successfully!');
                setIsChangingPassword(false);
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            }
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Cancel editing
    const cancelEdit = () => {
        setFormData({
            name: user?.name || '',
            email: user?.email || ''
        });
        setIsEditing(false);
    };

    // Cancel password change
    const cancelPasswordChange = () => {
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setIsChangingPassword(false);
    };

    // Format date
    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-900 text-white p-8">
            <OptionsButton />

            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center">My Profile</h1>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Profile Picture and Basic Info Card */}
                    <div className="md:col-span-1">
                        <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
                            <div className="flex flex-col items-center">
                                {/* Avatar */}
                                <div className="w-32 h-32 bg-zinc-700 rounded-full flex items-center justify-center mb-4">
                                    <LuUser className="w-16 h-16 text-zinc-400" />
                                </div>

                                {/* Name and Role */}
                                <h2 className="text-xl font-semibold mb-1">{user?.name || 'User'}</h2>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium mb-4 ${user?.role === 'admin'
                                        ? 'bg-purple-900/30 text-purple-400'
                                        : 'bg-blue-900/30 text-blue-400'
                                    }`}>
                                    {user?.role === 'admin' ? 'Administrator' : 'Cashier'}
                                </span>

                                {/* Stats */}
                                <div className="w-full space-y-3 mt-4 pt-4 border-t border-zinc-700">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-zinc-400">Member Since</span>
                                        <span className="text-zinc-300">{formatDate(user?.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-zinc-400">Last Updated</span>
                                        <span className="text-zinc-300">{formatDate(user?.updatedAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Details Card */}
                    <div className="md:col-span-2">
                        <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700 mb-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold">Profile Information</h3>
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <LuPen className="w-4 h-4" />
                                        Edit Profile
                                    </button>
                                )}
                            </div>

                            {isEditing ? (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-2">
                                            <LuUser className="inline w-4 h-4 mr-1" />
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-zinc-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-2">
                                            <LuMail className="inline w-4 h-4 mr-1" />
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            disabled
                                            className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-zinc-400 opacity-60"
                                        />
                                        <p className="text-xs text-zinc-500 mt-1">Email cannot be changed</p>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={cancelEdit}
                                            disabled={isSubmitting}
                                            className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <LuSave className="w-4 h-4" />
                                                    Save Changes
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <LuUser className="w-5 h-5 text-zinc-400" />
                                        <div>
                                            <p className="text-sm text-zinc-400">Full Name</p>
                                            <p className="text-white">{user?.name || 'Not provided'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <LuMail className="w-5 h-5 text-zinc-400" />
                                        <div>
                                            <p className="text-sm text-zinc-400">Email Address</p>
                                            <p className="text-white">{user?.email || 'Not provided'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <LuShield className="w-5 h-5 text-zinc-400" />
                                        <div>
                                            <p className="text-sm text-zinc-400">Role</p>
                                            <p className="text-white capitalize">{user?.role || 'Not assigned'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Security Section */}
                        <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold">Security</h3>
                                {!isChangingPassword && (
                                    <button
                                        onClick={() => setIsChangingPassword(true)}
                                        className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <LuKey className="w-4 h-4" />
                                        Change Password
                                    </button>
                                )}
                            </div>

                            {isChangingPassword ? (
                                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-2">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-zinc-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-2">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            minLength="6"
                                            className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-zinc-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-2">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            minLength="6"
                                            className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-zinc-500"
                                        />
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={cancelPasswordChange}
                                            disabled={isSubmitting}
                                            className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    <LuCheck className="w-4 h-4" />
                                                    Update Password
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <LuKey className="w-5 h-5 text-zinc-400" />
                                    <div>
                                        <p className="text-sm text-zinc-400">Password</p>
                                        <p className="text-white">••••••••</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}