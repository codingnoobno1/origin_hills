import React, { useState } from "react";
import { Check, X, ShieldAlert, Sparkles } from "lucide-react";

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

export const CollectorTable: React.FC<CollectorTableProps> = ({
  collectors,
  onUpdateStatus,
  onUpdateTins,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTins, setEditingTins] = useState<number>(1);

  const handleStartEdit = (record: CollectorRecord) => {
    setEditingId(record._id);
    setEditingTins(record.allocationTins || 1);
  };

  const handleSaveTins = (id: string) => {
    onUpdateTins(id, editingTins);
    setEditingId(null);
  };

  const getPreferenceLabel = (pref: string) => {
    switch (pref) {
      case "rare":
        return "Rare Harvest";
      case "rare-blends":
        return "Rare Blends";
      case "black":
        return "First Flush";
      default:
        return pref;
    }
  };

  const formatDate = (isoStr: string) => {
    return new Date(isoStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-ivory border border-gold/15 shadow-sm relative overflow-hidden animate-fade-in">
      {/* Title */}
      <div className="p-6 border-b border-gold/15 flex items-center justify-between bg-ivory-light flex-wrap gap-4">
        <div>
          <h3 className="text-base font-serif text-forest tracking-wide font-medium">
            Collectors Enrollment Ledger
          </h3>
          <p className="text-[10px] text-forest/40 font-sans tracking-wide mt-0.5">
            Active registration database sourced from live MongoDB Atlas records
          </p>
        </div>
        <span className="text-[9px] font-sans text-gold border border-gold/30 px-3 py-1 uppercase tracking-widest font-semibold bg-forest">
          Ledger Safe Connection
        </span>
      </div>

      {/* Responsive Table wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse font-sans text-xs">
          <thead>
            <tr className="border-b border-gold/15 bg-forest/5 text-forest/50 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-4 px-6">Collector Details</th>
              <th className="py-4 px-6">Preference</th>
              <th className="py-4 px-6">Enrollment Date</th>
              <th className="py-4 px-6 text-center">Allocated Tins</th>
              <th className="py-4 px-6">Allocation Status</th>
              <th className="py-4 px-6 text-right">Actions ledger</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/5">
            {collectors.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-forest/40">
                  <ShieldAlert className="w-6 h-6 text-gold/40 mx-auto mb-2" />
                  No registered collectors found in the database.
                </td>
              </tr>
            ) : (
              collectors.map((record) => {
                const isPending = record.allocationStatus.toLowerCase().includes("pending");
                const isApproved = record.allocationStatus.toLowerCase() === "approved";
                
                return (
                  <tr key={record._id} className="hover:bg-forest/5 transition-all duration-300">
                    {/* Collector Details */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-forest text-sm font-serif">
                          {record.name}
                        </span>
                        <span className="text-[10px] text-forest/50 font-sans">
                          {record.email}
                        </span>
                      </div>
                    </td>

                    {/* Preference */}
                    <td className="py-4 px-6">
                      <span className="px-2 py-0.5 text-[9px] font-semibold tracking-wider bg-gold/10 text-gold-dark border border-gold/15 uppercase">
                        {getPreferenceLabel(record.preference)}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-forest/70 font-light">
                      {formatDate(record.createdAt)}
                    </td>

                    {/* Tins */}
                    <td className="py-4 px-6 text-center">
                      {editingId === record._id ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <input
                            type="number"
                            min="1"
                            max="3"
                            value={editingTins}
                            onChange={(e) => setEditingTins(Number(e.target.value))}
                            className="w-12 text-center border border-gold/40 bg-ivory focus:outline-none focus:border-gold py-1 text-xs"
                          />
                          <button
                            onClick={() => handleSaveTins(record._id)}
                            className="p-1 text-green-600 hover:bg-green-50 cursor-pointer"
                            title="Save Allocation"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(record)}
                          className="hover:text-gold transition-colors font-bold cursor-pointer text-xs"
                          title="Click to Adjust Limits"
                        >
                          {record.allocationTins || 1} tins
                        </button>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        isApproved
                          ? "bg-green-500/10 text-green-700 border border-green-500/25"
                          : isPending
                          ? "bg-amber-500/10 text-amber-700 border border-amber-500/25"
                          : "bg-red-500/10 text-red-700 border border-red-500/25"
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${
                          isApproved ? "bg-green-600" : isPending ? "bg-amber-600" : "bg-red-600"
                        }`} />
                        {record.allocationStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isPending ? (
                          <>
                            <button
                              onClick={() => onUpdateStatus(record._id, "Approved")}
                              className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider text-white bg-green-700 hover:bg-green-800 transition-all rounded-none cursor-pointer flex items-center gap-1 shadow-sm"
                            >
                              <Check className="w-3 h-3" /> Approve
                            </button>
                            <button
                              onClick={() => onUpdateStatus(record._id, "Declined")}
                              className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider text-forest/75 border border-forest/15 bg-white hover:bg-red-50 hover:text-red-700 hover:border-red-500/20 transition-all rounded-none cursor-pointer flex items-center gap-1"
                            >
                              <X className="w-3 h-3" /> Decline
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => onUpdateStatus(record._id, "Pending Cellar Maturity")}
                            className="text-[10px] font-sans text-forest/40 hover:text-gold uppercase tracking-wider font-semibold cursor-pointer"
                          >
                            Reset to Pending
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
