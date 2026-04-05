import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import styles from "../styles/BookingPage.module.css";
import API_URL from "../config/api";

// --- Configuration & Constants ---
const STATE_DISTRICT_DATA_URL = "/data/state-districts.json";
const PINCODE_LOOKUP_URL = "https://api.postalpincode.in/pincode";

const cropOptions = ["Rice", "Wheat", "Cotton", "Sugarcane", "Maize", "Pulses", "Vegetables", "Fruits", "Other"];
const weekdayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  state: "",
  district: "",
  pinCode: "",
  acres: "",
  cropType: "",
  date: "",
};

// --- Helper Functions ---
const formatDateValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const parseDateValue = (value) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};
const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const createMonthGrid = (monthDate) => {
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() - firstDay.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    return date;
  });
};

const normalizeLocationName = (value) => value?.trim().toLowerCase() ?? "";
const sanitizePhone = (value) => value.replace(/^0+/, "");
const normalizePhoneInput = (value) => {
  const digits = value.replace(/\D/g, "");
  
  // If more than 10 digits (e.g. including country code or extra zeros), 
  // take only the last 10 digits as requested.
  if (digits.length > 10) {
    return digits.slice(-10);
  }

  return digits;
};

export default function BookingPage() {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [pointerGlow, setPointerGlow] = useState({ x: "50%", y: "20%", active: false });
  const [openMenu, setOpenMenu] = useState(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [stateDistrictMap, setStateDistrictMap] = useState({});
  const [stateOptions, setStateOptions] = useState([]);
  const [locationStatus, setLocationStatus] = useState({ states: "idle", pincode: "idle" });
  const [manualLocationOverride, setManualLocationOverride] = useState(false);

  const todayDate = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);

  const [visibleMonth, setVisibleMonth] = useState(
    new Date(todayDate.getFullYear(), todayDate.getMonth(), 1)
  );

  const calendarDays = useMemo(() => createMonthGrid(visibleMonth), [visibleMonth]);
  const monthLabel = useMemo(
    () => visibleMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    [visibleMonth]
  );

  const sanitizedPhone = sanitizePhone(formData.phone);
  const isFormComplete =
    formData.name.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.cropType.trim() !== "" &&
    formData.state.trim() !== "" &&
    formData.district.trim() !== "" &&
    formData.pinCode.trim().length === 6 &&
    Number(formData.acres) > 0 &&
    formData.date.trim() !== "" &&
    sanitizedPhone.length === 10;

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const handleOutside = (event) => {
      if (!event.target.closest(`.${styles.selectWrap}`) && !event.target.closest(`.${styles.dateWrap}`)) {
        setOpenMenu(null);
        setIsDatePickerOpen(false);
      }
    };
    document.addEventListener("pointerdown", handleOutside);

    // Auto-scroll to form if hash is present
    if (window.location.hash === '#form') {
      const formElement = document.getElementById('booking-form-section');
      if (formElement) {
        setTimeout(() => {
          formElement.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    }

    return () => document.removeEventListener("pointerdown", handleOutside);
  }, []);

  useEffect(() => {
    const loadStateDistricts = async () => {
      try {
        setLocationStatus((prev) => ({ ...prev, states: "loading" }));
        const response = await fetch(STATE_DISTRICT_DATA_URL);
        const data = await response.json();
        const groupedData = data.reduce((acc, item) => {
          const stateName = item.StateName?.trim();
          const districtName = item["DistrictName(InEnglish)"]?.trim();
          if (!stateName || !districtName) return acc;
          if (!acc[stateName]) acc[stateName] = new Set();
          acc[stateName].add(districtName);
          return acc;
        }, {});
        const normalizedMap = Object.fromEntries(
          Object.entries(groupedData)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([state, districts]) => [state, Array.from(districts).sort()])
        );
        setStateDistrictMap(normalizedMap);
        setStateOptions(Object.keys(normalizedMap));
        setLocationStatus((prev) => ({ ...prev, states: "ready" }));
      } catch {
        setLocationStatus((prev) => ({ ...prev, states: "error" }));
      }
    };
    loadStateDistricts();
  }, []);

  useEffect(() => {
    if (formData.pinCode.length !== 6 || manualLocationOverride) return;
    const lookupTimeout = setTimeout(async () => {
      try {
        setLocationStatus((prev) => ({ ...prev, pincode: "loading" }));
        const response = await fetch(`${PINCODE_LOOKUP_URL}/${formData.pinCode}`);
        const [result] = await response.json();
        const postOffice = result?.PostOffice?.[0];
        if (postOffice && result?.Status === "Success") {
          const matchedState = stateOptions.find((s) => normalizeLocationName(s) === normalizeLocationName(postOffice.State)) || postOffice.State;
          const matchedDistrict = (stateDistrictMap[matchedState] || []).find((d) => normalizeLocationName(d) === normalizeLocationName(postOffice.District)) || postOffice.District;
          setFormData((prev) => ({ ...prev, state: matchedState, district: matchedDistrict }));
          setLocationStatus((prev) => ({ ...prev, pincode: "success" }));
        } else {
          setLocationStatus((prev) => ({ ...prev, pincode: "error" }));
        }
      } catch {
        setLocationStatus((prev) => ({ ...prev, pincode: "error" }));
      }
    }, 400);
    return () => clearTimeout(lookupTimeout);
  }, [formData.pinCode, manualLocationOverride, stateDistrictMap, stateOptions]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    let nextValue = value;
    if (name === "acres") nextValue = value === "" ? "" : Math.max(0, Number(value));
    if (name === "phone") nextValue = normalizePhoneInput(value);
    if (name === "pinCode") nextValue = value.replace(/\D/g, "").slice(0, 6);
    setFormData((prev) => ({ ...prev, [name]: nextValue, ...(name === "state" ? { district: "" } : {}) }));
  };

  const handlePhoneBlur = () => {
    setFormData((prev) => ({ ...prev, phone: sanitizePhone(prev.phone) }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const normalizedPhone = sanitizePhone(formData.phone);
    const normalizedAcres = Number(formData.acres);
    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: normalizedPhone,
      state: formData.state.trim(),
      district: formData.district.trim(),
      pinCode: String(formData.pinCode || "").trim(),
      acres: normalizedAcres,
      cropType: formData.cropType.trim(),
      date: formData.date.trim(),
    };

    if (!payload.name || !payload.email || !payload.phone || !payload.state || !payload.district || !payload.pinCode || !payload.cropType || !payload.date) {
      showToast("All booking fields are required.", "error");
      return;
    }

    if (payload.phone.length !== 10) {
      showToast("Enter a valid 10-digit phone number.", "error");
      return;
    }

    if (!Number.isFinite(payload.acres) || payload.acres <= 0) {
      showToast("Enter a valid farm size in acres.", "error");
      return;
    }
    
    setLoading(true);
    try {
      await axios.post(`${API_URL}/bookings/book`, payload);
      showToast("Booking submitted successfully!");
      setFormData(initialFormData);
    } catch (error) {
      showToast(error.response?.data?.message || "Booking failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const renderSelect = (name, placeholder, options, disabled = false, openUp = false) => {
    const isOpen = openMenu === name;
    return (
      <div className={`${styles.selectWrap} ${isOpen ? styles.selectWrapOpen : ""}`}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            setIsDatePickerOpen(false);
            setOpenMenu(isOpen ? null : name);
          }}
          className={`${styles.selectButton} ${isOpen ? styles.selectButtonOpen : ""}`}
        >
          <span className={`${styles.selectText} ${!formData[name] ? styles.selectPlaceholder : ""}`}>
            {formData[name] || placeholder}
          </span>
          <span className={`${styles.selectArrow} ${isOpen ? styles.selectArrowOpen : ""}`} />
        </button>
        {isOpen && (
          <div className={`${styles.selectMenu} ${openUp ? styles.selectMenuUp : ""}`}>
            {options.map((option) => (
              <button
                key={option}
                type="button"
                className={`${styles.selectOption} ${formData[name] === option ? styles.selectOptionActive : ""}`}
                onClick={() => {
                  if (name === "state" || name === "district") setManualLocationOverride(true);
                  setFormData((prev) => ({ ...prev, [name]: option, ...(name === "state" ? { district: "" } : {}) }));
                  setOpenMenu(null);
                }}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={styles.page}
      onPointerMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        setPointerGlow({
          x: `${event.clientX - bounds.left}px`,
          y: `${event.clientY - bounds.top}px`,
          active: true,
        });
      }}
      onPointerLeave={() => setPointerGlow((prev) => ({ ...prev, active: false }))}
    >
      <div className={styles.fxLayer}>
        <div className={styles.fxTop} />
        <div
          className={styles.fxPointer}
          style={{
            opacity: pointerGlow.active ? 1 : 0,
            background: `radial-gradient(420px circle at ${pointerGlow.x} ${pointerGlow.y}, rgba(79, 123, 63, 0.14), transparent 70%)`,
          }}
        />
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className={`${styles.toast} ${toast.type === 'error' ? styles.toastError : styles.toastSuccess}`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <main className={styles.layout}>
        <motion.section 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={styles.leftPanel}
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 0.3 }
              }
            }}
          >
            <motion.span variants={{ hidden: { opacity: 0, y: 5 }, visible: { opacity: 1, y: 0 } }} className={styles.pill}>Booking Desk</motion.span>
            <motion.h1 variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className={styles.title}>
              Drone service built for <span className={styles.titleAccent}>real farms.</span>
            </motion.h1>
            <motion.p variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className={styles.lead}>High-precision spraying and mapping at your fingertips. Fill out the form to secure your slot.</motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 0.6 }
              }
            }}
            className={styles.stats}
          >
            {[{v: "Easy", l: "Process"}, {v: "Clear", l: "Pricing"}, {v: "Direct", l: "Support"}].map(s => (
              <motion.div key={s.l} variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }} className={styles.stat}>
                <p className={styles.statValue}>{s.v}</p>
                <p className={styles.statLabel}>{s.l}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className={styles.guideCard}
          >
            <p className={styles.guideTitle}>Before You Submit</p>
            <ul className={styles.guideList}>
              {["Share precise field location.", "Verify your crop stage.", "Ensure water source is ready."].map((t, i) => (
                <li key={i} className={styles.guideItem}>
                  <span className={styles.guideIndex}>{i + 1}</span>
                  <p className={styles.guideText}>{t}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className={styles.formPanel}
          id="booking-form-section"
        >
          <div className={styles.formShell}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>Service Request</h2>
              <p className={styles.formHint}>All fields are mandatory for scheduling.</p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.row2}>
                <label className={styles.field}>
                  <span className={styles.label}>Farmer Name</span>
                  <input className={styles.input} name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required />
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>Phone Number</span>
                  <div className={styles.phoneWrap}>
                    <span className={styles.phonePrefix}>
                      <span className={styles.flagIndia}>
                        <span className={styles.flagBandSaffron} /><span className={styles.flagBandWhite} /><span className={styles.flagBandGreen} />
                        <span className={styles.flagChakra} />
                      </span>
                      <span className={styles.phoneCode}>+91</span>
                    </span>
                    <input className={styles.phoneInput} name="phone" value={formData.phone} onChange={handleChange} onBlur={handlePhoneBlur} placeholder="10-digit mobile" required />
                  </div>
                </label>
              </div>

              <div className={styles.row2}>
                <label className={styles.field}>
                  <span className={styles.label}>Email Address</span>
                  <input className={styles.input} name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required />
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>Crop Type</span>
                  {renderSelect("cropType", "Select Crop", cropOptions)}
                </label>
              </div>

              <div className={styles.row3}>
                <label className={styles.field}>
                  <span className={styles.label}>State</span>
                  {renderSelect("state", "State", stateOptions, locationStatus.states === "loading", true)}
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>District</span>
                  {renderSelect("district", "District", stateDistrictMap[formData.state] || [], !formData.state, true)}
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>Pin Code</span>
                  <input className={styles.input} name="pinCode" value={formData.pinCode} onChange={handleChange} placeholder="6 digits" required />
                </label>
              </div>

              <div className={styles.row1}>
                <label className={styles.field}>
                  <span className={styles.label}>Farm Size (Acres)</span>
                  <input
                    className={styles.input}
                    name="acres"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={formData.acres}
                    onChange={handleChange}
                    placeholder="e.g. 2.5"
                    required
                  />
                </label>
              </div>

              <div className={styles.submitRow}>
                <label className={`${styles.field} ${styles.dateWrap}`}>
                  <span className={styles.label}>Preferred Date</span>
                  <button
                    type="button"
                    className={`${styles.dateButton} ${isDatePickerOpen ? styles.dateButtonOpen : ""}`}
                    onClick={() => {
                      setOpenMenu(null);
                      setIsDatePickerOpen((prev) => !prev);
                    }}
                  >
                    <span className={!formData.date ? styles.datePlaceholder : ""}>
                      {formData.date ? parseDateValue(formData.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Pick a date"}
                    </span>
                    <span className={styles.calendarIcon}>
                      <span className={styles.calendarIconTop} /><span className={styles.calendarIconBody} />
                    </span>
                  </button>
                  {isDatePickerOpen && (
                    <div className={styles.calendarPopover}>
                      <div className={styles.calendarHeader}>
                        <button type="button" className={styles.calendarNav} onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))}>&lt;</button>
                        <p className={styles.calendarMonth}>{monthLabel}</p>
                        <button type="button" className={styles.calendarNav} onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))}>&gt;</button>
                      </div>
                      <div className={styles.calendarWeekdays}>
                        {weekdayLabels.map(d => <span key={d} className={styles.calendarWeekday}>{d}</span>)}
                      </div>
                      <div className={styles.calendarGrid}>
                        {calendarDays.map((date) => {
                          const isDisabled = date < todayDate;
                          const isSelected = formData.date && isSameDay(date, parseDateValue(formData.date));
                          return (
                            <button
                              key={date.toISOString()}
                              type="button"
                              disabled={isDisabled}
                              className={`${styles.calendarDay} ${date.getMonth() !== visibleMonth.getMonth() ? styles.calendarDayOutside : ""} ${isSelected ? styles.calendarDaySelected : ""} ${isSameDay(date, todayDate) ? styles.calendarDayToday : ""}`}
                              onClick={() => {
                                setFormData((prev) => ({ ...prev, date: formatDateValue(date) }));
                                setIsDatePickerOpen(false);
                              }}
                            >
                              {date.getDate()}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </label>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={styles.submitButton} 
                    type="submit" 
                    disabled={loading || !isFormComplete}
                  >
                    {loading ? "Submitting..." : "Confirm Booking"}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.section>
        </main>
      </motion.div>
  );
}
