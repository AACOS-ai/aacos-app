// components/SignalRecorder.jsx
"use client";
import { useContext, useState } from "react";
import { SignalsContext } from "./SignalsContext";
import { toast } from "react-hot-toast";

export default function SignalRecorder() {
  const [record, setRecord] = useState("");
  const [loading, setLoading] = useState(false);
  const { saveRecordingToServer } = useContext(SignalsContext);

  async function save() {
    setLoading(true);
    try {
      await saveRecordingToServer(record);
      toast.success("הקלטה נשמרה!");
      setRecord("");
    } catch (err) {
      toast.error("שגיאה בשמירה, נסה שוב.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
    <textarea
    className="w-full p-2 rounded mb-2 text-black"
    rows={2}
    value={record}
    onChange={e => setRecord(e.target.value)}
    placeholder="תעד תדר/הערה/הקלטה (אפשר דמיון לאודיו)"
    dir="rtl"
    disabled={loading}
    />
    <button
    className="bg-primary text-white py-2 px-5 rounded font-bold"
    onClick={save}
    disabled={loading || !record.trim()}
    >
    {loading ? "שומר..." : "שמור הקלטה"}
    </button>
    </div>
  );
}
