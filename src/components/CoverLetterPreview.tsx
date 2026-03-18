import React from 'react';
import { cn } from '../lib/utils';

export interface CoverLetterData {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
  };
  recipient: {
    name: string;
    position: string;
    company: string;
    address: string;
  };
  content: {
    date: string;
    subject: string;
    salutation: string;
    body: string;
    closing: string;
  };
}

interface CoverLetterPreviewProps {
  data: CoverLetterData;
  templateId: string;
  isMini?: boolean;
}

export default function CoverLetterPreview({ data, templateId, isMini = false }: CoverLetterPreviewProps) {
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
    width: isMini ? '200%' : '100%',
  };

  const splitBody = (text: string) => {
    const pages: string[] = [];
    let current = text || "I am writing to express my strong interest in the [Position] role at [Company]...";
    
    // First page has less space due to header/recipient info
    const firstPageLimit = 1500; 
    const subsequentPageLimit = 2500;

    let isFirst = true;
    while (current.length > (isFirst ? firstPageLimit : subsequentPageLimit)) {
      const limit = isFirst ? firstPageLimit : subsequentPageLimit;
      let splitIndex = current.lastIndexOf('\n', limit);
      if (splitIndex === -1 || splitIndex < limit * 0.7) {
        splitIndex = current.lastIndexOf(' ', limit);
      }
      if (splitIndex === -1) splitIndex = limit;
      
      pages.push(current.substring(0, splitIndex));
      current = current.substring(splitIndex).trim();
      isFirst = false;
    }
    pages.push(current);
    return pages;
  };

  const bodyPages = splitBody(data.content.body);

  const renderHeader = () => (
    <div className="mb-10">
      <h1 className="text-3xl font-bold text-primary mb-2">{data.personal.fullName || "Your Name"}</h1>
      <div className="flex flex-wrap gap-4 text-[10px] text-slate-500">
        <div className="flex items-center">{data.personal.email}</div>
        <div className="flex items-center">{data.personal.phone}</div>
        <div className="flex items-center">{data.personal.location}</div>
      </div>
    </div>
  );

  const renderRecipient = () => (
    <div className="mb-12 text-[10pt] text-slate-700 space-y-1">
      <div className="mb-6">{formatDate(data.content.date) || new Date().toLocaleDateString()}</div>
      <div className="font-bold text-slate-900">{data.recipient.name || "Hiring Manager"}</div>
      {data.recipient.position && <div>{data.recipient.position}</div>}
      <div>{data.recipient.company || "Company Name"}</div>
      <div className="max-w-[60%]">{data.recipient.address || "Company Address"}</div>
    </div>
  );

  const renderPage = (bodyPart: string, pageNum: number, totalPages: number) => {
    const isFirstPage = pageNum === 0;
    const isLastPage = pageNum === totalPages - 1;

    return (
      <div 
        key={pageNum} 
        data-page={pageNum + 1}
        className={cn(
          "bg-white shadow-lg mx-auto mb-8 relative flex flex-col page-container",
          isMini ? "w-full h-full" : "w-[210mm] min-h-[297mm] p-[20mm] text-slate-800"
        )}
        style={{
          boxSizing: 'border-box',
          fontSize: '11pt',
          lineHeight: '1.6',
        }}
      >
        {isFirstPage && (
          <>
            {templateId === 'modern' && (
              <div className="border-t-[6px] border-primary pt-10 mb-10">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <h1 className="text-4xl font-display font-bold text-primary tracking-tight mb-2">
                      {data.personal.fullName || "Your Name"}
                    </h1>
                    <div className="flex flex-col gap-1 text-[10pt] text-slate-500">
                      <div className="flex items-center">{data.personal.email}</div>
                      <div className="flex items-center">{data.personal.phone}</div>
                      <div className="flex items-center">{data.personal.location}</div>
                    </div>
                  </div>
                </div>
                <div className="h-px bg-slate-100 w-full mb-12" />
                {renderRecipient()}
              </div>
            )}
            {templateId === 'creative' && (
              <div className="flex -mx-[20mm] -mt-[20mm] mb-12 min-h-[60mm]">
                <div className="w-1/3 bg-primary text-white p-10 flex flex-col gap-8">
                  <div className="w-24 h-24 bg-accent rounded-3xl rotate-3 flex items-center justify-center text-primary font-bold text-4xl shadow-lg">
                    {data.personal.fullName?.charAt(0) || "Y"}
                  </div>
                  <div className="space-y-6 text-[9pt]">
                    <div className="font-bold uppercase tracking-[0.2em] text-accent border-b border-white-20 pb-2">Contact</div>
                    <div className="space-y-3 opacity-90">
                      <div className="flex items-center"><span className="break-all">{data.personal.email}</span></div>
                      <div className="flex items-center">{data.personal.phone}</div>
                      <div className="flex items-center">{data.personal.location}</div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-12 bg-slate-50-50">
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-1">{data.personal.fullName}</h1>
                    <div className="h-1 w-12 bg-accent" />
                  </div>
                  {renderRecipient()}
                </div>
              </div>
            )}
            {templateId === 'minimal' && (
              <div className="font-serif pt-10">
                <div className="text-center mb-16 border-b border-slate-900 pb-10">
                  <h1 className="text-4xl font-light tracking-[0.3em] uppercase mb-4 text-slate-900">{data.personal.fullName}</h1>
                  <div className="text-[9pt] text-slate-500 uppercase tracking-widest flex justify-center gap-6">
                    <span>{data.personal.location}</span>
                    <span>•</span>
                    <span>{data.personal.phone}</span>
                    <span>•</span>
                    <span>{data.personal.email}</span>
                  </div>
                </div>
                {renderRecipient()}
              </div>
            )}
          </>
        )}

        <div className={cn(
          "text-[11pt] text-slate-800 leading-[1.7] space-y-6 flex-1",
          templateId === 'minimal' && "font-serif",
          templateId === 'creative' && !isFirstPage && "pl-[10%]"
        )}>
          {isFirstPage && data.content.subject && (
            <div className="font-bold text-[12pt] text-primary border-b border-slate-100 pb-2 mb-6 uppercase tracking-wide">
              RE: {data.content.subject}
            </div>
          )}
          
          {/* Only render salutation if it's not already in the body to avoid duplicates */}
          {isFirstPage && data.content.salutation && !data.content.body.toLowerCase().includes(data.content.salutation.toLowerCase()) && (
            <div className="font-medium">{data.content.salutation}</div>
          )}

          <div className="whitespace-pre-wrap break-words">
            {bodyPart}
          </div>

          {/* Only render closing if it's the last page and not already in the body */}
          {isLastPage && (
            <div className="mt-12 pt-8 border-t border-slate-50">
              {!data.content.body.toLowerCase().includes(data.content.closing.toLowerCase()) && (
                <div className="mb-2">{data.content.closing}</div>
              )}
              {!data.content.body.toLowerCase().includes(data.personal.fullName.toLowerCase()) && (
                <div className="font-bold text-xl font-display text-primary">{data.personal.fullName}</div>
              )}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="absolute bottom-8 left-0 right-0 text-center text-[9pt] text-slate-300 font-medium tracking-widest uppercase">
            — Page {pageNum + 1} of {totalPages} —
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-slate-100" style={containerStyle}>
      {bodyPages.map((part, i) => renderPage(part, i, bodyPages.length))}
    </div>
  );
}
