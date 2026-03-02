import { useEffect, useState, useRef } from 'react';
import useAxios from '../../hooks/useAxios';
import { FaTrash, FaEdit, FaPlus, FaTimes, FaImage, FaLink, FaUpload } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const EMPTY_FORM = { name: '', price: '', category: '', image: '', description: '' };
const CATEGORIES = ['Main Course', 'Snacks', 'Drinks', 'Desserts', 'Breakfast', 'Thali'];

const AdminMenu = () => {
    const [menu, setMenu] = useState([]);
    const [form, setForm] = useState(EMPTY_FORM);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [imageMode, setImageMode] = useState('url'); // 'url' | 'upload'
    const [imagePreview, setImagePreview] = useState('');
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef();
    const axios = useAxios();

    const fetchMenu = async () => {
        const { data } = await axios.get('/menu');
        setMenu(data);
    };
    useEffect(() => { fetchMenu(); }, []);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    // Handle file pick → convert to base64
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            alert('Image must be under 2 MB');
            return;
        }
        setUploading(true);
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result;
            setForm(f => ({ ...f, image: base64 }));
            setImagePreview(base64);
            setUploading(false);
        };
        reader.readAsDataURL(file);
    };

    const handleUrlChange = (e) => {
        handleChange(e);
        setImagePreview(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) await axios.put(`/menu/${editId}`, form);
            else await axios.post('/menu', form);
            resetForm();
            fetchMenu();
        } catch {
            alert('Operation failed. Please try again.');
        }
    };

    const handleEdit = item => {
        setForm({ name: item.name, price: item.price, category: item.category, image: item.image || '', description: item.description || '' });
        setImagePreview(item.image || '');
        setIsEditing(true);
        setEditId(item._id);
        setShowForm(true);
    };

    const handleDelete = async id => {
        if (!window.confirm('Delete this menu item?')) return;
        try { await axios.delete(`/menu/${id}`); fetchMenu(); }
        catch { alert('Failed to delete.'); }
    };

    const resetForm = () => {
        setForm(EMPTY_FORM);
        setIsEditing(false);
        setEditId(null);
        setShowForm(false);
        setImagePreview('');
        setImageMode('url');
    };

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-black text-white">Menu Management</h2>
                    <p className="text-white/40 text-sm mt-0.5">{menu.length} items</p>
                </div>
                <button onClick={() => { resetForm(); setShowForm(s => !s); }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-sm shadow-lg hover:shadow-orange-500/40 hover:scale-105 transition-all">
                    <FaPlus size={12} /> Add Item
                </button>
            </div>

            {/* Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                        className="glass rounded-3xl p-6 mb-8 border border-white/10 shadow-xl">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-lg font-bold text-white">{isEditing ? '✏️ Edit Item' : '➕ Add New Item'}</h3>
                            <button onClick={resetForm} className="text-white/40 hover:text-red-400 transition"><FaTimes size={18} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Name */}
                            <div>
                                <label className="block text-xs font-bold text-white/50 mb-1.5 uppercase tracking-wide">Item Name *</label>
                                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Dal Chawal"
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm" required />
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-xs font-bold text-white/50 mb-1.5 uppercase tracking-wide">Price (₹) *</label>
                                <input name="price" value={form.price} onChange={handleChange} placeholder="e.g. 50" type="number"
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm" required />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-xs font-bold text-white/50 mb-1.5 uppercase tracking-wide">Category *</label>
                                <select name="category" value={form.category} onChange={handleChange}
                                    className="w-full bg-gray-900 border border-white/10 text-white p-3 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm" required>
                                    <option value="">Select Category</option>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-bold text-white/50 mb-1.5 uppercase tracking-wide">Description</label>
                                <input name="description" value={form.description} onChange={handleChange} placeholder="Short description..."
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm" />
                            </div>

                            {/* Image Section - full width */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-white/50 mb-2 uppercase tracking-wide">Food Image</label>

                                {/* Tab Toggle */}
                                <div className="flex gap-2 mb-3">
                                    <button type="button" onClick={() => setImageMode('url')}
                                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${imageMode === 'url' ? 'bg-orange-500 text-white' : 'bg-white/5 border border-white/10 text-white/50 hover:text-white'}`}>
                                        <FaLink size={10} /> Paste URL
                                    </button>
                                    <button type="button" onClick={() => setImageMode('upload')}
                                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${imageMode === 'upload' ? 'bg-orange-500 text-white' : 'bg-white/5 border border-white/10 text-white/50 hover:text-white'}`}>
                                        <FaUpload size={10} /> Upload Photo
                                    </button>
                                </div>

                                <div className="flex gap-4 items-start">
                                    <div className="flex-1">
                                        {imageMode === 'url' ? (
                                            <input name="image" value={form.image} onChange={handleUrlChange}
                                                placeholder="https://images.unsplash.com/..."
                                                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm" />
                                        ) : (
                                            <div>
                                                <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                                <button type="button" onClick={() => fileRef.current.click()}
                                                    className="w-full p-4 rounded-xl border-2 border-dashed border-white/20 text-white/50 hover:border-orange-400 hover:text-orange-400 transition-all flex flex-col items-center gap-2 text-sm font-semibold">
                                                    <FaImage size={24} />
                                                    {uploading ? 'Processing...' : 'Click to pick a photo from your device'}
                                                    <span className="text-xs font-normal opacity-60">JPG, PNG, WEBP · Max 2 MB</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Live Preview */}
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/10 flex-shrink-0 bg-white/5 flex items-center justify-center">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="preview" className="w-full h-full object-cover"
                                                onError={() => setImagePreview('')} />
                                        ) : (
                                            <FaImage className="text-white/20" size={24} />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="md:col-span-2 flex gap-3 pt-2">
                                <button type="submit"
                                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3.5 rounded-2xl font-bold hover:shadow-lg hover:shadow-orange-500/30 transition-all">
                                    {isEditing ? 'Update Item' : 'Save Item'}
                                </button>
                                <button type="button" onClick={resetForm}
                                    className="px-6 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 font-semibold transition">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Menu Grid */}
            {menu.length === 0 && (
                <div className="text-center py-20 text-white/30">
                    <FaImage size={48} className="mx-auto mb-4" />
                    <p className="font-semibold">No menu items yet. Add your first dish!</p>
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {menu.map(item => (
                    <div key={item._id} className="glass-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all group">
                        <div className="h-36 overflow-hidden relative bg-gray-100">
                            <img src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80'}
                                alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80'; }} />
                            <span className={`absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow ${item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {item.available ? '● Available' : '● Unavailable'}
                            </span>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold text-gray-800 text-sm line-clamp-1 flex-1">{item.name}</h3>
                                <span className="font-black text-orange-500 text-sm ml-2">₹{item.price}</span>
                            </div>
                            <p className="text-xs text-gray-400 mb-3 truncate">{item.category}{item.description ? ` · ${item.description}` : ''}</p>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(item)}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition">
                                    <FaEdit size={11} /> Edit
                                </button>
                                <button onClick={() => handleDelete(item._id)}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-bold hover:bg-red-100 transition">
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
