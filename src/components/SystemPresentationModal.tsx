import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PRESENTATION_SLIDES, generatePresentationPdf, SlideContent } from '../utils/generatePresentationPdf';
import {
  X,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  Presentation,
  ShieldCheck,
  CheckCircle2,
  Building2,
  GraduationCap,
  Lock,
  Sparkles,
  FileText,
  HelpCircle
} from 'lucide-react';

export const SystemPresentationModal: React.FC = () => {
  const { isPresentationModalOpen, setIsPresentationModalOpen } = useApp();
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'slides' | 'overview'>('slides');

  const currentSlide: SlideContent = PRESENTATION_SLIDES[currentSlideIndex];

  // Keyboard navigation
  useEffect(() => {
    if (!isPresentationModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        setCurrentSlideIndex((prev) => (prev < PRESENTATION_SLIDES.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Escape') {
        setIsPresentationModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresentationModalOpen, setIsPresentationModalOpen]);

  if (!isPresentationModalOpen) return null;

  const handleDownloadPdf = () => {
    setIsGenerating(true);
    try {
      generatePresentationPdf();
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setTimeout(() => setIsGenerating(false), 800);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-900/80 backdrop-blur-xs overflow-y-auto">
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[95vh] overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="px-4 sm:px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white shadow-xs">
              <Presentation className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  StayVerify System Presentation & PDF
                </h2>
                <span className="bg-rose-500/20 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded border border-rose-500/30">
                  8 Slides
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Official presentation document for university stakeholders, students & landlords
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="hidden sm:flex bg-slate-800 p-0.5 rounded-xl border border-slate-700 text-xs">
              <button
                onClick={() => setViewMode('slides')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                  viewMode === 'slides' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Slide View
              </button>
              <button
                onClick={() => setViewMode('overview')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                  viewMode === 'overview' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All Slides
              </button>
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Print slides or save to PDF via browser print"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            {/* Download PDF Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-xs transition active:scale-95 disabled:opacity-75"
            >
              <Download className={`w-3.5 h-3.5 ${isGenerating ? 'animate-bounce' : ''}`} />
              <span>{isGenerating ? 'Building PDF...' : 'Download PDF'}</span>
            </button>

            {/* Close */}
            <button
              onClick={() => setIsPresentationModalOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition ml-1"
              title="Close Presentation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Presentation Body Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
          {viewMode === 'slides' ? (
            <div className="space-y-4">
              {/* Slide Navigator Pills */}
              <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
                <div className="flex items-center gap-1.5">
                  {PRESENTATION_SLIDES.map((slide, idx) => (
                    <button
                      key={slide.slideNumber}
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                        currentSlideIndex === idx
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      Slide {slide.slideNumber}
                    </button>
                  ))}
                </div>

                <div className="text-xs text-slate-500 font-semibold shrink-0">
                  {currentSlideIndex + 1} / {PRESENTATION_SLIDES.length}
                </div>
              </div>

              {/* Main Slide Card (Simulates Landscape Slide) */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                
                {/* Slide Top Banner */}
                <div className="bg-slate-900 text-white p-4 sm:p-5 border-b-2 border-rose-600">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase text-rose-400">
                      {currentSlide.category}
                    </span>
                    <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      Slide {currentSlide.slideNumber} of {currentSlide.totalSlides}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-xl font-black text-white mt-1">
                    {currentSlide.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                    {currentSlide.subtitle}
                  </p>
                </div>

                {/* Slide Columns */}
                <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 bg-slate-50/50">
                  {currentSlide.columns.map((col, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100 mb-3">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                            {col.title}
                          </h4>
                          {col.badge && (
                            <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              {col.badge}
                            </span>
                          )}
                        </div>

                        <ul className="space-y-2.5">
                          {col.points.map((pt, pIdx) => (
                            <li key={pIdx} className="text-xs text-slate-700 flex items-start gap-2 leading-relaxed">
                              <span className="text-rose-500 font-black mt-0.5">&bull;</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {col.highlight && (
                        <div className="mt-4 pt-3 border-t border-rose-100 bg-rose-50/60 -mx-4 -mb-4 p-3 rounded-b-xl text-[11px] font-semibold text-rose-900 flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <span>{col.highlight}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Slide Bottom Takeaway Bar */}
                <div className="bg-slate-100 border-t border-slate-200 p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs text-slate-800">
                    <span className="bg-slate-900 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
                      Takeaway
                    </span>
                    <span className="font-medium text-slate-700">
                      {currentSlide.keyTakeaway}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 italic shrink-0">
                    {currentSlide.footerNote}
                  </span>
                </div>
              </div>

              {/* Speaker Notes / Talking Guide Box to help user explain to others */}
              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-950 flex items-start gap-3 shadow-2xs">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-amber-900 block mb-0.5">
                    Presenter Notes & Talking Points for Slide {currentSlide.slideNumber}:
                  </strong>
                  <p className="text-[11px] leading-relaxed text-amber-900">
                    {currentSlide.slideNumber === 1 && "Start by introducing StayVerify as a dedicated anti-fraud accommodation network for NUST Bulawayo. Emphasize that it is not just a listing board, but an accredited ecosystem with three distinct portals."}
                    {currentSlide.slideNumber === 2 && "Explain the local Bulawayo housing reality: students lose hundreds of dollars to WhatsApp con artists demanding EcoCash viewing fees. Highlight why existing social media groups fail students."}
                    {currentSlide.slideNumber === 3 && "Walk the audience through the 3 dedicated portals (Student, Landlord, and Admin) and the 2-tier verification badge (Document Verified vs Physically Verified)."}
                    {currentSlide.slideNumber === 4 && "Showcase how students log in safely with their NUST ID, filter by suburb proximity to campus, chat in-app, and report suspicious listings in one click."}
                    {currentSlide.slideNumber === 5 && "Explain the Landlord Portal's accountability: landlords must provide legal documents (Title Deeds / Council Rates) to gain accreditation and list vacancies."}
                    {currentSlide.slideNumber === 6 && "Highlight the University Admin Portal: campus housing officers audit title deeds, conduct on-site physical visits, and export forensic evidence dossiers for the police."}
                    {currentSlide.slideNumber === 7 && "Detail the technical architecture: built on modern React 19 and Vite with offline PWA capabilities for low-bandwidth mobile networks, plus Vercel cloud deployment."}
                    {currentSlide.slideNumber === 8 && "Conclude with the measurable impact (zero deposit fraud on verified listings) and the strategic roadmap to expand across tertiary institutions in Zimbabwe."}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Overview of All Slides View */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  All 8 Presentation Slides Overview
                </h4>
                <button
                  onClick={handleDownloadPdf}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Complete PDF</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PRESENTATION_SLIDES.map((slide, idx) => (
                  <div
                    key={slide.slideNumber}
                    onClick={() => {
                      setCurrentSlideIndex(idx);
                      setViewMode('slides');
                    }}
                    className="bg-white rounded-xl border border-slate-200 p-4 hover:border-rose-300 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-rose-600 text-[10px] uppercase tracking-wider">
                          Slide {slide.slideNumber}
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                          {slide.category}
                        </span>
                      </div>
                      <h5 className="text-sm font-black text-slate-900">{slide.title}</h5>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{slide.subtitle}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
                      <span className="truncate pr-2">{slide.keyTakeaway}</span>
                      <span className="text-rose-600 font-bold shrink-0">Open &rarr;</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Slide Controller Footer */}
        <div className="px-4 sm:px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentSlideIndex === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={() => setCurrentSlideIndex((prev) => Math.min(PRESENTATION_SLIDES.length - 1, prev + 1))}
              disabled={currentSlideIndex === PRESENTATION_SLIDES.length - 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <span>Next Slide</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <span className="text-xs text-slate-400 hidden sm:inline-block ml-2">
              (Use Left/Right arrow keys to navigate)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-xs transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF Deck</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
