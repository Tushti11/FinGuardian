import React from "react";
import {
    User,
    Mail,
    Phone,
    CreditCard,
    Landmark,
    ShieldCheck,
    Users,
    LogOut,
    Edit,
    Calendar,
    BadgeIndianRupee,
} from "lucide-react";

interface ProfileProps {
    onLogout: () => void;
}

export default function Profile({ onLogout }: ProfileProps) {
    const user = JSON.parse(
        localStorage.getItem("finguardianUser") || "{}"
    );

    return (
        <div
            className="min-h-screen relative p-6 overflow-hidden text-white"
        >
            {/* BACKGROUND */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `
        linear-gradient(rgba(0,0,0,0.15)),
        url('/fin.png')
      `,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'scroll',
                }}
            />

            {/* CONTENT */}
            <div className="relative z-10">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-semibold text-white">
                            My Profile
                        </h1>
                        <div className="h-1 w-14 bg-emerald-500 mt-2 rounded-full"></div>
                    </div>

                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg font-semibold transition"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">

                    {/* LEFT PROFILE CARD (REDUCED SIZE) */}
                    <div className="bg-black border border-[#0e141b] rounded-2xl p-5 text-center">

                        <img
                            src={
                                user.profileImage ||
                                "https://ui-avatars.com/api/?name=" +
                                encodeURIComponent(user.fullName || "User") +
                                "&background=0f766e&color=fff&size=256"
                            }
                            className="w-24 h-24 mx-auto rounded-full border-2 border-emerald-500 object-cover"
                        />

                        <h2 className="text-lg font-semibold mt-3 text-white">
                            {user.fullName || "User"}
                        </h2>

                        <p className="text-white/70 text-xs mt-1">
                            Verified FinGuardian Member
                        </p>

                        <button className="mt-4 w-full bg-[#111827] border border-[#1f2937] hover:border-emerald-500 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition text-sm">
                            <Edit size={14} />
                            Edit Profile
                        </button>

                        <div className="mt-5 bg-[#0f172a] border border-[#1f2937] rounded-xl p-3">
                            <ShieldCheck className="mx-auto text-white mb-1" size={18} />
                            <p className="text-emerald-400 text-xs font-semibold">
                                Account Secured
                            </p>
                            <p className="text-white/70 text-[10px] mt-1">
                                MFA Enabled
                            </p>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="lg:col-span-2 space-y-5">

                        <Section title="Personal Information">
                            <div className="grid md:grid-cols-2 gap-4">
                                <InfoRow icon={<User size={16} />} label="Full Name" value={user.fullName} />
                                <InfoRow icon={<Mail size={16} />} label="Email" value={user.email} />
                                <InfoRow icon={<Phone size={16} />} label="Mobile" value={user.phone} />
                                <InfoRow icon={<Calendar size={16} />} label="DOB" value={user.dob} />
                            </div>
                        </Section>

                        <Section title="Financial Details">
                            <div className="grid md:grid-cols-2 gap-4">
                                <InfoRow icon={<CreditCard size={16} />} label="PAN" value={user.pan} />
                                <InfoRow icon={<CreditCard size={16} />} label="Aadhaar" value={user.aadhaar} />
                                <InfoRow icon={<Landmark size={16} />} label="Bank" value={user.bankName} />
                                <InfoRow icon={<BadgeIndianRupee size={16} />} label="Account" value={user.accountNumber} />
                            </div>
                        </Section>

                        <Section title="Nominee">
                            <div className="grid md:grid-cols-2 gap-4">
                                <InfoRow icon={<Users size={16} />} label="Nominee Name" value={user.nomineeName} />
                                <InfoRow icon={<Phone size={16} />} label="Nominee Phone" value={user.nomineePhone} />
                            </div>
                        </Section>

                        <Section title="Security Status">
                            <div className="grid grid-cols-3 gap-4 text-center">

                                <div className="bg-[#0b1220] border border-[#1f2937] rounded-lg p-3">
                                    <p className="text-white text-xs font-semibold">
                                        Email Verified
                                    </p>
                                </div>

                                <div className="bg-[#0b1220] border border-[#1f2937] rounded-lg p-3">
                                    <p className="text-white text-xs font-semibold">
                                        Mobile Verified
                                    </p>
                                </div>

                                <div className="bg-[#0b1220] border border-[#1f2937] rounded-lg p-3">
                                    <p className="text-white text-xs font-semibold">
                                        MFA Enabled
                                    </p>
                                </div>

                            </div>
                        </Section>

                    </div>
                </div>
            </div>
        </div>
    );
}

/* ---------------- SECTION ---------------- */

function Section({ title, children }: any) {
    return (
        <div className="bg-black border border-[#1f1f1f] rounded-2xl p-5 text-white">
            <h2 className="text-sm font-semibold text-emerald-300 mb-3">
                {title}
            </h2>
            {children}
        </div>
    );
}

/* ---------------- INFO ROW ---------------- */

function InfoRow({ icon, label, value }: any) {
    return (
        <div className="bg-[#0a0f15] border border-[#1a232e] rounded-lg p-3 flex gap-3">
            <div className="text-white">{icon}</div>
            <div>
                <p className="text-xs text-white/70">{label}</p>
                <p className="text-sm text-white">
                    {value || "Not Provided"}
                </p>
            </div>
        </div>
    );
}