import React from 'react';
import { Mail, Phone, MapPin, FileText } from 'lucide-react';

export interface CVData {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    school: string;
    degree: string;
    year: string;
  }>;
  skills: string[];
  references: Array<{
    id: string;
    name: string;
    position: string;
    company: string;
    phone: string;
    email?: string;
  }>;
}

interface CVPreviewProps {
  data: CVData;
  templateId: string;
  isMini?: boolean;
}

export default function CVPreview({ data, templateId, isMini = false }: CVPreviewProps) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    }
    return dateStr;
  };

  const containerStyle = { 
    fontFamily: 'Inter, sans-serif',
    transform: isMini ? 'scale(0.5)' : 'none',
    transformOrigin: 'top left',
    width: isMini ? '200%' : '210mm',
    minHeight: isMini ? '200%' : '297mm',
    boxSizing: 'border-box' as const,
  };

  const getInitials = (name: string) => {
    if (!name) return '??';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '??';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  if (templateId === 'creative') {
    return (
      <div className="bg-white shadow-lg mx-auto mb-8 relative flex page-container" style={containerStyle}>
        <div className="w-1/3 bg-primary text-white p-10 flex flex-col gap-8">
          <div className="w-32 h-32 bg-accent rounded-full mx-auto border-4 border-white-20 flex items-center justify-center shadow-xl">
            <span className="text-4xl font-bold text-white tracking-wider">{getInitials(data.personal.fullName)}</span>
          </div>
          <div className="space-y-8">
            <div>
              <h2 className="text-[11pt] font-bold uppercase tracking-[0.2em] text-primary mb-4 border-b border-white-10 pb-2">Contact</h2>
              <div className="space-y-4 text-[9pt] opacity-90">
                {data.personal.email && <div className="flex items-start gap-2"><span className="text-primary font-bold shrink-0">E:</span> <span className="break-all">{data.personal.email}</span></div>}
                {data.personal.phone && <div className="flex items-start gap-2"><span className="text-primary font-bold shrink-0">P:</span> {data.personal.phone}</div>}
                {data.personal.location && <div className="flex items-start gap-2"><span className="text-primary font-bold shrink-0">L:</span> {data.personal.location}</div>}
              </div>
            </div>
            {data.skills.length > 0 && (
              <div>
                <h2 className="text-[11pt] font-bold uppercase tracking-[0.2em] text-accent mb-4 border-b border-white-10 pb-2">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, index) => (
                    <span key={`${skill}-${index}`} className="px-3 py-1 bg-white-10 rounded-full text-[8pt] text-white border border-white-5">{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 p-12 bg-white overflow-visible">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4 break-words leading-tight w-full">{data.personal.fullName || "Your Name"}</h1>
          </div>
          {data.personal.summary && (
            <div className="mb-12">
              <h2 className="text-[11pt] font-bold uppercase tracking-[0.2em] text-primary mb-4 flex items-center gap-3">
                <div className="w-8 h-px bg-accent" /> About Me
              </h2>
              <p className="text-slate-600 leading-relaxed text-[10pt]">{data.personal.summary}</p>
            </div>
          )}
          {data.experience.length > 0 && (
            <div className="mb-12">
              <h2 className="text-[11pt] font-bold uppercase tracking-[0.2em] text-primary mb-6 flex items-center gap-3">
                <div className="w-8 h-px bg-accent" /> Experience
              </h2>
              <div className="space-y-8">
                {data.experience.map(exp => (
                  <div key={exp.id} className="relative pl-6 border-l-2 border-slate-50">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 bg-accent rounded-full border-4 border-white" />
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-slate-900 text-[11pt]">{exp.position}</h3>
                      <span className="text-[9pt] font-medium text-slate-400">{formatDate(exp.startDate)} — {formatDate(exp.endDate)}</span>
                    </div>
                    <div className="text-accent font-bold text-[10pt] mb-3">{exp.company}</div>
                    <p className="text-slate-600 text-[10pt] leading-relaxed whitespace-pre-line">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {data.education.length > 0 && (
            <div className="mb-12">
              <h2 className="text-[11pt] font-bold uppercase tracking-[0.2em] text-primary mb-6 flex items-center gap-3">
                <div className="w-8 h-px bg-accent" /> Education
              </h2>
              <div className="space-y-6">
                {data.education.map(edu => (
                  <div key={edu.id} className="relative pl-6 border-l-2 border-slate-50">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 bg-accent rounded-full border-4 border-white" />
                    <div className="font-bold text-slate-900 text-[11pt] mb-1">{edu.degree}</div>
                    <div className="text-accent font-medium text-[10pt] mb-1">{edu.school}</div>
                    <div className="text-slate-400 text-[9pt]">{formatDate(edu.year)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {data.references.length > 0 && (
            <div className="mb-12">
              <h2 className="text-[11pt] font-bold uppercase tracking-[0.2em] text-primary mb-6 flex items-center gap-3">
                <div className="w-8 h-px bg-accent" /> References
              </h2>
              <div className="grid grid-cols-2 gap-8">
                {data.references.map(ref => (
                  <div key={ref.id} className="text-[10pt]">
                    <div className="font-bold text-slate-900 mb-1">{ref.name}</div>
                    <div className="text-accent text-[9pt] mb-2">{ref.position} at {ref.company}</div>
                    <div className="text-slate-500 space-y-1">
                      <div>{ref.phone}</div>
                      {ref.email && <div>{ref.email}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (templateId === 'minimal') {
    return (
      <div className="bg-white shadow-lg mx-auto mb-8 flex flex-col items-center page-container" style={containerStyle}>
        <div className="w-full p-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-light tracking-[0.2em] text-slate-900 uppercase mb-6 break-words leading-tight w-full">{data.personal.fullName || "Your Name"}</h1>
            <div className="flex flex-wrap text-[9pt] text-slate-400 uppercase tracking-[0.2em] justify-center">
              <span className="mx-4">{data.personal.email}</span>
              <span className="mx-4">•</span>
              <span className="mx-4">{data.personal.phone}</span>
              <span className="mx-4">•</span>
              <span className="mx-4">{data.personal.location}</span>
            </div>
          </div>
          <div className="max-w-3xl mx-auto space-y-16">
            {data.personal.summary && (
              <div className="text-center italic text-slate-500 leading-relaxed text-[11pt] font-serif px-12">
                "{data.personal.summary}"
              </div>
            )}
            {data.experience.length > 0 && (
              <div className="space-y-10">
                <h2 className="text-[11pt] font-bold text-center uppercase tracking-[0.4em] text-slate-900 border-b border-slate-100 pb-4">Experience</h2>
                {data.experience.map(exp => (
                  <div key={exp.id} className="text-center group">
                    <div className="font-bold text-slate-900 text-[12pt] mb-1">{exp.position}</div>
                    <div className="text-[10pt] text-slate-400 uppercase tracking-widest mb-4">{exp.company} | {formatDate(exp.startDate)} — {formatDate(exp.endDate)}</div>
                    <p className="text-slate-600 text-[10pt] leading-relaxed font-serif max-w-2xl mx-auto">{exp.description}</p>
                  </div>
                ))}
              </div>
            )}
            {data.education.length > 0 && (
              <div className="space-y-10">
                <h2 className="text-[11pt] font-bold text-center uppercase tracking-[0.4em] text-slate-900 border-b border-slate-100 pb-4">Education</h2>
                {data.education.map(edu => (
                  <div key={edu.id} className="text-center">
                    <div className="font-bold text-slate-900 text-[11pt] mb-1">{edu.degree}</div>
                    <div className="text-[10pt] text-slate-500 font-serif">{edu.school} | {formatDate(edu.year)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (templateId === 'executive') {
    return (
      <div className="bg-white shadow-lg mx-auto mb-8 border-t-[16px] border-primary page-container" style={containerStyle}>
        <div className="p-16">
          <div className="flex justify-between items-end mb-16 border-b-2 border-slate-100 pb-8">
            <div>
              <h1 className="text-4xl font-display font-bold text-primary mb-3 break-words leading-tight w-full">{data.personal.fullName || "Your Name"}</h1>
              <div className="text-slate-500 text-[10pt] font-medium tracking-wide flex flex-wrap">
                <span className="mr-4">{data.personal.location}</span>
                <span className="text-accent mr-4">|</span>
                <span className="mr-4">{data.personal.phone}</span>
                <span className="text-accent mr-4">|</span>
                <span className="mr-4">{data.personal.email}</span>
              </div>
            </div>
            <div className="w-20 h-20 bg-slate-50 border border-slate-100 flex items-center justify-center text-primary-20">
              <FileText size={48} className="shrink-0" />
            </div>
          </div>
          <div className="grid grid-cols-12 gap-12">
            <div className="col-span-8 space-y-12">
              {data.personal.summary && (
                <div>
                  <h2 className="text-[12pt] font-bold text-primary uppercase border-l-4 border-accent pl-4 mb-6">Executive Profile</h2>
                  <p className="text-slate-700 text-[10pt] leading-relaxed text-justify">{data.personal.summary}</p>
                </div>
              )}
              {data.experience.length > 0 && (
                <div>
                  <h2 className="text-[12pt] font-bold text-primary uppercase border-l-4 border-accent pl-4 mb-8">Professional Experience</h2>
                  <div className="space-y-10">
                    {data.experience.map(exp => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-bold text-slate-900 text-[12pt]">{exp.company}</h3>
                          <span className="text-[10pt] font-bold text-slate-400">{formatDate(exp.startDate)} — {formatDate(exp.endDate)}</span>
                        </div>
                        <div className="italic text-primary text-[11pt] font-medium mb-3">{exp.position}</div>
                        <p className="text-slate-600 text-[10pt] leading-relaxed whitespace-pre-line">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="col-span-4 space-y-12">
              {data.skills.length > 0 && (
                <div className="bg-slate-50 p-6 rounded-xl">
                  <h2 className="text-[11pt] font-bold text-primary uppercase mb-6 border-b border-slate-200 pb-2">Expertise</h2>
                  <ul className="space-y-3">
                    {data.skills.map((skill, index) => (
                      <li key={`${skill}-${index}`} className="flex items-start gap-3 text-[10pt] text-slate-700">
                        <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 shrink-0" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {data.education.length > 0 && (
                <div>
                  <h2 className="text-[11pt] font-bold text-primary uppercase mb-6 border-b border-slate-200 pb-2">Education</h2>
                  <div className="space-y-6">
                    {data.education.map(edu => (
                      <div key={edu.id}>
                        <div className="font-bold text-slate-900 text-[10pt] mb-1">{edu.degree}</div>
                        <div className="text-slate-500 text-[9pt]">{edu.school}</div>
                        <div className="text-slate-400 text-[9pt] font-medium">{formatDate(edu.year)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {data.references.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-[11pt] font-bold text-primary uppercase mb-6 border-b border-slate-200 pb-2">References</h2>
                  <div className="space-y-6">
                    {data.references.map(ref => (
                      <div key={ref.id} className="text-[10pt]">
                        <div className="font-bold text-slate-900 mb-1">{ref.name}</div>
                        <div className="text-primary text-[9pt] mb-1">{ref.position} | {ref.company}</div>
                        <div className="text-slate-500 flex flex-wrap gap-x-4">
                          <span>{ref.phone}</span>
                          {ref.email && <span>{ref.email}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Modern (Default)
  return (
    <div className="bg-white shadow-lg mx-auto mb-8 page-container" style={containerStyle}>
      <div className="p-16">
        <div className="border-b-2 border-slate-100 pb-8 mb-10">
          <h1 className="text-4xl font-bold text-primary uppercase mb-4 break-words leading-tight w-full">
            {data.personal.fullName || "Your Name"}
          </h1>
          <div className="flex flex-wrap text-slate-500 text-[10pt] font-medium gap-y-2">
            {data.personal.email && <div className="flex items-center mr-8"><span className="text-primary font-bold mr-2">Email:</span> {data.personal.email}</div>}
            {data.personal.phone && <div className="flex items-center mr-8"><span className="text-primary font-bold mr-2">Phone:</span> {data.personal.phone}</div>}
            {data.personal.location && <div className="flex items-center mr-8"><span className="text-primary font-bold mr-2">Location:</span> {data.personal.location}</div>}
          </div>
        </div>

        {data.personal.summary && (
          <div className="mb-12">
            <h2 className="text-[12pt] font-bold text-primary uppercase tracking-wider mb-4 border-l-4 border-accent pl-4">Professional Summary</h2>
            <p className="text-slate-600 leading-relaxed text-[10pt]">{data.personal.summary}</p>
          </div>
        )}

        {data.experience.length > 0 && (
          <div className="mb-12">
            <h2 className="text-[12pt] font-bold text-primary uppercase tracking-wider mb-6 border-l-4 border-accent pl-4">Work Experience</h2>
            <div className="space-y-8">
              {data.experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="font-bold text-slate-900 text-[11pt]">{exp.position || "Position"}</h3>
                    <span className="text-[9pt] font-bold text-slate-400 uppercase tracking-wider">{formatDate(exp.startDate)} — {formatDate(exp.endDate)}</span>
                  </div>
                  <div className="text-primary font-bold mb-3 text-[10pt]">{exp.company || "Company"}</div>
                  <p className="text-slate-600 whitespace-pre-line text-[10pt] leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-12">
          {data.education.length > 0 && (
            <div>
              <h2 className="text-[12pt] font-bold text-primary uppercase tracking-wider mb-6 border-l-4 border-accent pl-4">Education</h2>
              <div className="space-y-6">
                {data.education.map(edu => (
                  <div key={edu.id}>
                    <h3 className="font-bold text-slate-900 text-[10pt] mb-1">{edu.degree || "Degree"}</h3>
                    <div className="text-primary font-medium text-[9pt] mb-1">{edu.school || "School"}</div>
                    <div className="text-slate-400 text-[9pt] font-bold uppercase">{formatDate(edu.year)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.skills.length > 0 && (
            <div>
              <h2 className="text-[12pt] font-bold text-primary uppercase tracking-wider mb-6 border-l-4 border-accent pl-4">Core Skills</h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <span key={`${skill}-${index}`} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-700 font-bold text-[9pt]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {data.references && data.references.length > 0 && (
          <div className="mt-12 pt-10 border-t border-slate-100">
            <h2 className="text-[12pt] font-bold text-primary uppercase tracking-wider mb-6 border-l-4 border-accent pl-4">References</h2>
            <div className="grid grid-cols-2 gap-8">
              {data.references.map(ref => (
                <div key={ref.id} className="text-[10pt] p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="font-bold text-slate-900 mb-1">{ref.name}</div>
                  <div className="text-primary font-medium text-[9pt] mb-2">{ref.position} at {ref.company}</div>
                  <div className="text-slate-500 text-[9pt] flex flex-col gap-1">
                    <div className="flex items-center"><span className="text-primary font-bold mr-2">P:</span> {ref.phone}</div>
                    {ref.email && <div className="flex items-center"><span className="text-primary font-bold mr-2">E:</span> {ref.email}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
