"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { HeroSection } from "@/components/hero-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { apiService } from "@/lib/api";
import { useRouter } from "next/navigation";

const validationSchema = Yup.object({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name is too long")
    .matches(/^[a-zA-Z\s]+$/, "First name can only contain letters")
    .required("First name is required"),
  
  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name is too long")
    .matches(/^[a-zA-Z\s]+$/, "Last name can only contain letters")
    .required("Last name is required"),
  
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10,15}$/, "Phone number must be 10-15 digits")
    .required("Phone number is required"),
  
  vin: Yup.string()
    .min(17, "VIN must be exactly 17 characters")
    .max(17, "VIN must be exactly 17 characters")
    .matches(/^[A-HJ-NPR-Z0-9]{17}$/, "Invalid VIN format")
    .required("VIN is required"),
  
  year: Yup.number()
    .required("Year is required")
    .min(1900, "Year must be 1900 or later")
    .max(new Date().getFullYear() + 1, `Year cannot exceed ${new Date().getFullYear() + 1}`),
  
  make: Yup.string()
    .required("Please select a car make"),
  
  model: Yup.string()
    .required("Please select a car model"),
  
  mileage: Yup.number()
    .required("Mileage is required")
    .min(0, "Mileage cannot be negative")
    .max(999999, "Mileage seems unrealistic"),
  
  engineSize: Yup.string()
    .required("Please select engine size"),
  
  noteworthy: Yup.string()
    .max(500, "Description is too long (max 500 characters)")
    .optional(),
  
  accidentHistory: Yup.string()
    .required("Please select accident history"),
  
  serviceHistory: Yup.string()
    .required("Please select service history"),
  
  carModified: Yup.string()
    .required("Please indicate if car is modified"),
  
  maxBid: Yup.number()
    .required("Starting price is required")
    .min(100, "Starting price must be at least $100")
    .max(10000000, "Starting price is too high"),
});

export default function SellYourCarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dealerType, setDealerType] = useState("private");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      vin: "",
      year: "",
      make: "",
      model: "",
      mileage: "",
      engineSize: "",
      noteworthy: "",
      accidentHistory: "",
      serviceHistory: "",
      carModified: "",
      maxBid: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        // Check if form is valid before proceeding
        const errors = await formik.validateForm();
        if (Object.keys(errors).length > 0) {
          toast.error("Please fix all errors before submitting");
          setLoading(false);
          return;
        }
        
        // Validate images
        if (uploadedImages.length === 0) {
          toast.error("Please upload at least one photo of your car");
          setLoading(false);
          return;
        }

        const carData = {
          title: `${values.year} ${values.make} ${values.model}`,
          make: values.make,
          model: values.model,
          year: parseInt(values.year),
          mileage: parseInt(values.mileage),
          bodyType: "sedan",
          condition: values.accidentHistory === "none" ? "Excellent" : "Good",
          color: "Black",
          startingPrice: parseFloat(values.maxBid),
          photos: uploadedImages.length > 0 ? uploadedImages : ["/placeholder.jpg"],
        };

        const response = await apiService.cars.create(carData);
        
        // Set start time to NOW and end time to 2 minutes from now
        const startTime = new Date(); // Start immediately
        const endTime = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes from now
        
        const auctionData = {
          carId: response._id,
          title: `${values.year} ${values.make} ${values.model}`,
          description: values.noteworthy || `${values.year} ${values.make} ${values.model}`,
          startTime: startTime,
          endTime: endTime,
          startingPrice: parseFloat(values.maxBid),
        };

        await apiService.auctions.create(auctionData);

        toast.success("Auction created! Your car is now live for 2 minutes!");
        setTimeout(() => router.push("/"), 1500);
      } catch (error: any) {
        console.error("Full Error Details:", {
          error,
          message: error?.message,
          response: error?.response,
          stack: error?.stack
        });
        
        const errorMessage = error?.message || "Failed to list car";
        
        if (errorMessage.includes("Unauthorized") || errorMessage.includes("401")) {
          toast.error("Please log in to list your car", {
            duration: 5000,
          });
        } else if (errorMessage.includes("Cloudinary") || errorMessage.includes("upload")) {
          toast.error("Failed to upload images. Please try with smaller images.", {
            duration: 5000,
          });
        } else {
          toast.error(`Error: ${errorMessage}`, {
            duration: 6000,
          });
        }
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <>
      <HeroSection
        title="Sell Your Car"
        description="Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu mus."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Sell Your Car" },
        ]}
      />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Title Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Tell us about your car</h2>
          <p className="text-gray-600 leading-relaxed max-w-3xl">
            We'll send you a guaranteed offer within an hour. Our process is transparent - you can review our team in real time as well as 10 photos that highlight the car's interior and exterior condition.
          </p>
          <p className="text-gray-600 leading-relaxed max-w-3xl mt-2">
            We'll respond to your application within a business day, and we work with you to build a custom and professional listing and get the auction live.
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Your Info Section */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Info</h3>
            
            {/* Dealer or Private party */}
            <div className="mb-4">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Dealer or Private party?
              </Label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setDealerType("dealer")}
                  className={`px-6 py-2 rounded border ${
                    dealerType === "dealer"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  Dealer
                </button>
                <button
                  type="button"
                  onClick={() => setDealerType("private")}
                  className={`px-6 py-2 rounded border ${
                    dealerType === "private"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  Private party
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                  First name*
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="e.g., John"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.firstName && formik.errors.firstName ? "border-red-500" : ""}
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.firstName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                  Last name*
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="e.g., Doe"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.lastName && formik.errors.lastName ? "border-red-500" : ""}
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.lastName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email*
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="e.g., john.doe@example.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.email && formik.errors.email ? "border-red-500" : ""}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                  phone number*
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="e.g., 1234567890 (10-15 digits)"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.phoneNumber && formik.errors.phoneNumber ? "border-red-500" : ""}
                />
                {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.phoneNumber}</p>
                )}
              </div>
            </div>
          </div>

          {/* Car Details Section */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Car Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vin" className="text-sm font-medium text-gray-700">
                  VIN*
                </Label>
                <Input
                  id="vin"
                  name="vin"
                  placeholder="17-character VIN (e.g., 1HGBH41JXMN109186)"
                  value={formik.values.vin}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.vin && formik.errors.vin ? "border-red-500" : ""}
                />
                {formik.touched.vin && formik.errors.vin && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.vin}</p>
                )}
              </div>

              <div>
                <Label htmlFor="year" className="text-sm font-medium text-gray-700">
                  Year*
                </Label>
                <Select
                  value={formik.values.year}
                  onValueChange={(value) => formik.setFieldValue("year", value)}
                >
                  <SelectTrigger className={formik.touched.year && formik.errors.year ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formik.touched.year && formik.errors.year && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.year}</p>
                )}
              </div>

              <div>
                <Label htmlFor="make" className="text-sm font-medium text-gray-700">
                  Make*
                </Label>
                <Select
                  value={formik.values.make}
                  onValueChange={(value) => formik.setFieldValue("make", value)}
                >
                  <SelectTrigger className={formik.touched.make && formik.errors.make ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select Make" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BMW">BMW</SelectItem>
                    <SelectItem value="Mercedes">Mercedes</SelectItem>
                    <SelectItem value="Audi">Audi</SelectItem>
                    <SelectItem value="Toyota">Toyota</SelectItem>
                    <SelectItem value="Honda">Honda</SelectItem>
                  </SelectContent>
                </Select>
                {formik.touched.make && formik.errors.make && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.make}</p>
                )}
              </div>

              <div>
                <Label htmlFor="model" className="text-sm font-medium text-gray-700">
                  Model*
                </Label>
                <Select
                  value={formik.values.model}
                  onValueChange={(value) => formik.setFieldValue("model", value)}
                >
                  <SelectTrigger className={formik.touched.model && formik.errors.model ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select Model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M4">M4</SelectItem>
                    <SelectItem value="M3">M3</SelectItem>
                    <SelectItem value="X5">X5</SelectItem>
                    <SelectItem value="Camry">Camry</SelectItem>
                    <SelectItem value="Accord">Accord</SelectItem>
                  </SelectContent>
                </Select>
                {formik.touched.model && formik.errors.model && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.model}</p>
                )}
              </div>

              <div>
                <Label htmlFor="mileage" className="text-sm font-medium text-gray-700">
                  Mileage (in miles)*
                </Label>
                <Input
                  id="mileage"
                  name="mileage"
                  type="number"
                  placeholder="e.g., 50000 (in miles)"
                  value={formik.values.mileage}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.mileage && formik.errors.mileage ? "border-red-500" : ""}
                />
                {formik.touched.mileage && formik.errors.mileage && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.mileage}</p>
                )}
              </div>

              <div>
                <Label htmlFor="engineSize" className="text-sm font-medium text-gray-700">
                  Engine size
                </Label>
                <Select
                  value={formik.values.engineSize}
                  onValueChange={(value) => formik.setFieldValue("engineSize", value)}
                >
                  <SelectTrigger className={formik.touched.engineSize && formik.errors.engineSize ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2.0L">2.0L</SelectItem>
                    <SelectItem value="3.0L">3.0L</SelectItem>
                    <SelectItem value="4.0L">4.0L</SelectItem>
                    <SelectItem value="5.0L">5.0L</SelectItem>
                  </SelectContent>
                </Select>
                {formik.touched.engineSize && formik.errors.engineSize && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.engineSize}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="noteworthy" className="text-sm font-medium text-gray-700">
                  Noteworthy options/features
                </Label>
                <Textarea
                  id="noteworthy"
                  name="noteworthy"
                  rows={3}
                  placeholder="Optional: Describe any special features, upgrades, or noteworthy details about your car..."
                  value={formik.values.noteworthy}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              <div>
                <Label htmlFor="accidentHistory" className="text-sm font-medium text-gray-700">
                  Accident History
                </Label>
                <Select
                  value={formik.values.accidentHistory}
                  onValueChange={(value) => formik.setFieldValue("accidentHistory", value)}
                >
                  <SelectTrigger className={formik.touched.accidentHistory && formik.errors.accidentHistory ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Accidents</SelectItem>
                    <SelectItem value="minor">Minor Accident</SelectItem>
                    <SelectItem value="major">Major Accident</SelectItem>
                  </SelectContent>
                </Select>
                {formik.touched.accidentHistory && formik.errors.accidentHistory && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.accidentHistory}</p>
                )}
              </div>

              <div>
                <Label htmlFor="serviceHistory" className="text-sm font-medium text-gray-700">
                  Full Service History
                </Label>
                <Select
                  value={formik.values.serviceHistory}
                  onValueChange={(value) => formik.setFieldValue("serviceHistory", value)}
                >
                  <SelectTrigger className={formik.touched.serviceHistory && formik.errors.serviceHistory ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Service History</SelectItem>
                    <SelectItem value="partial">Partial Service History</SelectItem>
                    <SelectItem value="none">No Service History</SelectItem>
                  </SelectContent>
                </Select>
                {formik.touched.serviceHistory && formik.errors.serviceHistory && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.serviceHistory}</p>
                )}
              </div>

              <div>
                <Label htmlFor="carModified" className="text-sm font-medium text-gray-700">
                  Has the car been modified?
                </Label>
                <div className="flex gap-4 mt-2">
                  <button
                    type="button"
                    onClick={() => formik.setFieldValue("carModified", "stock")}
                    className={`flex-1 py-2 rounded border ${
                      formik.values.carModified === "stock"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                  >
                    Completely stock
                  </button>
                  <button
                    type="button"
                    onClick={() => formik.setFieldValue("carModified", "modified")}
                    className={`flex-1 py-2 rounded border ${
                      formik.values.carModified === "modified"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                  >
                    Modified
                  </button>
                </div>
                {formik.touched.carModified && formik.errors.carModified && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.carModified}</p>
                )}
              </div>

              <div>
                <Label htmlFor="maxBid" className="text-sm font-medium text-gray-700">
                  Max Bid*
                </Label>
                <Input
                  id="maxBid"
                  name="maxBid"
                  type="number"
                  placeholder="e.g., 25000 (minimum $100)"
                  value={formik.values.maxBid}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.maxBid && formik.errors.maxBid ? "border-red-500" : ""}
                />
                {formik.touched.maxBid && formik.errors.maxBid && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.maxBid}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-gray-700 block mb-2">
                  Upload Photos
                </Label>
                
                {/* File Input */}
                <input
                  type="file"
                  id="photo-upload"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                
                {/* Upload Button */}
                <label htmlFor="photo-upload">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">
                      <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </label>

                {/* Image Preview Grid */}
                {uploadedImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {uploadedImages.length > 0 && (
                  <p className="mt-2 text-sm text-gray-600">
                    {uploadedImages.length} photo{uploadedImages.length > 1 ? 's' : ''} uploaded
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={loading || !formik.isValid}
              className="bg-[#3d4f9f] hover:bg-[#2d3f8f] text-white px-12 py-3 rounded"
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}