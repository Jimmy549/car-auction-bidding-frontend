"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HeroSection } from "@/components/hero-section";
import { LiveAuctionCard } from "@/components/live-auction-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { RootState, AppDispatch } from "@/store";
import { fetchAuctions } from "@/store/slices/auctionsSlice";
import { apiService } from "@/lib/api";

export default function CarAuctionPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { auctions, loading, error } = useSelector((state: RootState) => state.auctions);
  
  const [filters, setFilters] = useState({
    carType: 'all',
    color: 'all',
    make: 'all',
    model: '',
    style: '',
    minPrice: 0,
    maxPrice: 200000,
    sortBy: 'relevance'
  });
  
  const [categories, setCategories] = useState([]);
  const [makes, setMakes] = useState([]);
  const [filteredAuctions, setFilteredAuctions] = useState([]);
  const [priceRange, setPriceRange] = useState([50000]);

  useEffect(() => {
    dispatch(fetchAuctions());
    fetchCategories();
    fetchMakes();
  }, [dispatch]);

  useEffect(() => {
    applyFilters();
  }, [auctions, filters]);

  const fetchCategories = async () => {
    try {
      const response = await apiService.categories.getAll();
      setCategories(response);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchMakes = async () => {
    try {
      const response = await apiService.cars.getAll();
      const uniqueMakes = [...new Set(response.map(car => car.make))];
      setMakes(uniqueMakes);
    } catch (error) {
      console.error('Failed to fetch makes:', error);
    }
  };

  const applyFilters = () => {
    // Safety check: ensure auctions is an array
    if (!Array.isArray(auctions)) {
      setFilteredAuctions([]);
      return;
    }

    let filtered = [...auctions];

    if (filters.carType && filters.carType !== 'all') {
      filtered = filtered.filter(auction => 
        auction.car?.category?.toLowerCase().includes(filters.carType.toLowerCase())
      );
    }

    if (filters.color && filters.color !== 'all') {
      filtered = filtered.filter(auction => 
        auction.car?.color?.toLowerCase() === filters.color.toLowerCase()
      );
    }

    if (filters.make && filters.make !== 'all') {
      filtered = filtered.filter(auction => 
        auction.car?.make?.toLowerCase() === filters.make.toLowerCase()
      );
    }

    filtered = filtered.filter(auction => 
      auction.currentPrice >= filters.minPrice && 
      auction.currentPrice <= filters.maxPrice
    );

    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.currentPrice - b.currentPrice);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.currentPrice - a.currentPrice);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'ending-soon':
        filtered.sort((a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime());
        break;
    }

    setFilteredAuctions(filtered);
  };

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
    setFilters(prev => ({ ...prev, maxPrice: value[0] * 2000 }));
  };

  const clearFilters = () => {
    setFilters({
      carType: 'all',
      color: 'all',
      make: 'all',
      model: '',
      style: '',
      minPrice: 0,
      maxPrice: 200000,
      sortBy: 'relevance'
    });
    setPriceRange([50]);
  };

  return (
    <>
      <HeroSection
        title="Auction"
        description="Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Auction", href: "/car-auction" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-[#4A5FBF] text-white p-4 rounded-lg flex items-center justify-between mb-6">
              <span className="text-sm">
                Showing 1-{Math.min(filteredAuctions.length, 10)} of {filteredAuctions.length} Results
              </span>
              <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                <SelectTrigger className="w-40 bg-white text-black">
                  <SelectValue placeholder="Sort by Relevance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Sort by Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="ending-soon">Ending Soon</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A5FBF] mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading auctions...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-8">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              </div>
            )}

            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAuctions.length > 0 ? (
                  filteredAuctions.map((auction) => (
                    <LiveAuctionCard key={auction._id} auction={auction} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-600">No auctions found matching your filters.</p>
                    <Button onClick={clearFilters} className="mt-4">
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-center gap-2 mt-8">
              <Button variant="ghost" size="sm">&lt;</Button>
              <Button variant="default" size="sm" className="bg-[#4A5FBF]">1</Button>
              <Button variant="ghost" size="sm">2</Button>
              <Button variant="ghost" size="sm">3</Button>
              <Button variant="ghost" size="sm">&gt;</Button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <div className="bg-[#4A5FBF] text-white p-4 rounded-t-lg flex items-center justify-between">
                <h3 className="font-semibold">Filter By</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-white hover:text-gray-200">
                  Clear All
                </Button>
              </div>
              <CardContent className="p-4 space-y-4">
                <div>
                  <Select value={filters.carType} onValueChange={(value) => handleFilterChange('carType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Car Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Car Type</SelectItem>
                      {categories.map((cat: any) => (
                        <SelectItem key={cat._id} value={cat.name.toLowerCase()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select value={filters.color} onValueChange={(value) => handleFilterChange('color', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Color" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Color</SelectItem>
                      <SelectItem value="white">White</SelectItem>
                      <SelectItem value="black">Black</SelectItem>
                      <SelectItem value="red">Red</SelectItem>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="yellow">Yellow</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select value={filters.make} onValueChange={(value) => handleFilterChange('make', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Makes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Makes</SelectItem>
                      {makes.map((make: string) => (
                        <SelectItem key={make} value={make.toLowerCase()}>
                          {make}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium">Price Range</label>
                  <Slider
                    value={priceRange}
                    onValueChange={handlePriceChange}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-600">
                    Price: $0 - ${(priceRange[0] * 2000).toLocaleString()}
                  </div>
                  <Button 
                    onClick={applyFilters}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                  >
                    Apply Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}