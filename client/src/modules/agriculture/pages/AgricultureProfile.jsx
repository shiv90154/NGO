import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    User, MapPin, Landmark, Building2,
    Plus, Trash2, Edit2, Save, X,
    Lock, Sprout, LayoutDashboard, AlertCircle, CheckCircle2
} from 'lucide-react';

const api = import.meta.env.VITE_API_URL;

/* ─── input guard helpers ─────────────────────────────── */
const skipKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
const onlyDigits = (e) => { if (!skipKeys.includes(e.key) && !/^\d$/.test(e.key)) e.preventDefault(); };
const onlyAlpha = (e) => { if (!skipKeys.includes(e.key) && !/^[a-zA-Z\s]$/.test(e.key)) e.preventDefault(); };

/* ─── sub-components ──────────────────────────────────── */
const LockedBadge = () => (
    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest
        text-[#1e3a5f]/40 bg-[#1e3a5f]/06 px-2.5 py-1 rounded-full">
        <Lock size={9} /> Read-only
    </span>
);

const Field = ({ label, className = '', children }) => (
    <div className={`flex flex-col gap-1.5 ${className}`}>
        <label className="text-[11px] font-bold uppercase tracking-widest text-[#1e3a5f]/45">{label}</label>
        {children}
    </div>
);

const base = `w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-150 outline-none`;
const editableCls = `${base} bg-white border border-gray-200 text-gray-800
    focus:border-[#ff8c42] focus:ring-2 focus:ring-[#ff8c42]/12 shadow-sm`;
const lockedCls = `${base} bg-[#f4f6fa] border border-transparent text-gray-600
    cursor-not-allowed select-none`;

const SectionCard = ({ icon, title, badge, accent = false, children }) => (
    <div className={`rounded-2xl p-6 ${accent
        ? 'bg-[#f8f9fc] border border-[#1e3a5f]/08'
        : 'bg-white border border-gray-100 shadow-sm'}`}>
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#1e3a5f]/07">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#ff8c42]/12 flex items-center justify-center">
                    {icon}
                </div>
                <h2 className="font-bold text-[#1e3a5f] text-[15px]">{title}</h2>
            </div>
            {badge}
        </div>
        {children}
    </div>
);

/* ─── main component ──────────────────────────────────── */
const AgricultureProfile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '', phone: '', email: '', dob: '', gender: '',
        village: '', district: '', state: '', pincode: '', fullAddress: '',
        bankAccount: { accountNumber: '', ifsc: '', bankName: '', accountHolderName: '' },
        landHoldings: [],
    });

    const [newPlot, setNewPlot] = useState({ surveyNumber: '', areaInAcres: '', irrigationType: '' });

    const token = localStorage.getItem('token');

    useEffect(() => { fetchProfile(); }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${api}/agriculture/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) { setProfile(res.data.data); setFormData(res.data.data); }
        } catch (err) {
            toast.error('Failed to load profile');
            if (err.response?.status === 401) navigate('/login');
        } finally { setLoading(false); }
    };

    const updateProfile = async () => {
        try {
            setSaving(true);
            await axios.put(`${api}/agriculture/profile`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchProfile();
            setEditing(false);
            toast.success('Profile saved successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update profile');
        } finally { setSaving(false); }
    };

    const addPlot = () => {
        if (!newPlot.surveyNumber || !newPlot.areaInAcres) {
            toast.error('Survey number and area are required'); return;
        }
        setFormData(prev => ({
            ...prev,
            landHoldings: [...prev.landHoldings, {
                surveyNumber: newPlot.surveyNumber,
                areaInAcres: parseFloat(newPlot.areaInAcres),
                irrigationType: newPlot.irrigationType,
            }]
        }));
        setNewPlot({ surveyNumber: '', areaInAcres: '', irrigationType: '' });
        toast.success('Plot added');
    };

    const removePlot = (i) =>
        setFormData(prev => ({ ...prev, landHoldings: prev.landHoldings.filter((_, idx) => idx !== i) }));

    const handleChange = (e, section) => {
        const { name, value } = e.target;
        if (section === 'bank') {
            setFormData(prev => ({ ...prev, bankAccount: { ...prev.bankAccount, [name]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    /* completion: address + bank + land only (personal is immutable) */
    const checks = [
        formData.village, formData.district, formData.state, formData.pincode, formData.fullAddress,
        formData.bankAccount?.accountNumber, formData.bankAccount?.ifsc,
        formData.bankAccount?.bankName, formData.bankAccount?.accountHolderName,
        formData.landHoldings?.length > 0,
    ];
    const pct = Math.round(checks.filter(Boolean).length / checks.length * 100);
    const totalAcres = (formData.landHoldings?.reduce((s, l) => s + (parseFloat(l.areaInAcres) || 0), 0) || 0).toFixed(1);
    const initials = formData.fullName
        ? formData.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '?';

    if (loading) return (
        <div className="min-h-screen bg-[#eef2f7] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="w-11 h-11 rounded-full border-4 border-[#ff8c42]/25 border-t-[#ff8c42] animate-spin" />
                <p className="text-sm font-medium text-[#1e3a5f]/50">Loading profile…</p>
            </div>
        </div>
    );

    return (
        <>
            <ToastContainer position="top-right" toastClassName="!rounded-2xl !shadow-xl" />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
                *, *::before, *::after { font-family: 'Sora', sans-serif; box-sizing: border-box; }
                body { margin: 0; }
                input[type=number]::-webkit-inner-spin-button,
                input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
                .page-bg {
                    background: #f0f3f8;
                    background-image:
                        radial-gradient(ellipse 80% 60% at 10% -10%, rgba(255,140,66,.10) 0%, transparent 60%),
                        radial-gradient(ellipse 60% 50% at 90% 100%, rgba(30,58,95,.06) 0%, transparent 60%);
                }
                .pill { display:inline-flex; align-items:center; gap:4px; font-size:10px; font-weight:700;
                        text-transform:uppercase; letter-spacing:.05em; padding:3px 9px; border-radius:99px; }
                .pill-orange { background:#fff3e8; color:#e07020; }
                .pill-blue   { background:#e8eef7; color:#1e3a5f; }
                .btn-save   { background:linear-gradient(135deg,#27ae60,#1e8449); }
                .btn-save:hover { opacity:.91; }
                .btn-cancel { background:#eef0f4; color:#4b5563; }
                .btn-cancel:hover { background:#e2e5ea; }
                .ifsc-upper { text-transform:uppercase; }
            `}</style>

            <div className="page-bg min-h-screen">

                {/* ── Top Nav ── */}
                <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-lg border-b border-black/[.05]
                    px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#ff8c42] to-[#e07020] flex items-center justify-center">
                            <Sprout size={14} className="text-white" />
                        </div>
                        <span className="font-extrabold text-[#1e3a5f] text-[15px] tracking-tight">KisanPortal</span>
                    </div>
                    <button onClick={() => navigate('/agriculture/')}
                        className="flex items-center gap-1.5 text-[13px] font-semibold text-[#1e3a5f]/55 hover:text-[#1e3a5f] transition-colors">
                        <LayoutDashboard size={14} />
                        <span className="hidden sm:inline">Dashboard</span>
                    </button>
                </header>

                <div className="w-full px-4 sm:px-8 py-7 space-y-5">

                    {/* ── Hero Card ── */}
                    <div className="rounded-3xl p-6 relative overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #b45309 0%, #d97706 40%, #ff8c42 75%, #fb923c 100%)' }}>
                        {/* wheat field row texture */}
                        <div className="absolute inset-0 opacity-[.08]"
                            style={{ backgroundImage: 'repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 28px),repeating-linear-gradient(180deg,#fff 0,#fff 1px,transparent 1px,transparent 28px)', backgroundSize: '28px 28px' }} />
                        <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full opacity-[.10]"
                            style={{ background: 'radial-gradient(circle,#fff 0%,transparent 70%)' }} />

                        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                                <div className="w-[72px] h-[72px] rounded-2xl bg-white/15 border-2 border-white/20
                                    flex items-center justify-center text-white text-2xl font-extrabold">
                                    {initials}
                                </div>
                                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-[#b45309]
                                    flex items-center justify-center ${pct === 100 ? 'bg-green-400' : 'bg-amber-400'}`}>
                                    {pct === 100
                                        ? <CheckCircle2 size={11} className="text-white" />
                                        : <AlertCircle size={11} className="text-white" />}
                                </div>
                            </div>

                            {/* Name + progress */}
                            <div className="flex-1 min-w-0">
                                <h1 className="text-white font-extrabold text-xl leading-tight truncate">
                                    {formData.fullName || 'Farmer Name'}
                                </h1>
                                <p className="text-white/55 text-sm mt-0.5 truncate">
                                    {[formData.village, formData.district, formData.state].filter(Boolean).join(', ') || 'Location not set'}
                                </p>
                                <div className="mt-4 max-w-sm">
                                    <div className="flex justify-between text-xs mb-1.5">
                                        <span className="text-white/50 font-medium">Profile completion</span>
                                        <span className="text-white font-bold">{pct}%</span>
                                    </div>
                                    <div className="h-1.5 bg-white/25 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full bg-white
                                            transition-all duration-700" style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            </div>

                            {/* Edit / Save / Cancel */}
                            <div className="flex gap-2 flex-shrink-0 self-start sm:self-center">
                                {!editing ? (
                                    <button onClick={() => setEditing(true)}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20
                                        hover:bg-white/30 border border-white/30 text-white text-sm font-semibold transition">
                                        <Edit2 size={13} /> Edit Profile
                                    </button>
                                ) : (
                                    <>
                                        <button onClick={() => { setEditing(false); setFormData(profile); }}
                                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15
                                            hover:bg-white/25 border border-white/20 text-white/90 text-sm font-semibold transition">
                                            <X size={13} /> Cancel
                                        </button>
                                        <button onClick={updateProfile} disabled={saving}
                                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1e3a5f]
                                            hover:bg-[#162d48] text-white text-sm font-bold transition
                                            shadow-lg shadow-[#1e3a5f]/30 disabled:opacity-60">
                                            <Save size={13} /> {saving ? 'Saving…' : 'Save'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Stats strip */}
                        <div className="relative mt-5 pt-5 border-t border-white/10 grid grid-cols-3 gap-4">
                            {[
                                { label: 'Land Plots', val: formData.landHoldings?.length || 0, sub: 'holdings' },
                                { label: 'Total Area', val: totalAcres, sub: 'acres' },
                                { label: 'Bank Linked', val: formData.bankAccount?.accountNumber ? '✓' : '—', sub: formData.bankAccount?.bankName || 'Not set' },
                            ].map(s => (
                                <div key={s.label}>
                                    <p className="text-white/45 text-[11px] font-semibold uppercase tracking-widest">{s.label}</p>
                                    <p className="text-white font-extrabold text-2xl leading-tight mt-0.5">{s.val}</p>
                                    <p className="text-white/40 text-[11px] mt-0.5 truncate">{s.sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Personal Details — ALWAYS LOCKED ── */}
                    <SectionCard
                        icon={<User size={15} className="text-[#ff8c42]" />}
                        title="Personal Details"
                        badge={<LockedBadge />}
                        accent
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { label: 'Full Name', val: formData.fullName },
                                { label: 'Phone Number', val: formData.phone },
                                { label: 'Email Address', val: formData.email },
                                {
                                    label: 'Date of Birth', val: formData.dob
                                        ? new Date(formData.dob).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                                        : ''
                                },
                                {
                                    label: 'Gender', val: formData.gender
                                        ? formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1) : ''
                                },
                            ].map(f => (
                                <Field key={f.label} label={f.label}>
                                    <div className={`${lockedCls} flex items-center justify-between`}>
                                        <span className={f.val ? '' : 'text-gray-400 italic text-xs'}>
                                            {f.val || 'Not provided'}
                                        </span>
                                        <Lock size={11} className="text-[#1e3a5f]/20 flex-shrink-0 ml-2" />
                                    </div>
                                </Field>
                            ))}
                        </div>
                    </SectionCard>

                    {/* ── Address ── */}
                    <SectionCard
                        icon={<MapPin size={15} className="text-[#ff8c42]" />}
                        title="Address"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Village / Town">
                                <input type="text" name="village"
                                    value={formData.village || ''}
                                    onChange={handleChange}
                                    onKeyDown={onlyAlpha}
                                    maxLength={60}
                                    disabled={!editing}
                                    placeholder="Enter village or town"
                                    className={editing ? editableCls : lockedCls} />
                            </Field>
                            <Field label="District">
                                <input type="text" name="district"
                                    value={formData.district || ''}
                                    onChange={handleChange}
                                    onKeyDown={onlyAlpha}
                                    maxLength={60}
                                    disabled={!editing}
                                    placeholder="Enter district"
                                    className={editing ? editableCls : lockedCls} />
                            </Field>
                            <Field label="State">
                                <input type="text" name="state"
                                    value={formData.state || ''}
                                    onChange={handleChange}
                                    onKeyDown={onlyAlpha}
                                    maxLength={60}
                                    disabled={!editing}
                                    placeholder="Enter state"
                                    className={editing ? editableCls : lockedCls} />
                            </Field>
                            <Field label="Pincode">
                                <input type="text" name="pincode"
                                    inputMode="numeric"
                                    maxLength={6}
                                    value={formData.pincode || ''}
                                    onChange={(e) => {
                                        const v = e.target.value.replace(/\D/g, '').slice(0, 6);
                                        handleChange({ target: { name: 'pincode', value: v } });
                                    }}
                                    onKeyDown={onlyDigits}
                                    disabled={!editing}
                                    placeholder="6-digit pincode"
                                    className={editing ? editableCls : lockedCls} />
                            </Field>
                            <Field label="Full Address" className="sm:col-span-2">
                                <input type="text" name="fullAddress"
                                    value={formData.fullAddress || ''}
                                    onChange={handleChange}
                                    maxLength={200}
                                    disabled={!editing}
                                    placeholder="House no., street, landmark…"
                                    className={editing ? editableCls : lockedCls} />
                            </Field>
                        </div>
                    </SectionCard>

                    {/* ── Land Holdings ── */}
                    <SectionCard
                        icon={<Landmark size={15} className="text-[#ff8c42]" />}
                        title="Land Holdings"
                    >
                        {/* Add plot panel */}
                        {editing && (
                            <div className="mb-5 bg-gradient-to-br from-[#f0f4ff] to-[#fff4eb]
                                rounded-2xl p-4 border border-[#1e3a5f]/08">
                                <p className="text-[11px] font-bold uppercase tracking-widest text-[#1e3a5f]/45 mb-3">
                                    Add a new plot
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <input type="text"
                                        placeholder="Survey number"
                                        value={newPlot.surveyNumber}
                                        onChange={(e) => setNewPlot(p => ({
                                            ...p, surveyNumber: e.target.value.replace(/[^a-zA-Z0-9/\-]/g, '')
                                        }))}
                                        maxLength={20}
                                        className={editableCls} />
                                    <input type="text"
                                        inputMode="decimal"
                                        placeholder="Area in acres"
                                        value={newPlot.areaInAcres}
                                        onChange={(e) => {
                                            const v = e.target.value.replace(/[^\d.]/g, '').replace(/(\..*)\./g, '$1');
                                            setNewPlot(p => ({ ...p, areaInAcres: v }));
                                        }}
                                        className={editableCls} />
                                    <select value={newPlot.irrigationType}
                                        onChange={(e) => setNewPlot(p => ({ ...p, irrigationType: e.target.value }))}
                                        className={editableCls}>
                                        <option value="">Irrigation type</option>
                                        <option value="canal">Canal</option>
                                        <option value="borewell">Borewell</option>
                                        <option value="rainfed">Rainfed</option>
                                        <option value="drip">Drip</option>
                                        <option value="sprinkler">Sprinkler</option>
                                    </select>
                                </div>
                                <button onClick={addPlot}
                                    className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm
                                    font-semibold hover:opacity-90 transition shadow shadow-[#ff8c42]/20"
                                    style={{ background: 'linear-gradient(135deg,#ff8c42,#e07020)' }}>
                                    <Plus size={14} /> Add Plot
                                </button>
                            </div>
                        )}

                        {/* Plot list */}
                        <div className="space-y-2.5">
                            {formData.landHoldings?.length === 0 ? (
                                <div className="py-10 text-center">
                                    <Landmark size={32} className="mx-auto text-[#1e3a5f]/15 mb-2" />
                                    <p className="text-sm font-semibold text-[#1e3a5f]/30">No plots added yet</p>
                                    {!editing && <p className="text-xs text-[#1e3a5f]/20 mt-1">Click <strong>Edit Profile</strong> to add land holdings</p>}
                                </div>
                            ) : formData.landHoldings.map((land, i) => (
                                <div key={i} className="flex items-center justify-between gap-4
                                    rounded-xl bg-[#f8f9fc] border border-[#1e3a5f]/07 px-4 py-3.5">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-9 h-9 rounded-xl bg-[#1e3a5f]/08 flex items-center justify-center
                                            text-[#1e3a5f] font-extrabold text-xs flex-shrink-0">
                                            {String(i + 1).padStart(2, '0')}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-[#1e3a5f] text-sm truncate">
                                                Survey #{land.surveyNumber}
                                            </p>
                                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                                <span className="pill pill-blue">{land.areaInAcres} acres</span>
                                                {land.irrigationType && (
                                                    <span className="pill pill-orange capitalize">{land.irrigationType}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {editing && (
                                        <button onClick={() => removePlot(i)}
                                            className="flex-shrink-0 p-1.5 rounded-lg text-red-400
                                            hover:text-red-600 hover:bg-red-50 transition">
                                            <Trash2 size={15} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </SectionCard>

                    {/* ── Bank Details ── */}
                    <SectionCard
                        icon={<Building2 size={15} className="text-[#ff8c42]" />}
                        title="Bank Details"
                    >
                        <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100
                            rounded-xl px-4 py-3 mb-5 text-xs text-amber-700">
                            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                            <span>Bank details are used for direct benefit transfers. Ensure accuracy before saving.</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Account Number">
                                <input type="text" name="accountNumber"
                                    inputMode="numeric"
                                    value={formData.bankAccount?.accountNumber || ''}
                                    onChange={(e) => {
                                        const v = e.target.value.replace(/\D/g, '').slice(0, 18);
                                        handleChange({ target: { name: 'accountNumber', value: v } }, 'bank');
                                    }}
                                    onKeyDown={onlyDigits}
                                    maxLength={18}
                                    disabled={!editing}
                                    placeholder="Enter account number"
                                    className={editing ? editableCls : lockedCls} />
                            </Field>
                            <Field label="IFSC Code">
                                <input type="text" name="ifsc"
                                    value={(formData.bankAccount?.ifsc || '').toUpperCase()}
                                    onChange={(e) => {
                                        const v = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11);
                                        handleChange({ target: { name: 'ifsc', value: v } }, 'bank');
                                    }}
                                    maxLength={11}
                                    disabled={!editing}
                                    placeholder="e.g. SBIN0001234"
                                    className={(editing ? editableCls : lockedCls) + ' ifsc-upper'} />
                            </Field>
                            <Field label="Bank Name">
                                <input type="text" name="bankName"
                                    value={formData.bankAccount?.bankName || ''}
                                    onChange={(e) => handleChange(e, 'bank')}
                                    onKeyDown={onlyAlpha}
                                    maxLength={60}
                                    disabled={!editing}
                                    placeholder="Enter bank name"
                                    className={editing ? editableCls : lockedCls} />
                            </Field>
                            <Field label="Account Holder Name">
                                <input type="text" name="accountHolderName"
                                    value={formData.bankAccount?.accountHolderName || ''}
                                    onChange={(e) => handleChange(e, 'bank')}
                                    onKeyDown={onlyAlpha}
                                    maxLength={80}
                                    disabled={!editing}
                                    placeholder="As on bank records"
                                    className={editing ? editableCls : lockedCls} />
                            </Field>
                        </div>
                    </SectionCard>

                    {/* ── Floating Save Bar ── */}
                    {editing && (
                        <div className="sticky bottom-4 z-20">
                            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-[#1e3a5f]/15
                                border border-white px-5 py-3.5 flex items-center justify-between gap-4">
                                <p className="text-sm text-[#1e3a5f]/60 font-medium hidden sm:block">
                                    You have unsaved changes
                                </p>
                                <div className="flex items-center gap-3 ml-auto">
                                    <button
                                        onClick={() => { setEditing(false); setFormData(profile); }}
                                        className="btn-cancel flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition">
                                        <X size={13} /> Discard
                                    </button>
                                    <button
                                        onClick={updateProfile}
                                        disabled={saving}
                                        className="btn-save flex items-center gap-2 px-5 py-2 rounded-xl text-sm
                                        font-bold text-white transition shadow-md shadow-green-700/20 disabled:opacity-60">
                                        <Save size={13} /> {saving ? 'Saving…' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div >
        </>
    );
};

export default AgricultureProfile;