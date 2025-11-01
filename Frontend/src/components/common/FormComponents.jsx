// src/components/common/FormComponents.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  ChevronDown,
  Loader,
  Clock,
  Truck,
} from "lucide-react";

/**
 * FormInput
 * Props: label, icon (component), error, className, ...inputProps
 */
export const FormInput = ({ label, icon: Icon, error, className = "", ...props }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
      {Icon && <Icon size={16} className="text-gray-500" />}
      {label}
    </label>
    <div className="relative">
      <input
        className={`w-full px-4 py-3 bg-white border-2 rounded-xl transition-all duration-300 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 hover:border-gray-400 ${
          error ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : "border-gray-200"
        } ${className}`}
        {...props}
      />
      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1 text-red-500 text-xs mt-1">
          <AlertCircle size={12} />
          {error}
        </motion.div>
      )}
    </div>
  </div>
);

/**
 * FormSelect
 * Props:
 *  label, icon, options (array {value,label}), value, onChange (expects event-like { target:{ value } }), error
 */
export const FormSelect = ({ label, icon: Icon, options = [], value, onChange, error, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(options.find((o) => o.value === value) || null);
  const ref = useRef(null);

  useEffect(() => {
    setSelected(options.find((o) => o.value === value) || null);
  }, [value, options]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleSelect = (opt) => {
    setSelected(opt);
    setIsOpen(false);
    if (onChange) onChange({ target: { value: opt.value } });
  };

  return (
    <div className="space-y-2" ref={ref}>
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        {Icon && <Icon size={16} className="text-gray-500" />}
        {label}
      </label>
      <div className="relative">
        <motion.button
          type="button"
          onClick={() => setIsOpen((s) => !s)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={`w-full px-4 py-3 bg-white border-2 rounded-xl text-left flex items-center justify-between ${error ? "border-red-500" : "border-gray-200"} ${className}`}
        >
          <span className={selected?.value ? "text-gray-900" : "text-gray-500"}>
            {selected?.label || "Select an option"}
          </span>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.18 }}>
            <ChevronDown size={18} className="text-gray-400" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.12 }}
              className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-56 overflow-auto"
            >
              {options.map((opt, i) => (
                <button
                  key={opt.value + i}
                  type="button"
                  onClick={() => handleSelect(opt)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition font-medium text-gray-700 border-b last:border-b-0"
                >
                  {opt.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {error && <div className="flex items-center gap-1 text-red-500 text-xs mt-1"><AlertCircle size={12} />{error}</div>}
    </div>
  );
};

/**
 * TimeSelect
 * Props: label, value (HH:MM 24h), onChange (event-like), error
 * NOTE: onChange will be called with { target: { value: "HH:MM" } } to match your step components.
 */
export const TimeSelect = ({ label, icon: Icon, value, onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  // generate 30-min interval options
  const timeOptions = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      const val = `${hh}:${mm}`;
      const display = new Date(`2000-01-01T${val}`).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      timeOptions.push({ value: val, label: display });
    }
  }

  useEffect(() => {
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const selected = timeOptions.find((t) => t.value === value);

  return (
    <div className="space-y-2" ref={ref}>
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        {Icon && <Icon size={16} className="text-gray-500" />}
        {label}
      </label>
      <div className="relative">
        <motion.button
          type="button"
          onClick={() => setIsOpen((s) => !s)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={`w-full px-4 py-3 bg-white border-2 rounded-xl text-left flex items-center justify-between ${error ? "border-red-500" : "border-gray-200"}`}
        >
          <span className={selected ? "text-gray-900" : "text-gray-500"}>{selected?.label || "Select time"}</span>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.18 }}>
            <ChevronDown size={18} className="text-gray-400" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.12 }}
              className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-56 overflow-auto"
            >
              {timeOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    if (onChange) onChange({ target: { value: opt.value } });
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 transition text-gray-700 font-medium"
                >
                  {opt.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {error && <div className="flex items-center gap-1 text-red-500 text-xs mt-1"><AlertCircle size={12} />{error}</div>}
    </div>
  );
};

/**
 * FileUpload
 * Props:
 *  label, accept, onChange (raw event), preview (dataURL or url), icon, description, error
 *
 * This component will call onChange(event) so callers can use e.target.files[0]
 */
export const FileUpload = ({ label, accept, onChange, icon: Icon, description, preview, error }) => {
  const id = `file-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        {Icon && <Icon size={16} className="text-gray-500" />}
        {label}
      </label>

      <div className={`border-2 border-dashed rounded-xl p-4 ${error ? "border-red-400 bg-red-50" : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"}`}>
        <input id={id} type="file" accept={accept} onChange={onChange} className="hidden" />
        <label htmlFor={id} className="cursor-pointer flex flex-col items-center justify-center gap-2">
          {preview ? (
            <img src={preview} alt="preview" className="w-24 h-24 object-cover rounded-lg shadow-sm" />
          ) : (
            <>
              <div className="text-sm text-gray-600">Click to upload</div>
              {description && <div className="text-xs text-gray-500">{description}</div>}
            </>
          )}
        </label>
      </div>

      {error && <div className="flex items-center gap-1 text-red-500 text-xs mt-1"><AlertCircle size={12} />{error}</div>}
    </div>
  );
};

/**
 * ToggleSwitch (simple)
 * Props: label, description, checked (bool), onChange (fn), error
 */
export const ToggleSwitch = ({ label, description, checked, onChange, error }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200">
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Truck size={16} className="text-gray-600" />
          {label}
        </h3>
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${checked ? "bg-green-500" : "bg-gray-300"}`}
      >
        <motion.span animate={{ x: checked ? 22 : 2 }} transition={{ duration: 0.18 }} className="inline-block h-4 w-4 transform rounded-full bg-white shadow" />
      </button>
    </div>
    {error && <div className="flex items-center gap-1 text-red-500 text-xs mt-1"><AlertCircle size={12} />{error}</div>}
  </div>
);

export default {
  FormInput,
  FormSelect,
  TimeSelect,
  FileUpload,
  ToggleSwitch,
};
