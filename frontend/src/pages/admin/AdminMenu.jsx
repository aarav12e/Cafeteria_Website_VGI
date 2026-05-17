import { useEffect, useState, useRef } from 'react';
import useAxios from '../../hooks/useAxios';
import { FaTrash, FaEdit, FaPlus, FaTimes, FaImage, FaLink, FaUpload } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const EMPTY_FORM = { name: '', price: '', category: '', image: '', description: '', variants: [] };
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

    const addVariant = () => {
        setForm(f => ({ ...f, variants: [...(f.variants || []), { name: '', price: '' }] }));
    };

    const removeVariant = (index) => {
        setForm(f => ({ ...f, variants: f.variants.filter((_, i) => i !== index) }));
    };

    const handleVariantChange = (index, field, value) => {
        setForm(f => {
            const newVariants = [...f.variants];
            newVariants[index][field] = value;
            return { ...f, variants: newVariants };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Set base price to 0 if there are variants and no base price is provided
            const payload = { ...form };
            if (payload.variants && payload.variants.length > 0 && !payload.price) {
                payload.price = payload.variants[0].price; // Set a default base price to satisfy the schema required field if needed
            }
            if (isEditing) await axios.put(`/menu/${editId}`, payload);
            else await axios.post('/menu', payload);
            resetForm();
            fetchMenu();
        } catch {
            alert('Operation failed. Please try again.');
        }
    };

    const handleEdit = item => {
        setForm({ name: item.name, price: item.price || '', category: item.category, image: item.image || '', description: item.description || '', variants: item.variants || [] });
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
                    <p className="text-gray-400 text-sm mt-0.5">{menu.length} items</p>
                </div>
                <button onClick={() => { resetForm(); setShowForm(s => !s); }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-black font-bold text-sm shadow-lg hover:bg-gray-200 transition-all">
                    <FaPlus size={12} /> Add Item
                </button>
            </div>

            {/* Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                        className="bg-[#0a0a0a] rounded-3xl p-6 mb-8 border border-white/10 shadow-xl">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-lg font-bold text-white">{isEditing ? '✏️ Edit Item' : '➕ Add New Item'}</h3>
                            <button onClick={resetForm} className="text-gray-500 hover:text-white transition"><FaTimes size={18} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Name */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Item Name *</label>
                                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Dal Chawal"
                                    className="w-full bg-[#111] border border-white/10 text-white placeholder-gray-600 p-3 rounded-xl focus:ring-1 focus:ring-white focus:outline-none text-sm" required />
                            </div>

                            {/* Base Price */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Base Price (₹)</label>
                                <input name="price" value={form.price} onChange={handleChange} placeholder="e.g. 50" type="number"
                                    className="w-full bg-[#111] border border-white/10 text-white placeholder-gray-600 p-3 rounded-xl focus:ring-1 focus:ring-white focus:outline-none text-sm" required={!form.variants || form.variants.length === 0} />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Category *</label>
                                <select name="category" value={form.category} onChange={handleChange}
                                    className="w-full bg-[#111] border border-white/10 text-white p-3 rounded-xl focus:ring-1 focus:ring-white focus:outline-none text-sm" required>
                                    <option value="">Select Category</option>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Description</label>
                                <input name="description" value={form.description} onChange={handleChange} placeholder="Short description..."
                                    className="w-full bg-[#111] border border-white/10 text-white placeholder-gray-600 p-3 rounded-xl focus:ring-1 focus:ring-white focus:outline-none text-sm" />
                            </div>

                            {/* Variants Section */}
                            <div className="md:col-span-2 mt-2">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Variants (Optional)</label>
                                    <button type="button" onClick={addVariant} className="text-xs flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded-lg transition">
                                        <FaPlus size={10} /> Add Option
                                    </button>
                                </div>
                                {form.variants && form.variants.map((variant, index) => (
                                    <div key={index} className="flex gap-2 mb-2 items-center">
                                        <input
                                            placeholder="Variant Name (e.g. Half, Full)"
                                            value={variant.name}
                                            onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                                            className="flex-1 bg-[#111] border border-white/10 text-white placeholder-gray-600 p-2.5 rounded-xl focus:ring-1 focus:ring-white focus:outline-none text-sm"
                                            required
                                        />
                                        <input
                                            type="number"
                                            placeholder="Price (₹)"
                                            value={variant.price}
                                            onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                                            className="w-32 bg-[#111] border border-white/10 text-white placeholder-gray-600 p-2.5 rounded-xl focus:ring-1 focus:ring-white focus:outline-none text-sm"
                                            required
                                        />
                                        <button type="button" onClick={() => removeVariant(index)} className="p-3 text-gray-500 hover:text-red-400 bg-white/5 hover:bg-red-500/10 rounded-xl transition">
                                            <FaTrash size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Image Section - full width */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Food Image</label>

                                {/* Tab Toggle */}
                                <div className="flex gap-2 mb-3">
                                    <button type="button" onClick={() => setImageMode('url')}
                                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${imageMode === 'url' ? 'bg-white text-black' : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'}`}>
                                        <FaLink size={10} /> Paste URL
                                    </button>
                                    <button type="button" onClick={() => setImageMode('upload')}
                                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${imageMode === 'upload' ? 'bg-white text-black' : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'}`}>
                                        <FaUpload size={10} /> Upload Photo
                                    </button>
                                </div>

                                <div className="flex gap-4 items-start">
                                    <div className="flex-1">
                                        {imageMode === 'url' ? (
                                            <input name="image" value={form.image} onChange={handleUrlChange}
                                                placeholder="https://images.unsplash.com/..."
                                                className="w-full bg-[#111] border border-white/10 text-white placeholder-gray-600 p-3 rounded-xl focus:ring-1 focus:ring-white focus:outline-none text-sm" />
                                        ) : (
                                            <div>
                                                <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                                <button type="button" onClick={() => fileRef.current.click()}
                                                    className="w-full p-4 rounded-xl border-2 border-dashed border-white/20 text-gray-500 hover:border-white hover:text-white transition-all flex flex-col items-center gap-2 text-sm font-semibold">
                                                    <FaImage size={24} />
                                                    {uploading ? 'Processing...' : 'Click to pick a photo from your device'}
                                                    <span className="text-xs font-normal opacity-60">JPG, PNG, WEBP · Max 2 MB</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Live Preview */}
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/10 flex-shrink-0 bg-[#111] flex items-center justify-center">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="preview" className="w-full h-full object-cover"
                                                onError={() => setImagePreview('')} />
                                        ) : (
                                            <FaImage className="text-gray-600" size={24} />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="md:col-span-2 flex gap-3 pt-2">
                                <button type="submit"
                                    className="flex-1 bg-white text-black py-3.5 rounded-2xl font-bold hover:bg-gray-200 transition-all">
                                    {isEditing ? 'Update Item' : 'Save Item'}
                                </button>
                                <button type="button" onClick={resetForm}
                                    className="px-6 py-3.5 rounded-2xl bg-transparent border border-white/10 text-gray-400 hover:bg-white/5 hover:text-white font-semibold transition">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Menu Grid */}
            {menu.length === 0 && (
                <div className="text-center py-20 text-gray-600">
                    <FaImage size={48} className="mx-auto mb-4" />
                    <p className="font-semibold">No menu items yet. Add your first dish!</p>
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {menu.map(item => (
                    <div key={item._id} className="bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-lg hover:bg-[#111] transition-all group">
                        <div className="h-36 overflow-hidden relative bg-[#1a1a1a]">
                            <img src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80'}
                                alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100"
                                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80'; }} />
                            <span className={`absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-widest font-bold shadow border ${item.available ? 'bg-white/10 text-white border-white/20' : 'bg-red-900/50 text-red-200 border-red-900/50'}`}>
                                {item.available ? 'Available' : 'Unavailable'}
                            </span>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold text-white text-sm line-clamp-1 flex-1">{item.name}</h3>
                                <span className="font-black text-white text-sm ml-2">₹{item.price}</span>
                            </div>
                            <p className="text-xs text-gray-400 mb-3 truncate">{item.category}{item.description ? ` · ${item.description}` : ''}</p>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(item)}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-xs font-bold hover:bg-white/10 transition">
                                    <FaEdit size={11} /> Edit
                                </button>
                                <button onClick={() => handleDelete(item._id)}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-900/50 border border-red-900/50 text-red-200 text-xs font-bold hover:bg-red-900/80 transition">
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
