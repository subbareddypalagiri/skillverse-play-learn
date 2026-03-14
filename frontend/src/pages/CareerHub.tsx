import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, MapPin, Search, Filter, ChevronLeft, ChevronRight, ExternalLink, Loader2, AlertCircle, RefreshCw, FileText } from "lucide-react";
import { apiClient } from "@/lib/apiClient";

const CareerHub = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [allOpportunities, setAllOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 6;

  // Fetch opportunities from Opportunity Engine
  const fetchOpportunities = async (page = 1, search = "", location = "all", type = "all") => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: '1',
        limit: '100',
        ...(type !== 'all' && { type }),
        ...(location !== 'all' && { location }),
        ...(search && { search })
      });

      const response = await apiClient.get(`/opportunities?${params}`);
      const result = response.data;
      
      if (result.success && result.data) {
        setAllOpportunities(result.data);
      } else {
        setError("Failed to load opportunities from backend");
        setAllOpportunities([]);
      }
    } catch (err: any) {
      console.error('Error fetching opportunities:', err);
      setError(err.message || 'Failed to load opportunities from server. Please ensure backend is running.');
      setAllOpportunities([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch when component mounts
  useEffect(() => {
    fetchOpportunities(1, "", "all", "all");
  }, []);

  // Refresh functionality - just fetches the latest data instead of scraping
  const refreshOpportunities = async () => {
    await fetchOpportunities(1, searchQuery, locationFilter, typeFilter);
  };

  // Filter opportunities locally from fetched data
  const filteredOpportunities = allOpportunities.filter((opp: any) => {
    const matchesSearch = opp.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          opp.organization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (opp.skills && opp.skills.some((skill: string) => skill.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesLocation = locationFilter === "all" || opp.location?.toLowerCase().includes(locationFilter.toLowerCase());
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
    <PageLayout>
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
                onClick={refreshOpportunities}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh Data
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
                  placeholder="Search by title, organization, or skills..."
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
                  <SelectItem value="bangalore">Bangalore</SelectItem>
                  <SelectItem value="hyderabad">Hyderabad</SelectItem>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                  <SelectItem value="pune">Pune</SelectItem>
                  <SelectItem value="chennai">Chennai</SelectItem>
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="gurugram">Gurugram</SelectItem>
                  <SelectItem value="noida">Noida</SelectItem>
                  <SelectItem value="kolkata">Kolkata</SelectItem>
                  <SelectItem value="ahmedabad">Ahmedabad</SelectItem>
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
                  <SelectItem value="job">Job</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="place">Place</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Loading State */}
          {loading ? (
            <Card className="p-12 text-center">
              <Loader2 className="w-16 h-16 mx-auto mb-4 text-primary animate-spin" />
              <h3 className="text-xl font-semibold mb-2">Loading Opportunities...</h3>
              <p className="text-muted-foreground">Fetching latest opportunities from Risee Engine</p>
            </Card>
          ) : error ? (
            <Card className="p-12 text-center border-destructive">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
              <h3 className="text-xl font-semibold mb-2 text-destructive">Error Loading Data</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={refreshOpportunities} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </Card>
          ) : paginatedOpportunities.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {paginatedOpportunities.map((opp: any) => (
                  <Card key={opp._id || opp.id} className="p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 flex flex-col">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <Badge 
                        className="bg-gradient-primary text-primary-foreground px-3 py-1 uppercase text-[10px] tracking-wider font-bold"
                      >
                        {opp.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {opp.postedAt ? new Date(opp.postedAt).toLocaleDateString() : 'Recently'}
                      </span>
                    </div>

                    {/* Title & Organization */}
                    <div className="mb-4 flex-grow">
                      <h3 className="text-xl font-bold mb-2 line-clamp-2">{opp.title}</h3>
                      <p className="text-muted-foreground font-medium">{opp.organization || opp.company}</p>
                    </div>
                    
                    {/* Details */}
                    <div className="space-y-3 mb-5">
                      <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
                        <span className="truncate font-medium">{opp.location}</span>
                      </div>
                      
                      {opp.description && (
                        <div className="flex items-start text-sm text-muted-foreground">
                          <FileText className="w-4 h-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                          <span className="line-clamp-2 leading-snug">{opp.description}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Skills */}
                    <div className="mb-5">
                      <p className="text-xs font-semibold mb-2 uppercase tracking-wider text-muted-foreground">Featured Skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {opp.skills && opp.skills.slice(0, 4).map((skill: string, idx: number) => (
                          <Badge 
                            key={idx} 
                            variant="secondary"
                            className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 text-[11px]"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {opp.skills && opp.skills.length > 4 && (
                          <Badge variant="outline" className="text-[11px]">
                            +{opp.skills.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Apply Button */}
                    <Button 
                      className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 group mt-auto shadow-md"
                      onClick={() => window.open(opp.applyLink || '#', '_blank')}
                    >
                      Apply Now
                      <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
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
    </PageLayout>
  );
};

export default CareerHub;
