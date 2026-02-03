import React from 'react';

const ProfessionalTemplate = ({ profile }) => {
    if (!profile) return null;

    const {
        fullName, email, phone, location,
        summary, skills, experience, education, projects,
        linkedinUrl, githubUrl, portfolioUrl
    } = profile;

    return (
        <div className="bg-white text-gray-900 p-8 max-w-[21cm] min-h-[29.7cm] mx-auto shadow-none" style={{ fontFamily: 'Times New Roman, serif' }}>
            {/* Header */}
            <div className="border-b-2 border-gray-800 pb-4 mb-6">
                <h1 className="text-3xl font-bold uppercase tracking-wider text-center">{fullName}</h1>
                <div className="flex flex-wrap justify-center gap-4 mt-2 text-sm text-gray-700">
                    {email && <span>{email}</span>}
                    {phone && <span>• {phone}</span>}
                    {location && <span>• {location}</span>}
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-1 text-sm text-blue-800">
                    {linkedinUrl && <a href={linkedinUrl} className="hover:underline">LinkedIn</a>}
                    {githubUrl && <a href={githubUrl} className="hover:underline">GitHub</a>}
                    {portfolioUrl && <a href={portfolioUrl} className="hover:underline">Portfolio</a>}
                </div>
            </div>

            {/* Summary */}
            {summary && (
                <div className="mb-6">
                    <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-2">Professional Summary</h2>
                    <p className="text-sm leading-relaxed">{summary}</p>
                </div>
            )}

            {/* Experience */}
            {experience && experience.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-3">Work Experience</h2>
                    <div className="flex flex-col gap-4">
                        {experience.map((exp, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold text-md">{exp.title}</h3>
                                    <span className="text-sm text-gray-600 italic">
                                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-700 font-semibold mb-1">
                                    {exp.company} {exp.location && `| ${exp.location}`}
                                </div>
                                {exp.description && (
                                    <p className="text-sm whitespace-pre-line mt-1">{exp.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Education */}
            {education && education.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-3">Education</h2>
                    <div className="flex flex-col gap-3">
                        {education.map((edu, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold text-md">{edu.institution}</h3>
                                    <span className="text-sm text-gray-600 italic">
                                        {edu.startYear} – {edu.endYear}
                                    </span>
                                </div>
                                <div className="text-sm">
                                    {edu.degree} {edu.field && `in ${edu.field}`}
                                    {edu.grade && <span className="text-gray-600 text-xs ml-2">(Grade: {edu.grade})</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills */}
            {skills && skills.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-2">Skills</h2>
                    <div className="text-sm flex flex-wrap gap-x-6 gap-y-2">
                        {skills.map((skill, idx) => (
                            <span key={idx} className="flex items-center">
                                • <strong className="ml-1">{skill.name}</strong>
                                {skill.proficiency && <span className="text-gray-600 ml-1">({skill.proficiency})</span>}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Projects */}
            {projects && projects.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-3">Projects</h2>
                    <div className="flex flex-col gap-3">
                        {projects.map((proj, idx) => (
                            <div key={idx}>
                                <h3 className="font-bold text-md">
                                    {proj.title}
                                    {proj.projectUrl && <a href={proj.projectUrl} className="text-xs text-blue-600 ml-2 font-normal hover:underline">[Link]</a>}
                                </h3>
                                {proj.description && <p className="text-sm">{proj.description}</p>}
                                {proj.techStack && proj.techStack.length > 0 && (
                                    <p className="text-xs text-gray-600 mt-1">
                                        Technologies: {proj.techStack.join(', ')}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfessionalTemplate;
