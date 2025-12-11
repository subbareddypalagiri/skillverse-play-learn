import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, MapPin, DollarSign, Clock, Search, Filter, ChevronLeft, ChevronRight, ExternalLink, Loader2, AlertCircle, RefreshCw } from "lucide-react";

const CareerHub = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [allOpportunities, setAllOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 6;

  // Fetch REAL internships from JSearch API (FREE - aggregates from Indeed, LinkedIn, Glassdoor)
  const fetchInternships = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // JSearch API via RapidAPI - FREE tier: 2500 requests/month
      // Get your FREE API key from: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
      // Add VITE_RAPIDAPI_KEY=your_key to .env file
      const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY || 'YOUR_RAPIDAPI_KEY_HERE';
      
      const response = await fetch(
        'https://jsearch.p.rapidapi.com/search?query=internship&page=1&num_pages=1&date_posted=all',
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const result = await response.json();
      const jobs = result.data || [];
      
      // Transform API data to match our component structure
      const transformedData = jobs.map((job, index) => ({
        id: job.job_id || index + 1,
        title: job.job_title || 'Internship Position',
        company: job.employer_name || 'Company',
        location: job.job_city && job.job_country 
          ? `${job.job_city}, ${job.job_country}` 
          : job.job_country || 'Remote',
        type: job.job_employment_type || 'Internship',
        duration: job.job_employment_type === 'INTERN' ? '3-6 months' : 'Not specified',
        stipend: job.job_salary || job.job_min_salary 
          ? `${job.job_min_salary || 'Competitive'} - ${job.job_max_salary || ''}`
          : 'Not disclosed',
        skills: job.job_required_skills || [],
        applyLink: job.job_apply_link || job.job_google_link || '#',
        postedDate: job.job_posted_at_datetime_utc 
          ? new Date(job.job_posted_at_datetime_utc * 1000).toLocaleDateString()
          : 'Recently',
        description: job.job_description || '',
        benefits: job.job_highlights?.Benefits || [],
        qualifications: job.job_highlights?.Qualifications || []
      }));

      setAllOpportunities(transformedData);
    } catch (err) {
      console.error('Error fetching internships:', err);
      setError(err.message || 'Failed to load internships. Please check API key.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  // Filter opportunities
  const filteredOpportunities = allOpportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opp.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLocation = locationFilter === "all" || opp.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesType = typeFilter === "all" || opp.type === typeFilter;
    return matchesSearch && matchesLocation && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOpportunities = filteredOpportunities.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">Career Hub</h1>
                  <p className="text-muted-foreground text-lg">
                    {loading ? 'Loading...' : `${filteredOpportunities.length} opportunities available`}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchInternships}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Filters Section */}
          <Card className="p-6 mb-8 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Filter Opportunities</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title, company, or skills..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>

              {/* Location Filter */}
              <Select value={locationFilter} onValueChange={(value) => {
                setLocationFilter(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="new york">New York</SelectItem>
                  <SelectItem value="san francisco">San Francisco</SelectItem>
                  <SelectItem value="boston">Boston</SelectItem>
                  <SelectItem value="austin">Austin</SelectItem>
                  <SelectItem value="seattle">Seattle</SelectItem>
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select value={typeFilter} onValueChange={(value) => {
                setTypeFilter(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Loading State */}
          {loading ? (
            <Card className="p-12 text-center">
              <Loader2 className="w-16 h-16 mx-auto mb-4 text-primary animate-spin" />
              <h3 className="text-xl font-semibold mb-2">Loading Internships...</h3>
              <p className="text-muted-foreground">Fetching latest opportunities from Indian API</p>
            </Card>
          ) : error ? (
            <Card className="p-12 text-center border-destructive">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
              <h3 className="text-xl font-semibold mb-2 text-destructive">Error Loading Data</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchInternships} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </Card>
          ) : paginatedOpportunities.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {paginatedOpportunities.map((opp) => (
                  <Card key={opp.id} className="p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 flex flex-col">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <Badge 
                        className="bg-gradient-primary text-primary-foreground px-3 py-1"
                      >
                        {opp.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{opp.postedDate}</span>
                    </div>

                    {/* Title & Company */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold mb-2 line-clamp-2">{opp.title}</h3>
                      <p className="text-muted-foreground font-medium">{opp.company}</p>
                    </div>
                    
                    {/* Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
                        <span className="truncate">{opp.location}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
                        <span>{opp.duration}</span>
                      </div>
                      <div className="flex items-center text-sm font-semibold text-green-600 dark:text-green-400">
                        <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{opp.stipend}</span>
                      </div>
                    </div>
                    
                    {/* Skills */}
                    <div className="mb-4 flex-grow">
                      <p className="text-sm font-semibold mb-2">Required Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {opp.skills.map((skill, idx) => (
                          <Badge 
                            key={idx} 
                            variant="secondary"
                            className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Apply Button */}
                    <Button 
                      className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 group mt-auto"
                      onClick={() => window.open(opp.applyLink, '_blank')}
                    >
                      Apply Now
                      <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={currentPage === page ? "bg-gradient-primary text-primary-foreground" : ""}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <Card className="p-12 text-center">
              <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No opportunities found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search query</p>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CareerHub;
