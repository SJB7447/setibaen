import React, { useState, useEffect } from 'react';
import { storage } from '../utils/StorageUtils';
import { Trash2, User, Shield } from 'lucide-react';
import Button from './Button';
import Card from './Card';

const UserList = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = () => {
        setUsers(storage.getUsers());
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            storage.deleteUser(id);
            loadUsers();
        }
    };

    return (
        <Card>
            <h3 className="text-lg font-semibold mb-6">Registered Users</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/10 text-muted text-sm">
                            <th className="pb-3 pl-2">Name</th>
                            <th className="pb-3">Email</th>
                            <th className="pb-3">Role</th>
                            <th className="pb-3 text-right pr-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {users.map((user) => (
                            <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="py-3 pl-2 font-medium">{user.name}</td>
                                <td className="py-3 text-muted">{user.email}</td>
                                <td className="py-3">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin'
                                            ? 'bg-primary/20 text-primary border border-primary/20'
                                            : 'bg-white/10 text-muted border border-white/10'
                                        }`}>
                                        {user.role === 'admin' ? <Shield className="w-3 h-3 mr-1" /> : <User className="w-3 h-3 mr-1" />}
                                        {user.role}
                                    </span>
                                </td>
                                <td className="py-3 text-right pr-2">
                                    {user.role !== 'admin' && (
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                            title="Delete User"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default UserList;
