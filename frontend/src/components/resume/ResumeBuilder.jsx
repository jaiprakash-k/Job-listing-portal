import React, { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer, Download, Layout, Edit, AlertCircle } from 'lucide-react';
import Button from '../../components/ui/CustomButton';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import ModernTemplate from './templates/ModernTemplate';

const ResumeBuilder = ({ profile, onEditProfile }) => {
    const componentRef = useRef(null);
    const [selectedTemplate, setSelectedTemplate] = useState('modern');

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `${profile?.fullName || 'User'}_Resume`,
    });

    if (!profile) {
        return <div className="p-8 text-center text-gray-500">Loading profile data...</div>;
    }

    // Calculate completeness for resume specific fields
    const missingFields = [];
    if (!profile.summary) missingFields.push('Professional Summary');
    if (!profile.skills?.length) missingFields.push('Skills');
    if (!profile.experience?.length) missingFields.push('Experience');
    if (!profile.education?.length) missingFields.push('Education');

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] gap-6 p-4 bg-gray-50 rounded-lg overflow-hidden">

            {/* Settings Panel */}
            <div className="w-full lg:w-80 flex flex-col gap-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100 overflow-y-auto">
                <div>
                    <h2 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
                        <Layout size={20} className="text-emerald-600" />
                        Resume Settings
                    </h2>
                    <p className="text-sm text-gray-500">Customize your resume layout.</p>
                </div>

                {/* Template Selector */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Select Template</label>
                    <div className="grid grid-cols-1 gap-3">
                        <button
                            onClick={() => setSelectedTemplate('modern')}
                            className={`p-3 rounded-lg border-2 text-left transition-all ${selectedTemplate === 'modern'
                                    ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500'
                                    : 'border-gray-200 hover:border-emerald-200 bg-gray-50'
                                }`}
                        >
                            <span className="font-bold text-gray-800 block text-sm">Modern</span>
                            <span className="text-xs text-gray-500">Creative, 2-column layout with accent colors.</span>
                        </button>

                        <button
                            onClick={() => setSelectedTemplate('professional')}
                            className={`p-3 rounded-lg border-2 text-left transition-all ${selectedTemplate === 'professional'
                                    ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500'
                                    : 'border-gray-200 hover:border-emerald-200 bg-gray-50'
                                }`}
                        >
                            <span className="font-bold text-gray-800 block text-sm">Professional</span>
                            <span className="text-xs text-gray-500">Classic, clean, single-column logic.</span>
                        </button>
                    </div>
                </div>

                {/* Data Check */}
                {missingFields.length > 0 && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-start gap-2 mb-2">
                            <AlertCircle size={16} className="text-amber-600 mt-0.5" />
                            <span className="font-bold text-sm text-amber-800">Enhance your resume</span>
                        </div>
                        <p className="text-xs text-amber-700 mb-2">
                            Add these sections to your profile to make your resume stand out:
                        </p>
                        <ul className="list-disc list-inside text-xs text-amber-700 mb-3 pl-1">
                            {missingFields.map(f => <li key={f}>{f}</li>)}
                        </ul>
                        <Button
                            variant="secondary"
                            size="small"
                            fullWidth
                            onClick={onEditProfile}
                        >
                            <Edit size={14} className="mr-1" /> Edit Profile
                        </Button>
                    </div>
                )}

                {/* Actions */}
                <div className="mt-auto pt-6 border-t border-gray-100">
                    <Button
                        variant="primary"
                        fullWidth
                        onClick={handlePrint}
                        className="flex items-center justify-center gap-2"
                    >
                        <Download size={18} /> Download PDF
                    </Button>
                    <p className="text-[10px] text-gray-400 text-center mt-2">
                        Calculated A4 size. Use "Save as PDF" in print dialog.
                    </p>
                </div>
            </div>

            {/* Preview Panel */}
            <div className="flex-1 bg-gray-200/50 rounded-lg p-8 overflow-y-auto flex justify-center items-start shadow-inner">
                <div className="transform scale-[0.6] sm:scale-[0.7] md:scale-[0.85] lg:scale-[0.8] origin-top transition-transform duration-300">
                    <div
                        ref={componentRef}
                        className="shadow-2xl bg-white"
                        style={{ width: '21cm', minHeight: '29.7cm' }}
                    >
                        {selectedTemplate === 'modern' ? (
                            <ModernTemplate profile={profile} />
                        ) : (
                            <ProfessionalTemplate profile={profile} />
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ResumeBuilder;
