"use client";

import React, { useState, useEffect } from "react";
import adminContactService, { ContactMessageItem } from "@/services/contact";
import {
  Mail,
  Search,
  CheckCircle2,
  AlertOctagon,
  Trash2,
  Eye,
  RefreshCw,
  MessageSquare,
  ShieldAlert,
  X,
  Filter,
} from "lucide-react";

export default function AdminContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageItem | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await adminContactService.getContactMessages({
        status: activeStatus,
        search: searchQuery,
      });
      setMessages(res.data || []);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [activeStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMessages();
  };

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      await adminContactService.updateContactStatus(id, newStatus);
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, status: newStatus as any });
      }
      fetchMessages();
    } catch (err) {
      alert("Failed to update message status");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      await adminContactService.deleteContactMessage(id);
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null);
      }
      fetchMessages();
    } catch (err) {
      alert("Failed to delete message");
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">NEW</span>;
      case "read":
        return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700">READ</span>;
      case "replied":
        return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700">REPLIED</span>;
      case "resolved":
        return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">RESOLVED</span>;
      case "spam":
        return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">SPAM</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600">{status}</span>;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Mail className="w-6 h-6 text-blue-600" />
            <span>Contact & Support Messages</span>
          </h1>
          <p className="text-sm text-gray-500">
            Manage incoming support inquiries, bug reports, feature requests, and user feedback.
          </p>
        </div>

        <button
          onClick={fetchMessages}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-gray-50 text-gray-700 self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {["all", "new", "read", "replied", "resolved", "spam"].map((st) => (
            <button
              key={st}
              onClick={() => setActiveStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeStatus === st
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search sender, subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-800"
          >
            Search
          </button>
        </form>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm font-medium text-gray-500">
            Loading contact messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-500">
            No contact messages found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b text-xs font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Sender</th>
                  <th className="px-4 py-3">Reason</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Tool Context</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {messages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">#{msg.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900">{msg.name}</div>
                      <div className="text-xs text-gray-500 font-mono">{msg.email}</div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-700">{msg.reason}</td>
                    <td className="px-4 py-3 max-w-xs truncate font-medium text-gray-900">
                      {msg.subject}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 font-mono">
                      {msg.related_tool?.name || "-"}
                    </td>
                    <td className="px-4 py-3">{statusBadge(msg.status)}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 font-mono">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedMessage(msg)}
                          title="View Message Detail"
                          className="p-1.5 rounded text-blue-600 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(msg.id)}
                          title="Delete Message"
                          className="p-1.5 rounded text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Message Detail Modal Drawer */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl animate-in fade-in-50">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{selectedMessage.subject}</h3>
                <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                  <span>Message #{selectedMessage.id}</span>
                  <span>•</span>
                  <span>{new Date(selectedMessage.created_at).toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-gray-50 p-4 rounded-xl border">
              <div>
                <div className="text-gray-500 uppercase font-bold text-[10px]">Sender Name</div>
                <div className="font-semibold text-gray-900">{selectedMessage.name}</div>
              </div>

              <div>
                <div className="text-gray-500 uppercase font-bold text-[10px]">Email (Reply-To)</div>
                <div className="font-mono text-blue-600 font-semibold">{selectedMessage.email}</div>
              </div>

              <div>
                <div className="text-gray-500 uppercase font-bold text-[10px]">Inquiry Reason</div>
                <div className="font-medium text-gray-900">{selectedMessage.reason}</div>
              </div>

              <div>
                <div className="text-gray-500 uppercase font-bold text-[10px]">Related Tool</div>
                <div className="font-mono text-gray-900">{selectedMessage.related_tool?.name || "None"}</div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs uppercase font-bold text-gray-500">Message Body:</div>
              <div className="p-4 rounded-xl bg-gray-50 border text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                {selectedMessage.message}
              </div>
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="text-xs uppercase font-bold text-gray-500">Update Status:</div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleStatusUpdate(selectedMessage.id, "read")}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-200 text-gray-800 hover:bg-gray-300"
                >
                  Mark as Read
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedMessage.id, "replied")}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600 text-white hover:bg-purple-700"
                >
                  Mark as Replied
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedMessage.id, "resolved")}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Mark as Resolved
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedMessage.id, "spam")}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-600 text-white hover:bg-red-700"
                >
                  Mark as Spam
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
