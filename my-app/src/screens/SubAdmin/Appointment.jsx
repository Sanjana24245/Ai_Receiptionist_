
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from '../../components/Sidebar'; // Import your Sidebar
import Navbar from '../../components/Navbar';

export default function Appointment() {
  const [doctors, setDoctors] = useState([]);
  const [humanAppointments, setHumanAppointments] = useState([]);
  const [aiAppointments, setAiAppointments] = useState([]);

  const [form, setForm] = useState({
    name: "",
    age: "",
    address: "",
    appointment_time: "",
    disease: "",
    doctor_id: "",
    type: "human",
  });

  // doctors aur appointments fetch karna
  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorRes = await axios.get("http://localhost:8000/doctors/");
        setDoctors(doctorRes.data);

        const appointmentRes = await axios.get(
          "http://localhost:8000/appointments/"
        );

        const human = appointmentRes.data.filter((a) => a.type === "human");
        const ai = appointmentRes.data.filter((a) => a.type === "ai");

        setHumanAppointments(human);
        setAiAppointments(ai);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };
    fetchData();
  }, []);

  // input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // appointment book karna
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/appointments/", form);

      if (form.type === "human") {
        setHumanAppointments((prev) => [...prev, res.data.appointment]);
      } else {
        setAiAppointments((prev) => [...prev, res.data.appointment]);
      }

      alert(res.data.msg);

      // form reset
      setForm({
        name: "",
        age: "",
        address: "",
        appointment_time: "",
        disease: "",
        doctor_id: "",
        type: "human",
      });
    } catch (err) {
      alert("Error booking appointment: " + err.response?.data?.detail);
    }
  };

  // merge + sort appointments
  const combinedAppointments = [...humanAppointments, ...aiAppointments].sort(
    (a, b) => new Date(a.appointment_time) - new Date(b.appointment_time)
  );

  return (
    <div className="flex">
     
      
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Book Appointment</h1>

          {/* Appointment Form */}
          <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Patient Name"
              required
              className="border p-2 w-full"
            />
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              placeholder="Age"
              required
              className="border p-2 w-full"
            />
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Address"
              required
              className="border p-2 w-full"
            />
            <input
              type="datetime-local"
              name="appointment_time"
              value={form.appointment_time}
              onChange={handleChange}
              required
              className="border p-2 w-full"
            />
            <input
              type="text"
              name="disease"
              value={form.disease}
              onChange={handleChange}
              placeholder="Disease"
              required
              className="border p-2 w-full"
            />
            <select
              name="doctor_id"
              value={form.doctor_id}
              onChange={handleChange}
              required
              className="border p-2 w-full"
            >
              <option value="">Select Doctor</option>
              {doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.name} ({doc.specialization})
                </option>
              ))}
            </select>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="border p-2 w-full"
            >
              <option value="human">Human</option>
              <option value="ai">AI</option>
            </select>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Book Appointment
            </button>
          </form>

          {/* Appointment Table */}
          <h2 className="text-xl font-semibold mt-6">Appointments</h2>
          <table className="w-full border mt-2">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Name</th>
                <th className="border p-2">Age</th>
                <th className="border p-2">Address</th>
                <th className="border p-2">Time</th>
                <th className="border p-2">Disease</th>
                <th className="border p-2">Doctor</th>
                <th className="border p-2">Type</th>
              </tr>
            </thead>
            <tbody>
              {combinedAppointments.map((appt) => (
                <tr key={appt._id}>
                  <td className="border p-2">{appt.name}</td>
                  <td className="border p-2">{appt.age}</td>
                  <td className="border p-2">{appt.address}</td>
                  <td className="border p-2">
                    {new Date(appt.appointment_time).toLocaleString()}
                  </td>
                  <td className="border p-2">{appt.disease}</td>
                  <td className="border p-2">
                    {doctors.find((d) => d._id === appt.doctor_id)?.name ||
                      "Unknown"}
                  </td>
                  <td className="border p-2">{appt.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
 
  );
}
