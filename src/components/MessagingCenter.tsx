import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  ShieldAlert,
  ShieldCheck,
  Send,
  AlertTriangle,
  Lock,
  FileText,
  User,
  Clock,
  CheckCheck,
  AlertOctagon,
  Sparkles
} from 'lucide-react';
import { SCAM_KEYWORDS } from '../data/seedData';

export const MessagingCenter: React.FC = () => {
  const {
    currentUser,
    conversations,
    messages,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    reports,
    setIsReportModalOpen,
    setReportTargetListing,
    listings
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [scamAlertTriggered, setScamAlertTriggered] = useState<{ detected: boolean; keywords: string[] }>({
    detected: false,
    keywords: []
  });

  const activeConv = conversations.find(c => c.id === activeConversationId) || conversations[0];
  const activeListing = activeConv ? listings.find(l => l.id === activeConv.listingId) : null;
  const convMessages = activeConv ? messages.filter(m => m.conversationId === activeConv.id) : [];

  // Check if landlord has pending or upheld reports (FR-15)
  const landlordHasReports = activeConv ? reports.some(r => r.targetUserId === activeConv.landlordId) : false;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeConv) return;

    const result = sendMessage(activeConv.id, inputMessage);
    if (result.scamDetected) {
      setScamAlertTriggered({ detected: true, keywords: result.flaggedPhrases });
    } else {
      setScamAlertTriggered({ detected: false, keywords: [] });
    }

    setInputMessage('');
  };

  // Quick message template insertion
  const handleInsertTemplate = (phrase: string) => {
    setInputMessage(phrase);
  };

  return (
    <div id="messaging-center" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row h-[720px] max-h-[85vh]">
      {/* Sidebar: Conversations list */}
      <div className="w-full md:w-80 border-r border-slate-200 flex flex-col bg-slate-50">
        <div className="p-4 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>In-Platform Messages</span>
            </h2>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-600" />
              E2E Logged (FR-14)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Phone numbers kept private for safety (NFR-02)</p>
        </div>

        {/* Conversation List */}
        <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
          {conversations.length > 0 ? (
            conversations.map((conv) => {
              const isSelected = conv.id === (activeConv?.id);
              const otherPartyName = currentUser.role === 'landlord' ? conv.studentName : conv.landlordName;
              const hasReportFlag = reports.some(r => r.targetUserId === conv.landlordId);

              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    setActiveConversationId(conv.id);
                    setScamAlertTriggered({ detected: false, keywords: [] });
                  }}
                  className={`p-3.5 cursor-pointer transition flex items-start gap-3 ${
                    isSelected ? 'bg-blue-50/80 border-l-4 border-blue-600' : 'hover:bg-slate-100/70'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {otherPartyName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900 truncate">{otherPartyName}</p>
                      <span className="text-[10px] text-slate-400">
                        {new Date(conv.lastMessageTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-[11px] text-blue-700 font-medium truncate">{conv.listingTitle}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{conv.lastMessage}</p>

                    {hasReportFlag && (
                      <span className="mt-1 inline-flex items-center gap-1 text-[9px] bg-red-100 text-red-800 px-1.5 py-0.2 rounded font-bold">
                        <AlertTriangle className="w-2.5 h-2.5 text-red-600" />
                        Active Scam Flag
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-6 text-center text-xs text-slate-400">No active messages</div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      {activeConv ? (
        <div className="flex-1 flex flex-col bg-white">
          {/* Chat Header with Safety Status */}
          <div className="px-5 py-3 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                {(currentUser.role === 'landlord' ? activeConv.studentName : activeConv.landlordName).charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                    {currentUser.role === 'landlord' ? activeConv.studentName : activeConv.landlordName}
                  </h3>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.2 rounded font-medium">
                    {currentUser.role === 'landlord' ? 'Student Inquirer' : 'Host / Landlord'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate max-w-sm">Regarding: {activeConv.listingTitle}</p>
              </div>
            </div>

            {/* Quick Report Button (FR-16) */}
            <button
              onClick={() => {
                if (activeListing) setReportTargetListing(activeListing);
                setIsReportModalOpen(true);
              }}
              className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
              <span>Report Landlord / Chat (FR-16)</span>
            </button>
          </div>

          {/* Real-time Safety Warning Banners (FR-15 & FR-20) */}
          {landlordHasReports && (
            <div className="bg-red-600 text-white px-4 py-2 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2 font-medium">
                <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
                <span>
                  <strong>Safety Notice (FR-15):</strong> This landlord account currently has active scam reports filed by students. Do NOT send any deposit before physical inspection!
                </span>
              </div>
            </div>
          )}

          {/* System Safety Notice Bar */}
          <div className="bg-amber-50/80 border-b border-amber-200/60 px-4 py-1.5 text-[11px] text-amber-900 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>
              <strong>StayVerify Scam Shield:</strong> Never send EcoCash, Zipit, or cash holding fees before a physical walk-through with verified keys.
            </span>
          </div>

          {/* Messages Stream (FR-14) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
            {convMessages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className="text-[10px] font-semibold text-slate-500">{msg.senderName}</span>
                    <span className="text-[9px] text-slate-400">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs shadow-2xs ${
                      isMe
                        ? 'bg-blue-600 text-white rounded-tr-xs'
                        : msg.isSystemWarning
                        ? 'bg-red-50 text-red-900 border border-red-300 rounded-tl-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                    {/* Highlighted Scam Red Flag Warning (FR-20) */}
                    {msg.flaggedScamPhrases && msg.flaggedScamPhrases.length > 0 && (
                      <div className="mt-2 pt-1.5 border-t border-red-200/60 text-[10px] text-red-700 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-red-600 shrink-0" />
                        <span>High-Risk Scam Language Flagged: "{msg.flaggedScamPhrases.join(', ')}"</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Inquiry Templates */}
          <div className="px-4 py-1.5 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600">
            <span className="font-semibold text-slate-700 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-600" />
              Quick Templates:
            </span>
            <button
              type="button"
              onClick={() => handleInsertTemplate('Please send $50 EcoCash deposit first to reserve the room before viewing.')}
              className="bg-white hover:bg-slate-200 border border-slate-300 px-2 py-0.5 rounded text-[10px] transition text-red-700"
            >
              ⚠️ "Send deposit first before viewing"
            </button>
            <button
              type="button"
              onClick={() => handleInsertTemplate('When is convenient for an in-person physical inspection tomorrow?')}
              className="bg-white hover:bg-slate-200 border border-slate-300 px-2 py-0.5 rounded text-[10px] transition text-emerald-700"
            >
              ✅ "Schedule in-person inspection"
            </button>
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex gap-2 items-center">
            <input
              id="message-input-field"
              type="text"
              placeholder="Type your message (logged safely with StayVerify Scam Shield)..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              id="send-message-btn"
              type="submit"
              disabled={!inputMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white p-2.5 rounded-xl transition shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
          Select a conversation from the sidebar to chat safely
        </div>
      )}
    </div>
  );
};
