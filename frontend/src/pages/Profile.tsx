import React, { useState, useEffect } from "react";
import { apiService } from "@/services/api"; // Assumes apiService is set up for HTTP requests

const initialProfile = {
  // 🔹 Personal Information
  name: "",
  dob: "",
  gender: "",
  category: "",
  disability: "",
  state: "",
  email: "",
  phone: "",

  // 🔹 Family Information
  parentOccupation: "",
  annualIncome: "",

  // 🔹 Academic Information
  course: "",
  year: "",
  mode: "",
  institution: "",
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Fetch profile from backend on mount
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setApiError(null);

    // Integrate backend: fetch profile data
    apiService
      .get("/profile")
      .then((res: any) => {
        if (isMounted) {
          setProfile(res.data || initialProfile);
          setForm(res.data || initialProfile);
        }
      })
      .catch((err: any) => {
        setApiError(
          err?.response?.data?.message ||
            "Failed to load profile. Please try again."
        );
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
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
    if (
      form.prevPercentage &&
      (Number(form.prevPercentage) < 0 || Number(form.prevPercentage) > 100)
    )
      newErrors.prevPercentage = "Enter valid percentage (0-100)";
    if (form.cgpa && (Number(form.cgpa) < 0 || Number(form.cgpa) > 10))
      newErrors.cgpa = "CGPA should be between 0 and 10";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = () => {
    setEditMode(true);
    setForm(profile);
    setSuccessMsg(null);
    setApiError(null);
  };

  // Integrate backend: save profile to backend
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setApiError(null);
    if (!validateForm()) return;
    setSaving(true);
    try {
      // PATCH or PUT depending on your backend
      const res = await apiService.put("/profile", form);
      setProfile(res.data || form);
      setEditMode(false);
      setSuccessMsg("Profile updated successfully.");
    } catch (err: any) {
      setApiError(
        err?.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-blue-700 text-lg">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-12 px-4">
      <div className="max-w-3xl w-full bg-white/90 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-blue-900">Student Profile</h2>
        {apiError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700 text-center">{apiError}</p>
          </div>
        )}
        {successMsg && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-green-700 text-center">{successMsg}</p>
          </div>
        )}
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
                  value={
                    editMode
                      ? form[field.name as keyof typeof form]
                      : profile[field.name as keyof typeof profile]
                  }
                  onChange={handleChange}
                  disabled={!editMode}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 bg-white disabled:bg-gray-100"
                />
                {errors[field.name] && (
                  <p className="text-red-500 text-sm">{errors[field.name]}</p>
                )}
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
                className={`w-full px-4 py-2 border rounded-lg ${
                  editMode ? "bg-white" : "bg-gray-100 cursor-not-allowed"
                } focus:ring-2 focus:ring-blue-400`}
              >
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm">{errors.gender}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-blue-800 font-medium mb-1">Category</label>
              <select
                name="category"
                value={editMode ? form.category : profile.category}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full px-4 py-2 border rounded-lg ${
                  editMode ? "bg-white" : "bg-gray-100 cursor-not-allowed"
                } focus:ring-2 focus:ring-blue-400`}
              >
                <option value="">Select</option>
                <option>General</option>
                <option>OBC</option>
                <option>SC</option>
                <option>ST</option>
                <option>EWS</option>
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm">{errors.category}</p>
              )}
            </div>

            {/* Disability */}
            <div>
              <label className="block text-blue-800 font-medium mb-1">Disability Status</label>
              <select
                name="disability"
                value={editMode ? form.disability : profile.disability}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full px-4 py-2 border rounded-lg ${
                  editMode ? "bg-white" : "bg-gray-100 cursor-not-allowed"
                } focus:ring-2 focus:ring-blue-400`}
              >
                <option value="">Select</option>
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>

            {/* state */}
            <div>
              <label className="block text-blue-800 font-medium mb-1">State</label>
              <select
                name="state"
                value={editMode ? form.state : profile.state}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full px-4 py-2 border rounded-lg ${
                  editMode ? "bg-white" : "bg-gray-100 cursor-not-allowed"
                } focus:ring-2 focus:ring-blue-400`}
              >
                <option value="">Select</option>
                <option>Andhra Pradesh</option>
                <option>Arunachal Pradesh</option>
                <option>Assam</option>
                <option>Bihar</option>
                <option>Chhattisgarh</option>
                <option>Goa</option>
                <option>Gujarat</option>
                <option>Haryana</option>
                <option>Himachal Pradesh</option>
                <option>Jharkhand</option>
                <option>Karnataka</option>
                <option>Kerala</option>
                <option>Madhya Pradesh</option>
                <option>Maharashtra</option>
                <option>Manipur</option>
                <option>Meghalaya</option>
                <option>Mizoram</option>
                <option>Nagaland</option>
                <option>Odisha</option>
                <option>Punjab</option>
                <option>Rajasthan</option>
                <option>Sikkim</option>
                <option>Tamil Nadu</option>
                <option>Telangana</option>
                <option>Tripura</option>
                <option>Uttar Pradesh</option>
                <option>Uttarakhand</option>
                <option>West Bengal</option>
                <option>Andaman and Nicobar Islands</option>
                <option>Chandigarh</option>
                <option>Dadra and Nagar Haveli and Daman and Diu</option>
                <option>Delhi</option>
                <option>Lakshadweep</option>
                <option>Puducherry</option>
                <option>Ladakh</option>
                <option>Jammu and Kashmir</option>
              </select>
            </div>
          </div>

          {/* ---------- Family Info ---------- */}
          <h3 className="text-lg font-semibold text-blue-800 border-b pb-1">Family Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-blue-800 font-medium mb-1">
                Parent/Guardian Occupation
              </label>
              <select
                name="parentOccupation"
                value={editMode ? form.parentOccupation : profile.parentOccupation}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full px-4 py-2 border rounded-lg ${
                  editMode ? "bg-white" : "bg-gray-100 cursor-not-allowed"
                } focus:ring-2 focus:ring-blue-400`}
              >
                <option value="">Select</option>
                <option value="Government Service">Government Service</option>
                <option value="Private Service">Private Service</option>
                <option value="Business">Business</option>
                <option value="Farmer">Farmer</option>
                <option value="Self Employed">Self Employed</option>
                <option value="Retired">Retired</option>
                <option value="Homemaker">Homemaker</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-blue-800 font-medium mb-1">
                Annual Family Income
              </label>
              <select
                name="annualIncome"
                value={editMode ? form.annualIncome : profile.annualIncome}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full px-4 py-2 border rounded-lg ${
                  editMode ? "bg-white" : "bg-gray-100 cursor-not-allowed"
                } focus:ring-2 focus:ring-blue-400`}
              >
                <option value="">Select</option>
                <option value="Below 1 Lakh">Below 1 Lakh</option>
                <option value="1-2 Lakhs">1-2 Lakhs</option>
                <option value="2-5 Lakhs">2-5 Lakhs</option>
                <option value="5-10 Lakhs">5-10 Lakhs</option>
                <option value="Above 10 Lakhs">Above 10 Lakhs</option>
              </select>
              {errors.annualIncome && (
                <p className="text-red-500 text-sm">{errors.annualIncome}</p>
              )}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-blue-800 border-b pb-1">Family Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-blue-800 font-medium mb-1">
                Parent/Guardian Occupation
              </label>
              <input
                type="text"
                name="parentOccupation"
                value={
                  editMode
                    ? form.parentOccupation
                    : profile.parentOccupation
                }
                onChange={handleChange}
                disabled={!editMode}
                className="w-full px-4 py-2 border rounded-lg bg-white disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-blue-800 font-medium mb-1">
                Annual Family Income
              </label>
              <input
                type="text"
                name="annualIncome"
                value={
                  editMode
                    ? form.annualIncome
                    : profile.annualIncome
                }
                onChange={handleChange}
                disabled={!editMode}
                className="w-full px-4 py-2 border rounded-lg bg-white disabled:bg-gray-100"
              />
              {errors.annualIncome && (
                <p className="text-red-500 text-sm">{errors.annualIncome}</p>
              )}
            </div>
          </div>

          {/* ---------- Academic Info ---------- */}
          <h3 className="text-lg font-semibold text-blue-800 border-b pb-1">Academic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-blue-800 font-medium mb-1">
                Current Course
              </label>
              <select
                name="course"
                value={editMode ? form.course : profile.course}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full px-4 py-2 border rounded-lg ${
                  editMode ? "bg-white" : "bg-gray-100 cursor-not-allowed"
                } focus:ring-2 focus:ring-blue-400`}
              >
                <option value="">Select Course</option>
                <option>B.Tech (Computer Science)</option>
                <option>B.Tech (Mechanical Engineering)</option>
                <option>B.Tech (Electrical Engineering)</option>
                <option>B.Tech (Civil Engineering)</option>
                <option>B.Tech (Electronics & Communication)</option>
                <option>B.E. (Computer Science)</option>
                <option>B.E. (Mechanical Engineering)</option>
                <option>B.E. (Electrical Engineering)</option>
                <option>B.E. (Civil Engineering)</option>
                <option>B.E. (Electronics & Communication)</option>
                <option>Diploma (Engineering)</option>
                <option>M.Tech (Computer Science)</option>
                <option>M.Tech (Mechanical Engineering)</option>
                <option>M.Tech (Electrical Engineering)</option>
                <option>M.Tech (Civil Engineering)</option>
                <option>M.Tech (Electronics & Communication)</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-blue-800 font-medium mb-1">
                Year/Semester
              </label>
              <select
                name="year"
                value={editMode ? form.year : profile.year}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full px-4 py-2 border rounded-lg ${
                  editMode ? "bg-white" : "bg-gray-100 cursor-not-allowed"
                } focus:ring-2 focus:ring-blue-400`}
              >
                <option value="">Select</option>
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
              </select>
            </div>
            <div>
              <label className="block text-blue-800 font-medium mb-1">
                Mode of Study
              </label>
              <select
                name="mode"
                value={editMode ? form.mode : profile.mode}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full px-4 py-2 border rounded-lg ${
                  editMode ? "bg-white" : "bg-gray-100 cursor-not-allowed"
                } focus:ring-2 focus:ring-blue-400`}
              >
                <option value="">Select</option>
                <option>Regular</option>
                <option>Distance</option>
              </select>
            </div>
            <div>
              <label className="block text-blue-800 font-medium mb-1">
                Institution
              </label>
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
              <label className="block text-blue-800 font-medium mb-1">
                Previous Exam %
              </label>
              <input
                type="text"
                name="prevPercentage"
                value={
                  editMode
                    ? form.prevPercentage
                    : profile.prevPercentage
                }
                onChange={handleChange}
                disabled={!editMode}
                className="w-full px-4 py-2 border rounded-lg bg-white disabled:bg-gray-100"
              />
              {errors.prevPercentage && (
                <p className="text-red-500 text-sm">{errors.prevPercentage}</p>
              )}
            </div>
            <div>
              <label className="block text-blue-800 font-medium mb-1">
                Current CGPA
              </label>
              <input
                type="text"
                name="cgpa"
                value={editMode ? form.cgpa : profile.cgpa}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full px-4 py-2 border rounded-lg bg-white disabled:bg-gray-100"
              />
              {errors.cgpa && (
                <p className="text-red-500 text-sm">{errors.cgpa}</p>
              )}
            </div>
          </div>

          {/* ---------- Other Info ---------- */}
          <h3 className="text-lg font-semibold text-blue-800 border-b pb-1">Other Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-blue-800 font-medium mb-1">
                Already on Scholarship?
              </label>
              <select
                name="hasScholarship"
                value={editMode ? form.hasScholarship : profile.hasScholarship}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full px-4 py-2 border rounded-lg ${
                  editMode ? "bg-white" : "bg-gray-100 cursor-not-allowed"
                } focus:ring-2 focus:ring-blue-400`}
              >
                <option value="">Select</option>
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
            <div>
              <label className="block text-blue-800 font-medium mb-1">
                Career Goal (optional)
              </label>
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
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  className="bg-gray-300 text-blue-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                  onClick={() => setEditMode(false)}
                  disabled={saving}
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
