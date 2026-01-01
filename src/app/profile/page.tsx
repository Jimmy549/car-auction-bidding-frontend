"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Edit, Camera, Heart, Star } from "lucide-react";

import { HeroSection } from "@/components/hero-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProtectedRoute } from "@/components/protected-route";
import { RootState, AppDispatch } from "@/store";
import { fetchMyAuctions } from "@/store/slices/auctionsSlice";
import { fetchMyBids } from "@/store/slices/bidsSlice";
import { fetchWishlist } from "@/store/slices/wishlistSlice";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"personal" | "cars" | "bids" | "wishlist">("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "Manish Sharma",
    email: "Manish Sharma",
    mobileNumber: "1234567890",
    nationality: "India",
    idType: "India",
    idNumber: "345203",
    password: "••••••••",
    country: "India",
    city: "India",
    address1: "India",
    address2: "Manish Sharma",
    landLineNumber: "345203",
    poBox: "345203",
    trafficInfoType: "••••••",
    plateState: "",
    trafficFileNumber: "Manish Sharma",
    plateCode: "",
    plateNumber: "Manish Sharma",
    driverLicenseNumber: "",
    issueCity: ""
  });

  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { myAuctions, loading: auctionsLoading } = useSelector((state: RootState) => state.auctions);
  const { myBids, loading: bidsLoading } = useSelector((state: RootState) => state.bids);
  const { items: wishlistItems, loading: wishlistLoading } = useSelector((state: RootState) => state.wishlist);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || user.username || "Manish Sharma",
        email: user.email || "Manish Sharma",
        mobileNumber: user.mobileNumber || "1234567890"
      }));
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === "cars") {
      dispatch(fetchMyAuctions());
    } else if (activeTab === "bids") {
      dispatch(fetchMyBids());
    } else if (activeTab === "wishlist") {
      dispatch(fetchWishlist());
    }
  }, [activeTab, dispatch]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const sidebarItems = [
    { id: "personal", label: "Personal Information" },
    { id: "cars", label: "My Cars" },
    { id: "bids", label: "My Bids" },
    { id: "wishlist", label: "Wishlist" }
  ];

  return (
    <ProtectedRoute>
      <HeroSection
        title="My Profile"
        description="Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "My Profile" }]}
      />

      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border">
                <nav className="space-y-1">
                  {sidebarItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`w-full text-left px-6 py-4 border-l-4 transition-colors ${
                        activeTab === item.id
                          ? "border-yellow-400 bg-yellow-50 text-[#4A5FBF] font-medium"
                          : "border-transparent text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === "personal" && (
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div className="bg-white rounded-lg shadow-sm border">
                    <div className="bg-[#4A5FBF] text-white p-4 rounded-t-lg flex items-center justify-between">
                      <h2 className="text-lg font-semibold">Personal Information</h2>
                      <button
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded hover:bg-white/30 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-6">
                      <div className="flex items-start gap-6 mb-6">
                        <div className="relative">
                          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                            <img
                              src="/professional-headshot.png"
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-[#4A5FBF] mb-1">Full Name</label>
                            <p className="text-gray-900">{formData.fullName}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#4A5FBF] mb-1">Email</label>
                            <p className="text-gray-900">{formData.email}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#4A5FBF] mb-1">Mobile Number</label>
                            <p className="text-gray-900">{formData.mobileNumber}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#4A5FBF] mb-1">Nationality</label>
                            <p className="text-gray-900">{formData.nationality}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#4A5FBF] mb-1">ID Type</label>
                            <p className="text-gray-900">{formData.idType}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#4A5FBF] mb-1">ID Number</label>
                            <p className="text-gray-900">{formData.idNumber}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Password Section */}
                  <div className="bg-white rounded-lg shadow-sm border">
                    <div className="bg-[#4A5FBF] text-white p-4 rounded-t-lg flex items-center justify-between">
                      <h2 className="text-lg font-semibold">Password</h2>
                      <button className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded hover:bg-white/30 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-6">
                      <div>
                        <label className="block text-sm font-medium text-[#4A5FBF] mb-1">Password</label>
                        <p className="text-gray-900">{formData.password}</p>
                      </div>
                    </div>
                  </div>

                  {/* Address Section */}
                  <div className="bg-white rounded-lg shadow-sm border">
                    <div className="bg-[#4A5FBF] text-white p-4 rounded-t-lg flex items-center justify-between">
                      <h2 className="text-lg font-semibold">Address</h2>
                      <button className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded hover:bg-white/30 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-[#4A5FBF] mb-1">Country</label>
                          <p className="text-gray-900">{formData.country}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#4A5FBF] mb-1">City</label>
                          <p className="text-gray-900">{formData.city}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#4A5FBF] mb-1">Address 1</label>
                          <p className="text-gray-900">{formData.address1}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#4A5FBF] mb-1">Address 2</label>
                          <p className="text-gray-900">{formData.address2}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#4A5FBF] mb-1">Land Line Number</label>
                          <p className="text-gray-900">{formData.landLineNumber}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#4A5FBF] mb-1">P.O Box</label>
                          <p className="text-gray-900">{formData.poBox}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Traffic File Information */}
                  <div className="bg-white rounded-lg shadow-sm border">
                    <div className="bg-[#4A5FBF] text-white p-4 rounded-t-lg flex items-center justify-between">
                      <h2 className="text-lg font-semibold">Traffic File Information</h2>
                      <button className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded hover:bg-white/30 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-[#4A5FBF] mb-1">Traffic Information Type</label>
                          <p className="text-gray-900">{formData.trafficInfoType}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#4A5FBF] mb-1">Plate State</label>
                          <p className="text-gray-900">{formData.plateState || "Not provided"}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#4A5FBF] mb-1">Traffic File Number</label>
                          <p className="text-gray-900">{formData.trafficFileNumber}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#4A5FBF] mb-1">Plate Code</label>
                          <p className="text-gray-900">{formData.plateCode || "Not provided"}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#4A5FBF] mb-1">Plate Number</label>
                          <p className="text-gray-900">{formData.plateNumber}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#4A5FBF] mb-1">Driver License Number</label>
                          <p className="text-gray-900">{formData.driverLicenseNumber || "Not provided"}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#4A5FBF] mb-1">Issue City</label>
                          <p className="text-gray-900">{formData.issueCity || "Not provided"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "cars" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-[#4A5FBF] mb-6">My Cars ({myAuctions.length})</h2>
                  {auctionsLoading ? (
                    <div className="text-center py-12">Loading your cars...</div>
                  ) : myAuctions.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      You haven't uploaded any cars yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {myAuctions.map((auction) => (
                        <div key={auction._id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                          <div className="relative">
                            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                              {auction.status === 'live' ? 'Live' : auction.status === 'ended' ? 'Ended' : 'Upcoming'}
                            </span>
                            <img 
                              src={auction.car?.photos?.[0] || '/yellow-bmw-m4-coupe.png'} 
                              alt={`${auction.car?.make} ${auction.car?.model}`} 
                              className="w-full h-48 object-cover" 
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-lg mb-2">
                              {auction.car?.make} {auction.car?.model} {auction.car?.year}
                            </h3>
                            <div className="flex justify-between items-center mb-4">
                              <div>
                                <span className="text-gray-500 text-sm">Starting Price</span>
                                <p className="text-gray-600">${auction.startingPrice?.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-red-500 text-sm">Current Bid</span>
                                <p className="text-red-500 font-semibold">${auction.currentPrice?.toLocaleString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                              <div className="text-right">
                                <span>{auction.totalBids || 0}</span>
                                <p>Total Bids</p>
                              </div>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-500 mb-2">
                                {new Date(auction.endTime).toLocaleString()}
                              </p>
                              <p className="text-sm text-gray-500 mb-3">End Time</p>
                              <Button 
                                onClick={() => window.location.href = `/auction/${auction._id}`}
                                className="w-full bg-[#4A5FBF] hover:bg-[#3A4FAF]"
                              >
                                View Auction
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "bids" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-[#4A5FBF] mb-6">My Bids ({myBids.length})</h2>
                  {bidsLoading ? (
                    <div className="text-center py-12">Loading your bids...</div>
                  ) : myBids.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      You haven't placed any bids yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {myBids.map((bid: any) => (
                        <div key={bid._id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                          <div className="relative">
                            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                              {bid.status === 'winning' ? 'Winning' : bid.status === 'outbid' ? 'Outbid' : 'Active'}
                            </span>
                            <Heart className="absolute top-2 right-2 w-6 h-6 text-gray-400" />
                            <img 
                              src={bid.auctionId?.car?.photos?.[0] || '/yellow-bmw-m4-coupe.png'} 
                              alt={bid.auctionId?.title} 
                              className="w-full h-48 object-cover" 
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-lg mb-2">
                              {bid.auctionId?.car?.make} {bid.auctionId?.car?.model}
                            </h3>
                            <div className="flex justify-between items-center mb-4">
                              <div>
                                <span className="text-gray-500 text-sm">Current Highest</span>
                                <p className="text-gray-600">${bid.auctionId?.currentPrice?.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className={`text-sm ${
                                  bid.status === 'winning' ? 'text-green-500' : 'text-red-500'
                                }`}>
                                  Your Bid
                                </span>
                                <p className={`font-semibold ${
                                  bid.status === 'winning' ? 'text-green-500' : 'text-red-500'
                                }`}>
                                  ${bid.amount?.toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                              <div className="text-right">
                                <span>{bid.auctionId?.totalBids || 0}</span>
                                <p>Total Bids</p>
                              </div>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-500 mb-2">
                                {bid.auctionId?.endTime ? new Date(bid.auctionId.endTime).toLocaleString() : 'N/A'}
                              </p>
                              <p className="text-sm text-gray-500 mb-3">End Time</p>
                              <Button 
                                onClick={() => window.location.href = `/auction/${bid.auctionId?._id}`}
                                className="w-full bg-[#4A5FBF] hover:bg-[#3A4FAF]"
                                disabled={bid.auctionId?.status === 'ended'}
                              >
                                {bid.status === 'winning' ? 'View Auction' : 'Update Bid'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "wishlist" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-[#4A5FBF] mb-6">Wishlist ({wishlistItems.length})</h2>
                  {wishlistLoading ? (
                    <div className="text-center py-12">Loading wishlist...</div>
                  ) : wishlistItems.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      Your wishlist is empty.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {wishlistItems.map((item: any) => (
                        <div key={item._id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                          <div className="relative">
                            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                              {item.auctionId?.status === 'live' ? 'Live' : item.auctionId?.status === 'ended' ? 'Ended' : 'Upcoming'}
                            </span>
                            <Heart className="absolute top-2 right-2 w-6 h-6 text-yellow-400 fill-current" />
                            <img 
                              src={item.auctionId?.car?.photos?.[0] || '/yellow-bmw-m4-coupe.png'} 
                              alt={item.auctionId?.title} 
                              className="w-full h-48 object-cover" 
                            />
                          </div>
                          <div className="p-4">
                            <div className="flex items-center gap-1 mb-2">
                              {[1,2,3,4,5].map((star) => (
                                <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                            <h3 className="font-semibold text-lg mb-2">
                              {item.auctionId?.car?.make} {item.auctionId?.car?.model}
                            </h3>
                            <p className="text-sm text-gray-500 mb-2">
                              {item.auctionId?.description || 'No description available'}
                            </p>
                            <div className="flex justify-between items-center mb-4">
                              <div>
                                <span className="text-gray-500 text-sm">Current Bid</span>
                                <p className="text-gray-600">${item.auctionId?.currentPrice?.toLocaleString()}</p>
                              </div>
                              <div className="text-right">
                                <span>{item.auctionId?.totalBids || 0}</span>
                                <p className="text-sm text-gray-500">Total Bids</p>
                              </div>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-500 mb-2">
                                {item.auctionId?.endTime ? new Date(item.auctionId.endTime).toLocaleString() : 'N/A'}
                              </p>
                              <p className="text-sm text-gray-500 mb-3">End Time</p>
                              <Button 
                                onClick={() => window.location.href = `/auction/${item.auctionId?._id}`}
                                className="w-full bg-[#4A5FBF] hover:bg-[#3A4FAF]"
                              >
                                View & Bid
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
