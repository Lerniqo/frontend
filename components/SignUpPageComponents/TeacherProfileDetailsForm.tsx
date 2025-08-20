"use client";

import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import {
  FaUser,
  FaCamera,
  FaSpinner,
  FaUpload,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

interface TeacherProfileData {
  fullName: string;
  birthday: string;
  address: string;
  phoneNumber: string;
  nationalIdOrPassport: string;
  idProofFront?: File;
  idProofBack?: File;
  subjectsTaught: string[];
  yearsOfExperience: number;
  educationLevel: string;
  bioOrTeachingPhilosophy: string;
  profilePicture?: File;
  certificates: File[];
}

interface TeacherProfileDetailsFormProps {
  onSubmit?: (data: TeacherProfileData) => void;
  isLoading?: boolean;
  initialData?: Partial<TeacherProfileData>;
}

export default function TeacherProfileDetailsForm({
  onSubmit,
  isLoading = false,
  initialData = {},
}: TeacherProfileDetailsFormProps) {
  // Form state
  const [formData, setFormData] = useState<TeacherProfileData>({
    fullName: initialData.fullName || "",
    birthday: initialData.birthday || "",
    address: initialData.address || "",
    phoneNumber: initialData.phoneNumber || "",
    nationalIdOrPassport: initialData.nationalIdOrPassport || "",
    idProofFront: undefined,
    idProofBack: undefined,
    subjectsTaught: initialData.subjectsTaught || [],
    yearsOfExperience: initialData.yearsOfExperience || 0,
    educationLevel: initialData.educationLevel || "",
    bioOrTeachingPhilosophy: initialData.bioOrTeachingPhilosophy || "",
    profilePicture: undefined,
    certificates: [],
  });

  // Error state
  const [errors, setErrors] = useState<
    Partial<Record<keyof TeacherProfileData, string>>
  >({});

  // Preview states
  const [profilePreview, setProfilePreview] = useState<string>("");
  const [idProofFrontPreview, setIdProofFrontPreview] = useState<string>("");
  const [idProofBackPreview, setIdProofBackPreview] = useState<string>("");
  const [certificatePreviews, setCertificatePreviews] = useState<
    { name: string; preview?: string }[]
  >([]);

  // Refs for animations
  const formRef = useRef<HTMLDivElement>(null);
  const errorRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Subject options
  const subjectOptions = [
    "Mathematics",
    "Science",
    "English",
    "History",
    "Geography",
    "Physics",
    "Chemistry",
    "Biology",
    "Literature",
    "Art",
    "Music",
    "Physical Education",
    "Computer Science",
    "Economics",
    "Psychology",
    "Philosophy",
    "Foreign Languages",
    "Other",
  ];

  // Education level options
  const educationLevelOptions = [
    { value: "", label: "Select Education Level" },
    { value: "bachelor", label: "Bachelor's Degree" },
    { value: "master", label: "Master's Degree" },
    { value: "phd", label: "PhD/Doctorate" },
    { value: "other", label: "Other" },
  ];

  // Animation effects
  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        {
          opacity: 0,
          y: 50,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
        }
      );
    }
  }, []);

  // Input validation
  const validateField = (
    name: keyof TeacherProfileData,
    value: any
  ): string => {
    switch (name) {
      case "fullName":
        return !value?.trim() ? "Full name is required" : "";
      case "birthday":
        return !value ? "Birthday is required" : "";
      case "address":
        return !value?.trim() ? "Address is required" : "";
      case "phoneNumber":
        if (!value?.trim()) return "Phone number is required";
        const phoneRegex =
          /^[\+]?[1-9][\d]{0,15}$|^[\(]?[\d]{3}[\)]?[\s\-]?[\d]{3}[\s\-]?[\d]{4}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ""))) {
          return "Please enter a valid phone number";
        }
        return "";
      case "nationalIdOrPassport":
        return !value?.trim()
          ? "National ID or Passport number is required"
          : "";
      case "idProofFront":
        return !formData.idProofFront ? "Front ID proof is required" : "";
      case "idProofBack":
        return !formData.idProofBack ? "Back ID proof is required" : "";
      case "subjectsTaught":
        return !value || value.length === 0
          ? "At least one subject is required"
          : "";
      case "yearsOfExperience":
        return value < 0 ? "Years of experience must be 0 or more" : "";
      case "educationLevel":
        return !value ? "Education level is required" : "";
      case "bioOrTeachingPhilosophy":
        if (!value?.trim()) return "Bio/Teaching philosophy is required";
        if (value.length > 300) return "Bio must be 300 characters or less";
        return "";
      case "certificates":
        return !value || value.length === 0
          ? "At least one certificate is required"
          : "";
      default:
        return "";
    }
  };

  // Handle input changes
  const handleInputChange = (name: keyof TeacherProfileData, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);

      // Animate error removal
      const errorElement = errorRefs.current[name];
      if (errorElement) {
        gsap.to(errorElement, {
          opacity: 0,
          height: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    }
  };

  // Handle subject selection
  const handleSubjectToggle = (subject: string) => {
    const currentSubjects = formData.subjectsTaught;
    const newSubjects = currentSubjects.includes(subject)
      ? currentSubjects.filter((s) => s !== subject)
      : [...currentSubjects, subject];

    handleInputChange("subjectsTaught", newSubjects);
  };

  // Handle file upload with preview
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof TeacherProfileData,
    setPreview?: (preview: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/") || file.type === "application/pdf") {
        if (fieldName === "certificates") {
          // Handle multiple certificates
          const currentCertificates = formData.certificates;
          const newCertificates = [...currentCertificates, file];
          handleInputChange("certificates", newCertificates);

          // Update certificate previews
          const newPreviews = [...certificatePreviews];
          if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => {
              newPreviews.push({
                name: file.name,
                preview: e.target?.result as string,
              });
              setCertificatePreviews(newPreviews);
            };
            reader.readAsDataURL(file);
          } else {
            newPreviews.push({ name: file.name });
            setCertificatePreviews(newPreviews);
          }
        } else {
          handleInputChange(fieldName, file);

          // Create preview for images
          if (file.type.startsWith("image/") && setPreview) {
            const reader = new FileReader();
            reader.onload = (e) => {
              setPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
          }
        }
      } else {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: "Please select a valid image or PDF file",
        }));
      }
    }
  };

  // Remove certificate
  const removeCertificate = (index: number) => {
    const newCertificates = formData.certificates.filter((_, i) => i !== index);
    const newPreviews = certificatePreviews.filter((_, i) => i !== index);

    handleInputChange("certificates", newCertificates);
    setCertificatePreviews(newPreviews);
  };

  // Show error with animation
  const showError = (field: keyof TeacherProfileData, message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }));

    // Animate error appearance
    setTimeout(() => {
      const errorElement = errorRefs.current[field];
      if (errorElement) {
        gsap.fromTo(
          errorElement,
          {
            opacity: 0,
            height: 0,
          },
          {
            opacity: 1,
            height: "auto",
            duration: 0.4,
            ease: "power2.out",
          }
        );
      }
    }, 0);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Partial<Record<keyof TeacherProfileData, string>> = {};

    // Validate all required fields
    (Object.keys(formData) as (keyof TeacherProfileData)[]).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      // Show all errors with staggered animation
      Object.entries(newErrors).forEach(([field, message], index) => {
        setTimeout(() => {
          showError(field as keyof TeacherProfileData, message || "");
        }, index * 100);
      });
      return;
    }

    // Call onSubmit if provided
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  // Button hover animation
  const handleButtonHover = (
    isEntering: boolean,
    element: HTMLButtonElement
  ) => {
    if (isEntering) {
      gsap.to(element, {
        scale: 1.05,
        duration: 0.2,
        ease: "power2.out",
      });
    } else {
      gsap.to(element, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  };

  return (
    <div ref={formRef} className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture Upload */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
              {profilePreview ? (
                <img
                  src={profilePreview}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUser className="text-gray-400 text-2xl" />
              )}
            </div>
            <label className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-green-500 text-white p-2 rounded-full cursor-pointer hover:shadow-lg transition-shadow duration-200">
              <FaCamera className="text-sm" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleFileUpload(e, "profilePicture", setProfilePreview)
                }
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter full name"
              />
              {errors.fullName && (
                <div
                  ref={(el) => {
                    errorRefs.current.fullName = el;
                  }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.fullName}
                </div>
              )}
            </div>

            {/* Birthday */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Birthday *
              </label>
              <input
                type="date"
                value={formData.birthday}
                onChange={(e) => handleInputChange("birthday", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
              {errors.birthday && (
                <div
                  ref={(el) => {
                    errorRefs.current.birthday = el;
                  }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.birthday}
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Enter your full address"
            />
            {errors.address && (
              <div
                ref={(el) => {
                  errorRefs.current.address = el;
                }}
                className="text-red-500 text-sm mt-1"
              >
                {errors.address}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter phone number"
              />
              {errors.phoneNumber && (
                <div
                  ref={(el) => {
                    errorRefs.current.phoneNumber = el;
                  }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.phoneNumber}
                </div>
              )}
            </div>

            {/* National ID / Passport */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                National ID / Passport Number *
              </label>
              <input
                type="text"
                value={formData.nationalIdOrPassport}
                onChange={(e) =>
                  handleInputChange("nationalIdOrPassport", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter ID or passport number"
              />
              {errors.nationalIdOrPassport && (
                <div
                  ref={(el) => {
                    errorRefs.current.nationalIdOrPassport = el;
                  }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.nationalIdOrPassport}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ID Proof Upload Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            ID Proof Upload
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Front ID Proof */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID Proof Front *
              </label>
              <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                {idProofFrontPreview ? (
                  <div className="relative">
                    <img
                      src={idProofFrontPreview}
                      alt="ID Front"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                      <FaCheck className="text-xs" />
                    </div>
                  </div>
                ) : (
                  <div className="py-8">
                    <FaUpload className="text-gray-400 text-2xl mb-2 mx-auto" />
                    <p className="text-gray-600 text-sm">Upload front of ID</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleFileUpload(e, "idProofFront", setIdProofFrontPreview)
                  }
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              {errors.idProofFront && (
                <div
                  ref={(el) => {
                    errorRefs.current.idProofFront = el;
                  }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.idProofFront}
                </div>
              )}
            </div>

            {/* Back ID Proof */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID Proof Back *
              </label>
              <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                {idProofBackPreview ? (
                  <div className="relative">
                    <img
                      src={idProofBackPreview}
                      alt="ID Back"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                      <FaCheck className="text-xs" />
                    </div>
                  </div>
                ) : (
                  <div className="py-8">
                    <FaUpload className="text-gray-400 text-2xl mb-2 mx-auto" />
                    <p className="text-gray-600 text-sm">Upload back of ID</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleFileUpload(e, "idProofBack", setIdProofBackPreview)
                  }
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              {errors.idProofBack && (
                <div
                  ref={(el) => {
                    errorRefs.current.idProofBack = el;
                  }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.idProofBack}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Professional Information Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Professional Information
          </h3>

          {/* Subjects Taught */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subjects Taught *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4 border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
              {subjectOptions.map((subject) => (
                <label
                  key={subject}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.subjectsTaught.includes(subject)}
                    onChange={() => handleSubjectToggle(subject)}
                    className="text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{subject}</span>
                </label>
              ))}
            </div>
            {errors.subjectsTaught && (
              <div
                ref={(el) => {
                  errorRefs.current.subjectsTaught = el;
                }}
                className="text-red-500 text-sm mt-1"
              >
                {errors.subjectsTaught}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Years of Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience *
              </label>
              <input
                type="number"
                min="0"
                value={formData.yearsOfExperience}
                onChange={(e) =>
                  handleInputChange(
                    "yearsOfExperience",
                    parseInt(e.target.value) || 0
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter years of experience"
              />
              {errors.yearsOfExperience && (
                <div
                  ref={(el) => {
                    errorRefs.current.yearsOfExperience = el;
                  }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.yearsOfExperience}
                </div>
              )}
            </div>

            {/* Education Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Highest Education Level *
              </label>
              <select
                value={formData.educationLevel}
                onChange={(e) =>
                  handleInputChange("educationLevel", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                {educationLevelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.educationLevel && (
                <div
                  ref={(el) => {
                    errorRefs.current.educationLevel = el;
                  }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.educationLevel}
                </div>
              )}
            </div>
          </div>

          {/* Bio / Teaching Philosophy */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Bio / Teaching Philosophy * (Max 300 characters)
            </label>
            <textarea
              value={formData.bioOrTeachingPhilosophy}
              onChange={(e) =>
                handleInputChange("bioOrTeachingPhilosophy", e.target.value)
              }
              maxLength={300}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Describe your teaching philosophy or background..."
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {formData.bioOrTeachingPhilosophy.length}/300
            </div>
            {errors.bioOrTeachingPhilosophy && (
              <div
                ref={(el) => {
                  errorRefs.current.bioOrTeachingPhilosophy = el;
                }}
                className="text-red-500 text-sm mt-1"
              >
                {errors.bioOrTeachingPhilosophy}
              </div>
            )}
          </div>
        </div>

        {/* Certificates Upload Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Certificates / Qualifications
          </h3>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors relative">
            <FaUpload className="text-gray-400 text-3xl mb-4 mx-auto" />
            <p className="text-gray-600 mb-2">
              Upload your certificates and qualifications
            </p>
            <p className="text-gray-500 text-sm">
              Accepted formats: PDF, JPG, PNG
            </p>
            <input
              type="file"
              accept=".pdf,image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                files.forEach((file) => {
                  // Handle multiple certificates
                  const currentCertificates = formData.certificates;
                  const newCertificates = [...currentCertificates, file];
                  handleInputChange("certificates", newCertificates);

                  // Update certificate previews
                  const newPreviews = [...certificatePreviews];
                  if (file.type.startsWith("image/")) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      newPreviews.push({
                        name: file.name,
                        preview: e.target?.result as string,
                      });
                      setCertificatePreviews(newPreviews);
                    };
                    reader.readAsDataURL(file);
                  } else {
                    newPreviews.push({ name: file.name });
                    setCertificatePreviews(newPreviews);
                  }
                });
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          {/* Certificate Previews */}
          {certificatePreviews.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Uploaded Certificates:
              </h4>
              <div className="space-y-2">
                {certificatePreviews.map((cert, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {cert.preview ? (
                        <img
                          src={cert.preview}
                          alt="Certificate"
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-500">PDF</span>
                        </div>
                      )}
                      <span className="text-sm text-gray-700">{cert.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCertificate(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {errors.certificates && (
            <div
              ref={(el) => {
                errorRefs.current.certificates = el;
              }}
              className="text-red-500 text-sm mt-2"
            >
              {errors.certificates}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          onMouseEnter={(e) =>
            !isLoading && handleButtonHover(true, e.currentTarget)
          }
          onMouseLeave={(e) =>
            !isLoading && handleButtonHover(false, e.currentTarget)
          }
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Processing...
            </>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </div>
  );
}
