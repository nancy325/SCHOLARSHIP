import React, { useState } from "react";

const initialProfile = {
  // 🔹 Personal Information
  name: "Nancy Scholar",
  dob: "",
  gender: "",
  category: "",
  disability: "",
  state: "",
  email: "nancy.scholar@email.com",
  phone: "1234567890",

  // 🔹 Family Information
  parentOccupation: "",
  annualIncome: "",

  // 🔹 Academic Information
  course: "",
  year: "",
  mode: "",
  institution: "Global University",
  prevPercentage: "",
  cgpa: "",

  // 🔹 Other
  hasScholarship: "",
  careerGoal: "",
};

const Profile = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(initialProfile);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  const validateForm = () => {
    let newErrors: { [key: string]: string } = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.dob) newErrors.dob = "Date of birth is required";
    if (!form.gender) newErrors.gender = "Select gender";
    if (!form.category) newErrors.category = "Select category";
    if (!form.phone.match(/^\d{10}$/))
      newErrors.phone = "Phone must be 10 digits";
    if (form.annualIncome && isNaN(Number(form.annualIncome)))
      newErrors.annualIncome = "Income must be a number";
    if (form.prevPercentage && (Number(form.prevPercentage) < 0 || Number(form.prevPercentage) > 100))
      newErrors.prevPercentage = "Enter valid percentage (0-100)";
    if (form.cgpa && (Number(form.cgpa) < 0 || Number(form.cgpa) > 10))
      newErrors.cgpa = "CGPA should be between 0 and 10";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = () => {
    setEditMode(true);
    setForm(profile);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setProfile(form);
    setEditMode(false);
  };

  return (
    <div className="flex justify-center py-12 px-4">
      <div className="max-w-3xl w-full bg-white/90 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-blue-900">Student Profile</h2>
        {!editMode && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-center">
              Click the "Edit" button to update your profile information, including dropdown selections.
            </p>
          </div>
        )}
        <form onSubmit={handleSave} className="space-y-6">
          {/* ---------- Personal Info ---------- */}
          <h3 className="text-lg font-semibold text-blue-800 border-b pb-1">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Full Name", name: "name", type: "text" },
              { label: "Date of Birth", name: "dob", type: "date" },
              { label: "Phone", name: "phone", type: "text" },
              { label: "Email", name: "email", type: "email" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-blue-800 font-medium mb-1">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={editMode ? form[field.name as keyof typeof form] : profile[field.name as keyof typeof profile]}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 bg-white disabled:bg-gray-100"
                />
                {errors[field.name] && <p className="text-red-500 text-sm">{errors[field.name]}</p>}
              </div>
            ))}

            {/* Gender */}
            <div>
              <label className="block text-blue-800 font-medium mb-1">Gender</label>
              <select
                name="gender"
                value={editMode ? form.gender : profile.gender}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full px-4 py-2 border rounded-lg ${editMode ? 'bg-white' : 'bg-gray-100 cursor-not-allowed'} focus:ring-2 focus:ring-blue-400`}
              >
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
              {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-blue-800 font-medium mb-1">Category</label>
              <select
                name="category"
                value={editMode ? form.category : profile.category}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full px-4 py-2 border rounded-lg ${editMode ? 'bg-white' : 'bg-gray-100 cursor-not-allowed'} focus:ring-2 focus:ring-blue-400`}
              >
                <option value="">Select</option>
                <option>General</option>
                <option>OBC</option>
                <option>SC</option>
                <option>ST</option>
                <option>EWS</option>
              </select>
              {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
            </div>

            {/* Disability */}
            <div>
              <label className="block text-blue-800 font-medium mb-1">Disability Status</label>
              <select
                name="disability"
                value={editMode ? form.disability : profile.disability}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full px-4 py-2 border rounded-lg ${editMode ? 'bg-white' : 'bg-gray-100 cursor-not-allowed'} focus:ring-2 focus:ring-blue-400`}
              >
                <option value="">Select</option>
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>

            {/* state */}
            <div>
              <label className="block text-blue-800 font-medium mb-1">State</label>
              <input
                type="text"
                name="State"
                value={editMode ? form.state : profile.state}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full px-4 py-2 border rounded-lg bg-white disabled:bg-gray-100"
              />
            </div>
          </div>

          {/* ---------- Family Info ---------- */}
          <h3 className="text-lg font-semibold text-blue-800 border-b pb-1">Family Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-blue-800 font-medium mb-1">Parent/Guardian Occupation</label>
              <input
                type="text"
                name="parentOccupation"
                value={editMode ? form.parentOccupation : profile.parentOccupation}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full px-4 py-2 border rounded-lg bg-white disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-blue-800 font-medium mb-1">Annual Family Income</label>
              <input
                type="text"
                name="annualIncome"
                value={editMode ? form.annualIncome : profile.annualIncome}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full px-4 py-2 border rounded-lg bg-white disabled:bg-gray-100"
              />
              {errors.annualIncome && <p className="text-red-500 text-sm">{errors.annualIncome}</p>}
            </div>
          </div>

          {/* ---------- Academic Info ---------- */}
          <h3 className="text-lg font-semibold text-blue-800 border-b pb-1">Academic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-blue-800 font-medium mb-1">Current Course</label>
              <input
                type="text"
                name="course"
                value={editMode ? form.course : profile.course}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full px-4 py-2 border rounded-lg bg-white disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-blue-800 font-medium mb-1">Year/Semester</label>
              <select
                name="year"
                value={editMode ? form.year : profile.year}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full px-4 py-2 border rounded-lg ${editMode ? 'bg-white' : 'bg-gray-100 cursor-not-allowed'} focus:ring-2 focus:ring-blue-400`}
              >
                <option value="">Select</option>
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
              </select>
            </div>
            <div>
              <label className="block text-blue-800 font-medium mb-1">Mode of Study</label>
              <select
                name="mode"
                value={editMode ? form.mode : profile.mode}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full px-4 py-2 border rounded-lg ${editMode ? 'bg-white' : 'bg-gray-100 cursor-not-allowed'} focus:ring-2 focus:ring-blue-400`}
              >
                <option value="">Select</option>
                <option>Regular</option>
                <option>Distance</option>
              </select>
            </div>
            <div>
              <label className="block text-blue-800 font-medium mb-1">Institution</label>
              <input
                type="text"
                name="institution"
                value={editMode ? form.institution : profile.institution}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full px-4 py-2 border rounded-lg bg-white disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-blue-800 font-medium mb-1">Previous Exam %</label>
              <input
                type="text"
                name="prevPercentage"
                value={editMode ? form.prevPercentage : profile.prevPercentage}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full px-4 py-2 border rounded-lg bg-white disabled:bg-gray-100"
              />
              {errors.prevPercentage && <p className="text-red-500 text-sm">{errors.prevPercentage}</p>}
            </div>
            <div>
              <label className="block text-blue-800 font-medium mb-1">Current CGPA</label>
              <input
                type="text"
                name="cgpa"
                value={editMode ? form.cgpa : profile.cgpa}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full px-4 py-2 border rounded-lg bg-white disabled:bg-gray-100"
              />
              {errors.cgpa && <p className="text-red-500 text-sm">{errors.cgpa}</p>}
            </div>
          </div>

          {/* ---------- Other Info ---------- */}
          <h3 className="text-lg font-semibold text-blue-800 border-b pb-1">Other Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-blue-800 font-medium mb-1">Already on Scholarship?</label>
              <select
                name="hasScholarship"
                value={editMode ? form.hasScholarship : profile.hasScholarship}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full px-4 py-2 border rounded-lg ${editMode ? 'bg-white' : 'bg-gray-100 cursor-not-allowed'} focus:ring-2 focus:ring-blue-400`}
              >
                <option value="">Select</option>
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
            <div>
              <label className="block text-blue-800 font-medium mb-1">Career Goal (optional)</label>
              <input
                type="text"
                name="careerGoal"
                value={editMode ? form.careerGoal : profile.careerGoal}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full px-4 py-2 border rounded-lg bg-white disabled:bg-gray-100"
              />
            </div>
          </div>

          {/* ---------- Buttons ---------- */}
          <div className="flex gap-2 mt-6">
            {editMode ? (
              <>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="bg-gray-300 text-blue-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                onClick={handleEdit}
              >
                Edit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
