import { useEffect, useState } from 'react';
import useAxios from '../../hooks/useAxios';
import { FaTrash, FaEdit, FaPlus, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const AdminMenu = () => {
    const [menu, setMenu] = useState([]);
    const [form, setForm] = useState({ name: '', price: '', category: '', image: '', description: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const axios = useAxios();

    const categories = ['Main Course', 'Snacks', 'Drinks', 'Desserts', 'Breakfast', 'Thali'];

    const fetchMenu = async () => {
        const { data } = await axios.get('/menu');
        setMenu(data);
    };

    useEffect(() => { fetchMenu(); }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`/menu/${editId}`, form);
            } else {
                await axios.post('/menu', form);
            }
            setForm({ name: '', price: '', category: '', image: '', description: '' });
            setIsEditing(false);
            setEditId(null);
            setShowForm(false);
            fetchMenu();
        } catch (error) {
            alert('Operation failed. Please try again.');
        }
    };

    const handleEdit = (item) => {
        setForm({ name: item.name, price: item.price, category: item.category, image: item.image || '', description: item.description || '' });
        setIsEditing(true);
        setEditId(item._id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this item from the menu?')) return;
        try {
            await axios.delete(`/menu/${id}`);
            fetchMenu();
        } catch (error) {
            alert('Failed to delete item.');
        }
    };

    const resetForm = () => {
        setForm({ name: '', price: '', category: '', image: '', description: '' });
        setIsEditing(false);
        setEditId(null);
        setShowForm(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-800">Menu Management</h2>
                    <p className="text-gray-400 text-sm mt-0.5">{menu.length} items on the menu</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowForm(!showForm); }}
                    className="bg-orange-500 text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 font-bold hover:bg-orange-600 shadow-md hover:shadow-lg transition"
                >
                    <FaPlus size={12} /> Add Item
                </button>
            </div>

            {/* Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-white p-6 rounded-3xl shadow-lg mb-8 border border-orange-100"
                    >
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-xl font-bold text-gray-800">{isEditing ? '✏️ Edit Item' : '➕ Add New Item'}</h3>
                            <button onClick={resetForm} className="text-gray-400 hover:text-red-500 transition"><FaTimes size={18} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-500 font-semibold mb-1 block">Item Name*</label>
                                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Dal Chawal" className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-orange-300 focus:outline-none text-sm" required />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 font-semibold mb-1 block">Price (₹)*</label>
                                <input name="price" value={form.price} onChange={handleChange} placeholder="e.g. 50" type="number" className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-orange-300 focus:outline-none text-sm" required />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 font-semibold mb-1 block">Category*</label>
                                <select name="category" value={form.category} onChange={handleChange} className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-orange-300 focus:outline-none text-sm bg-white" required>
                                    <option value="">Select Category</option>
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 font-semibold mb-1 block">Image URL</label>
                                <input name="image" value={form.image} onChange={handleChange} placeholder="https://..." className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-orange-300 focus:outline-none text-sm" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-xs text-gray-500 font-semibold mb-1 block">Description</label>
                                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Brief description of the dish..." className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-orange-300 focus:outline-none text-sm resize-none" rows={2} />
                            </div>
                            <div className="md:col-span-2 flex gap-3">
                                <button type="submit" className="flex-1 bg-orange-500 text-white py-3 rounded-2xl font-bold hover:bg-orange-600 shadow transition">
                                    {isEditing ? 'Update Item' : 'Save Item'}
                                </button>
                                <button type="button" onClick={resetForm} className="px-6 py-3 rounded-2xl border border-gray-200 text-gray-500 hover:bg-gray-50 font-semibold transition">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menu.map(item => (
                    <div key={item._id} className="bg-white rounded-3xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition">
                        <div className="h-36 overflow-hidden bg-gray-50 relative">
                            <img
                                src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80'}
                                alt={item.name}
                                className="w-full h-full object-cover"
                            />
                            <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold ${item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {item.available ? 'Available' : 'Unavailable'}
                            </span>
                        </div>
                        <div className="p-4 flex flex-col gap-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-gray-800 text-sm">{item.name}</h3>
                                    <p className="text-xs text-gray-400">{item.category}</p>
                                </div>
                                <span className="font-extrabold text-orange-500">₹{item.price}</span>
                            </div>
                            {item.description && <p className="text-xs text-gray-500 line-clamp-1">{item.description}</p>}
                            <div className="flex gap-2 mt-1">
                                <button onClick={() => handleEdit(item)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-blue-200 text-blue-600 text-xs font-bold hover:bg-blue-50 transition">
                                    <FaEdit size={11} /> Edit
                                </button>
                                <button onClick={() => handleDelete(item._id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-red-200 text-red-500 text-xs font-bold hover:bg-red-50 transition">
                                    <FaTrash size={11} /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminMenu;
