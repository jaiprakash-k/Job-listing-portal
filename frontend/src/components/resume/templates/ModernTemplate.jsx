import React from 'react';

const ModernTemplate = ({ profile }) => {
    if (!profile) return null;

    const {
        fullName, email, phone, location,
        summary, skills, experience, education, projects,
        linkedinUrl, githubUrl, portfolioUrl
    } = profile;

    return (
        <div className="bg-white text-slate-800 w-full max-w-[21cm] min-h-[29.7cm] mx-auto shadow-none flex" style={{ fontFamily: '"Inter", sans-serif' }}>

            {/* Sidebar (Left Column) */}
            <div className="w-1/3 bg-slate-100 p-6 border-r border-slate-200">

                {/* Contact */}
                <div className="mb-8">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-4 border-b border-emerald-200 pb-1">Contact</h3>
                    <div className="flex flex-col gap-3 text-sm">
                        {email && (
                            <div>
                                <span className="block text-xs text-slate-500 font-semibold mb-0.5">Email</span>
                                <span className="break-all">{email}</span>
                            </div>
                        )}
                        {phone && (
                            <div>
                                <span className="block text-xs text-slate-500 font-semibold mb-0.5">Phone</span>
                                <span>{phone}</span>
                            </div>
                        )}
                        {location && (
                            <div>
                                <span className="block text-xs text-slate-500 font-semibold mb-0.5">Location</span>
                                <span>{location}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Links */}
                {(linkedinUrl || githubUrl || portfolioUrl) && (
                    <div className="mb-8">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-4 border-b border-emerald-200 pb-1">Links</h3>
                        <div className="flex flex-col gap-2 text-sm">
                            {linkedinUrl && <a href={linkedinUrl} className="text-blue-600 hover:underline">LinkedIn Profile</a>}
                            {githubUrl && <a href={githubUrl} className="text-blue-600 hover:underline">GitHub Profile</a>}
                            {portfolioUrl && <a href={portfolioUrl} className="text-blue-600 hover:underline">Portfolio</a>}
                        </div>
                    </div>
                )}

                {/* Skills */}
                {skills && skills.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-4 border-b border-emerald-200 pb-1">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill, idx) => (
                                <span key={idx} className="bg-white border border-slate-300 px-2 py-1 rounded text-xs font-medium text-slate-700">
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education (Sidebar style) */}
                {education && education.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-4 border-b border-emerald-200 pb-1">Education</h3>
                        <div className="flex flex-col gap-4">
                            {education.map((edu, idx) => (
                                <div key={idx} className="text-sm">
                                    <div className="font-bold text-slate-800">{edu.degree}</div>
                                    <div className="text-emerald-700 font-medium">{edu.field}</div>
                                    <div className="text-slate-500 text-xs mt-1">{edu.institution}</div>
                                    <div className="text-slate-400 text-xs">{edu.startYear} - {edu.endYear}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content (Right Column) */}
            <div className="w-2/3 p-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2">{fullName}</h1>
                    <p className="text-lg text-emerald-600 font-medium">{profile.currentTitle || 'Job Seeker'}</p>
                </div>

                {/* Summary */}
                {summary && (
                    <div className="mb-8">
                        <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <span className="w-8 h-1 bg-emerald-500 rounded-full"></span>
                            Profile
                        </h2>
                        <p className="text-sm text-slate-600 leading-relaxed">{summary}</p>
                    </div>
                )}

                {/* Experience */}
                {experience && experience.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <span className="w-8 h-1 bg-emerald-500 rounded-full"></span>
                            Experience
                        </h2>
                        <div className="flex flex-col gap-6">
                            {experience.map((exp, idx) => (
                                <div key={idx} className="relative pl-4 border-l-2 border-slate-100">
                                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-emerald-400"></div>
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-slate-900">{exp.title}</h3>
                                        <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                                            {exp.startDate} - {exp.current ? 'Now' : exp.endDate}
                                        </span>
                                    </div>
                                    <div className="text-sm font-medium text-emerald-700 mb-2">{exp.company}</div>
                                    <p className="text-sm text-slate-600 whitespace-pre-line">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Projects */}
                {projects && projects.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <span className="w-8 h-1 bg-emerald-500 rounded-full"></span>
                            Projects
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            {projects.map((proj, idx) => (
                                <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-slate-900 text-sm">{proj.title}</h3>
                                        {proj.projectUrl && (
                                            <a href={proj.projectUrl} className="text-xs text-emerald-600 hover:text-emerald-700 hover:underline">View Project &rarr;</a>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-600 mb-2 line-clamp-2">{proj.description}</p>
                                    {proj.techStack && (
                                        <div className="flex flex-wrap gap-1">
                                            {proj.techStack.map((tech, i) => (
                                                <span key={i} className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-500">{tech}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ModernTemplate;
