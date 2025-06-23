import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Book() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    sessionType: '',
    notes: '',
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateTimeOptions = (startHour = 8, endHour = 20) => {
    const times: Date[] = [];
    const base = new Date();
    base.setMinutes(0, 0, 0);
    for (let h = startHour; h <= endHour; h++) {
      for (let m = 0; m < 60; m += 30) {
        const time = new Date(base);
        time.setHours(h, m);
        times.push(time);
      }
    }
    return times;
  };

  const allTimes = generateTimeOptions();

  const validEndTimes = startTime
    ? allTimes.filter(
        (time) => time.getTime() - startTime.getTime() >= 60 * 60 * 1000 // At least 1 hour later
      )
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !startTime || !endTime) {
      alert('Please select date, start time, and end time.');
      return;
    }

    const fullStart = new Date(selectedDate);
    fullStart.setHours(startTime.getHours(), startTime.getMinutes());

    const fullEnd = new Date(selectedDate);
    fullEnd.setHours(endTime.getHours(), endTime.getMinutes());

    console.log({
      ...formData,
      startTime: fullStart.toString(),
      endTime: fullEnd.toString(),
    });

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 py-32 px-6">
      <h1 className="text-4xl font-bold text-center mb-8">Book a Session</h1>

      {submitted ? (
        <div className="text-center text-green-600 font-semibold text-lg">
          Thank you! Your booking request has been submitted.
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md space-y-6"
        >
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded"
            required
          />
          <select
            name="sessionType"
            value={formData.sessionType}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded"
            required
          >
            <option value="">Select Session Type</option>
            <option value="portrait">Portrait Session</option>
            <option value="event">Event Coverage</option>
            <option value="branding">Branding Shoot</option>
            <option value="studio">Studio Rental</option>
          </select>

          {/* Date Picker */}
          <div>
            <label className="block mb-1 font-medium">Preferred Date</label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="MMMM d, yyyy"
              className="w-full border border-gray-300 p-3 rounded"
              placeholderText="Select date"
              required
            />
          </div>

          {/* Start & End Time Pickers (Side-by-side) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Start Time</label>
              <DatePicker
                selected={startTime}
                onChange={(time) => {
                  setStartTime(time);
                  setEndTime(null); // Reset end time on start change
                }}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={30}
                dateFormat="h:mm aa"
                timeCaption="Start"
                placeholderText="Start Time"
                className="w-full border border-gray-300 p-3 rounded"
                filterTime={(time) => {
                  const hour = time.getHours();
                  return hour >= 8 && hour <= 19;
                }}
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">End Time</label>
              <DatePicker
                selected={endTime}
                onChange={(time) => setEndTime(time)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={30}
                dateFormat="h:mm aa"
                timeCaption="End"
                placeholderText="End Time"
                className="w-full border border-gray-300 p-3 rounded"
                filterTime={(time) =>
                  startTime
                    ? time.getTime() - startTime.getTime() >= 60 * 60 * 1000 &&
                      time.getHours() >= 8 &&
                      time.getHours() <= 20
                    : false
                }
                required
              />
            </div>
          </div>

          <textarea
            name="notes"
            placeholder="Additional Notes (optional)"
            value={formData.notes}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded"
            rows={4}
          />

          <button
            type="submit"
            className="w-full bg-[#102866] text-white py-3 rounded hover:bg-[#1b2f70] transition"
          >
            Submit Booking
          </button>
        </form>
      )}
    </div>
  );
}
