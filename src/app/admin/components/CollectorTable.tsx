import React, { useState } from "react";
import { Check, X, ShieldAlert } from "lucide-react";

export interface CollectorRecord {
  _id: string;
  name: string;
  email: string;
  preference: string;
  createdAt: string;
  allocationStatus: string;
  allocationTins?: number;
}

interface CollectorTableProps {
  collectors: CollectorRecord[];
  onUpdateStatus: (id: string, status: string) => void;
  onUpdateTins: (id: string, tins: number) => void;
}

const prefLabel = (p: string) => ({ rare: "Rare Harvest", "rare-blends": "Rare Blends", black: "First Flush" }[p] ?? p);
const fmtDate = (s: string) => new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const StatusBadge = ({ status }: { status: string }) => {
  const isApproved = status.toLowerCase() === "approved";
  const isPending = status.toLowerCase().includes("pending");
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
      isApproved ? "bg-green-500/10 text-green-700 border-green-500/25"
      : isPending ? "bg-amber-500/10 text-amber-700 border-amber-500/25"
      : "bg-red-500/10 text-red-700 border-red-500/25"
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isApproved ? "bg-green-600" : isPending ? "bg-amber-600" : "bg-red-600"}`} />
      {status}
    </span>
  );
};

export const CollectorTable: React.FC<CollectorTableProps> = ({ collectors, onUpdateStatus, onUpdateTins }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTins, setEditingTins] = useState(1);

  if (collectors.length === 0) {
    return (
      <div className="bg-ivory border border-gold/15 p-12 flex flex-col items-center gap-3 text-center">
        <ShieldAlert className="w-7 h-7 text-gold/30" />
        <p className="text-forest/40 font-sans text-xs tracking-widest uppercase">No collectors registered yet</p>
      </div>
    );
  }

  return (
    <div className="bg-ivory border border-gold/15 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gold/10 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-serif text-forest font-medium">Collector Ledger</h3>
          <p className="text-[10px] text-forest/40 font-sans tracking-wide mt-0.5">{collectors.length} registered members</p>
        </div>
        <span className="text-[9px] font-sans text-gold border border-gold/30 px-2.5 py-1 uppercase tracking-widest font-semibold bg-forest hidden sm:inline">Live DB</span>
      </div>

      {/* Mobile: Card list */}
      <div className="sm:hidden divide-y divide-gold/5">
        {collectors.map((r) => {
          const isPending = r.allocationStatus.toLowerCase().includes("pending");
          return (
            <div key={r._id} className="p-4 flex flex-col gap-3">
              {/* Name + status */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-serif font-bold text-forest text-sm leading-tight">{r.name}</p>
                  <p className="text-[10px] text-forest/50 mt-0.5">{r.email}</p>
                </div>
                <StatusBadge status={r.allocationStatus} />
              </div>

              {/* Meta row */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-gold/10 text-gold-dark border border-gold/15">
                  {prefLabel(r.preference)}
                </span>
                <span className="text-[10px] text-forest/40 font-sans">{fmtDate(r.createdAt)}</span>
                {/* Tins inline edit */}
                {editingId === r._id ? (
                  <div className="flex items-center gap-1.5 ml-auto">
                    <input
                      type="number" min="1" max="3"
                      value={editingTins}
                      onChange={(e) => setEditingTins(Number(e.target.value))}
                      className="w-12 text-center border border-gold/40 bg-ivory focus:outline-none py-1 text-xs font-sans"
                    />
                    <button onClick={() => { onUpdateTins(r._id, editingTins); setEditingId(null); }}
                      className="p-1.5 text-green-600 bg-green-50 border border-green-200 cursor-pointer">
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setEditingId(null)} className="p-1.5 text-forest/40 border border-forest/10 cursor-pointer">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => { setEditingId(r._id); setEditingTins(r.allocationTins || 1); }}
                    className="ml-auto text-[10px] font-bold text-forest/60 hover:text-gold cursor-pointer border border-gold/20 px-2 py-1 transition-colors">
                    {r.allocationTins || 1} tin{(r.allocationTins || 1) !== 1 ? "s" : ""}
                  </button>
                )}
              </div>

              {/* Action buttons */}
              {isPending && (
                <div className="flex gap-2">
                  <button onClick={() => onUpdateStatus(r._id, "Approved")}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white bg-green-700 hover:bg-green-800 transition-all cursor-pointer min-h-[40px]">
                    <Check className="w-3 h-3" /> Approve
                  </button>
                  <button onClick={() => onUpdateStatus(r._id, "Declined")}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[10px] font-bold uppercase tracking-wider text-forest/70 border border-forest/15 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all cursor-pointer min-h-[40px]">
                    <X className="w-3 h-3" /> Decline
                  </button>
                </div>
              )}
              {!isPending && (
                <button onClick={() => onUpdateStatus(r._id, "Pending Cellar Maturity")}
                  className="text-[10px] font-sans text-forest/35 hover:text-gold uppercase tracking-wider font-semibold cursor-pointer text-left transition-colors py-1">
                  Reset to Pending →
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop: Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse font-sans text-xs">
          <thead>
            <tr className="border-b border-gold/10 bg-forest/5 text-forest/50 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-5">Collector</th>
              <th className="py-3 px-5">Preference</th>
              <th className="py-3 px-5">Date</th>
              <th className="py-3 px-5 text-center">Tins</th>
              <th className="py-3 px-5">Status</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/5">
            {collectors.map((r) => {
              const isPending = r.allocationStatus.toLowerCase().includes("pending");
              return (
                <tr key={r._id} className="hover:bg-forest/5 transition-colors">
                  <td className="py-3.5 px-5">
                    <p className="font-serif font-bold text-forest text-sm leading-tight">{r.name}</p>
                    <p className="text-[10px] text-forest/45 mt-0.5">{r.email}</p>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-gold/10 text-gold-dark border border-gold/15">
                      {prefLabel(r.preference)}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-forest/60">{fmtDate(r.createdAt)}</td>
                  <td className="py-3.5 px-5 text-center">
                    {editingId === r._id ? (
                      <div className="flex items-center justify-center gap-1">
                        <input type="number" min="1" max="3" value={editingTins}
                          onChange={(e) => setEditingTins(Number(e.target.value))}
                          className="w-12 text-center border border-gold/40 bg-ivory focus:outline-none py-1 text-xs" />
                        <button onClick={() => { onUpdateTins(r._id, editingTins); setEditingId(null); }}
                          className="p-1 text-green-600 cursor-pointer"><Check className="w-3.5 h-3.5" /></button>
                      </div>
                    ) : (
                      <button onClick={() => { setEditingId(r._id); setEditingTins(r.allocationTins || 1); }}
                        className="hover:text-gold cursor-pointer font-bold transition-colors">
                        {r.allocationTins || 1} tins
                      </button>
                    )}
                  </td>
                  <td className="py-3.5 px-5"><StatusBadge status={r.allocationStatus} /></td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {isPending ? (
                        <>
                          <button onClick={() => onUpdateStatus(r._id, "Approved")}
                            className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white bg-green-700 hover:bg-green-800 cursor-pointer flex items-center gap-1">
                            <Check className="w-3 h-3" /> Approve
                          </button>
                          <button onClick={() => onUpdateStatus(r._id, "Declined")}
                            className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-forest/70 border border-forest/15 hover:bg-red-50 hover:text-red-700 cursor-pointer flex items-center gap-1">
                            <X className="w-3 h-3" /> Decline
                          </button>
                        </>
                      ) : (
                        <button onClick={() => onUpdateStatus(r._id, "Pending Cellar Maturity")}
                          className="text-[10px] text-forest/35 hover:text-gold uppercase tracking-wider font-semibold cursor-pointer transition-colors">
                          Reset
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
