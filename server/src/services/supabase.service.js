const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

const mapFromDb = (dbBooking) => ({
  id: dbBooking.id,
  "Booking ID": dbBooking.booking_id,
  Timestamp: dbBooking.timestamp,
  Name: dbBooking.name,
  Email: dbBooking.email,
  Phone: dbBooking.phone,
  State: dbBooking.state,
  District: dbBooking.district,
  "Pin Code": dbBooking.pin_code,
  Acres: dbBooking.acres,
  "Crop Type": dbBooking.crop_type,
  "Pesticide Type": dbBooking.pesticide_type,
  Date: dbBooking.date,
  Status: dbBooking.status,
  Remarks: dbBooking.remarks,
});

const mapToDb = (appBooking) => ({
  booking_id: appBooking["Booking ID"],
  timestamp: appBooking.Timestamp,
  name: appBooking.Name,
  email: appBooking.Email,
  phone: appBooking.Phone,
  state: appBooking.State,
  district: appBooking.District,
  pin_code: appBooking["Pin Code"],
  acres: appBooking.Acres,
  crop_type: appBooking["Crop Type"],
  pesticide_type: appBooking["Pesticide Type"],
  date: appBooking.Date,
  status: appBooking.Status,
  remarks: appBooking.Remarks,
});

const insertBooking = async (data) => {
  const dbData = mapToDb(data);
  const { data: inserted, error } = await supabase
    .from("bookings")
    .insert([dbData])
    .select()
    .single();

  if (error) throw error;
  return mapFromDb(inserted);
};

const getAllBookings = async () => {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("timestamp", { ascending: false });

  if (error) throw error;
  return data.map(mapFromDb);
};

const updateBookingStatus = async (id, newStatus, remarks) => {
  const updateData = {
    status: newStatus,
    ...(remarks !== undefined && { remarks }),
  };

  const { data, error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data ? mapFromDb(data) : null;
};

module.exports = {
  supabase,
  insertBooking,
  getAllBookings,
  updateBookingStatus,
};
