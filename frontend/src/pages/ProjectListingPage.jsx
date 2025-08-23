import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectAPI } from '../services/api';
import { 
  FaSearch, 
  FaFilter, 
  FaMapMarkerAlt, 
  FaClock, 
  FaDollarSign,
  FaCode,
  FaEye,
  FaBriefcase
} from 'react-icons/fa';

const colors = {
  background: "#DFE0E2",
  muted: "#B8BCC3",
  accent: "#787A84",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#3B82F6"
};

const ProjectCard = ({ project }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-xl font-bold text-gray-800 line-clamp-2">{project.title}</h3>
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
        project.project_type === 'fixed' 
          ? 'bg-blue-100 text-blue-800' 
          : 'bg-green-100 text-green-800'
      }`}>
        {project.project_type === 'fixed' ? 'Fixed Price' : 'Hourly'}
      </span>
    </div>
    
    <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
    
    <div className="space-y-3 mb-4">
      {/* Skills Required */}
      <div className="flex items-start">
        <FaCode className="w-4 h-4 text-gray-500 mr-2 mt-1 flex-shrink-0" />
        <div className="flex flex-wrap gap-2">
          {project.skills_required?.split(',').map((skill, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
            >
              {skill.trim()}
            </span>
          ))}
        </div>
      </div>
      
      {/* Budget */}
      {project.budget && (
        <div className="flex items-center text-gray-600">
          <FaDollarSign className="w-4 h-4 mr-2" />
          <span className="font-semibold">${project.budget}</span>
          {project.project_type === 'hourly' && <span className="ml-1">/hr</span>}
        </div>
      )}
      
      {/* Company Info */}
      <div className="flex items-center text-gray-600">
        <FaBriefcase className="w-4 h-4 mr-2" />
        <span>{project.client_company?.company_name || 'Company Name'}</span>
      </div>
    </div>
    
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-500">
        Posted {new Date(project.created_at).toLocaleDateString()}
      </span>
      <Link
        to={`/projects/${project.id}`}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        <FaEye className="w-4 h-4 mr-2" />
        View Details
      </Link>
    </div>
  </div>
);

const FilterPanel = ({ filters, setFilters, onApplyFilters }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      <FaFilter className="w-5 h-5 mr-2" />
      Filter Projects
    </h3>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Project Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
        <select
          value={filters.project_type || ''}
          onChange={(e) => setFilters(prev => ({ ...prev, project_type: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Types</option>
          <option value="fixed">Fixed Price</option>
          <option value="hourly">Hourly</option>
        </select>
      </div>
      
      {/* Budget Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Max Budget</label>
        <input
          type="number"
          placeholder="Enter amount"
          value={filters.max_budget || ''}
          onChange={(e) => setFilters(prev => ({ ...prev, max_budget: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      {/* Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
        <input
          type="text"
          placeholder="e.g., React, Python"
          value={filters.skills || ''}
          onChange={(e) => setFilters(prev => ({ ...prev, skills: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
    
    <div className="flex justify-end mt-4">
      <button
        onClick={onApplyFilters}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Apply Filters
      </button>
    </div>
  </div>
);

export default function ProjectListingPage() {
  const { isAuthenticated } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    project_type: '',
    max_budget: '',
    skills: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
    }
  }, [isAuthenticated]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      
      // For now, we'll use mock data since the backend endpoint might not be ready
      // const response = await projectAPI.getProjects(filters);
      // setProjects(response.data || []);
      
      // Mock data for demonstration
      const mockProjects = [
        {
          id: '1',
          title: 'React E-commerce Website Development',
          description: 'We need a skilled React developer to build a modern e-commerce website with shopping cart, user authentication, and payment integration. The project should be responsive and follow modern UI/UX practices.',
          skills_required: 'React, JavaScript, CSS, HTML, Node.js, MongoDB',
          budget: 2500,
          project_type: 'fixed',
          client_company: { company_name: 'TechCorp Inc.' },
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
        },
        {
          id: '2',
          title: 'Python Data Analysis Tool',
          description: 'Looking for a Python developer to create a data analysis tool that can process CSV files, generate reports, and create visualizations. Should include data cleaning and statistical analysis features.',
          skills_required: 'Python, Pandas, NumPy, Matplotlib, Data Analysis',
          budget: 45,
          project_type: 'hourly',
          client_company: { company_name: 'DataFlow Solutions' },
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
        },
        {
          id: '3',
          title: 'Mobile App UI/UX Design',
          description: 'Need a creative UI/UX designer to design a mobile app interface for a fitness tracking application. Should include wireframes, mockups, and design system guidelines.',
          skills_required: 'UI/UX Design, Figma, Adobe Creative Suite, Mobile Design',
          budget: 1800,
          project_type: 'fixed',
          client_company: { company_name: 'MobileFirst Studios' },
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
        },
        {
          id: '4',
          title: 'WordPress Website Maintenance',
          description: 'Seeking a WordPress developer to maintain and update our existing website. Tasks include plugin updates, security patches, content updates, and performance optimization.',
          skills_required: 'WordPress, PHP, MySQL, CSS, HTML, Website Maintenance',
          budget: 35,
          project_type: 'hourly',
          client_company: { company_name: 'Digital Solutions Ltd.' },
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
        },
        {
          id: '5',
          title: 'API Integration Development',
          description: 'Need help integrating third-party APIs into our existing system. The project involves connecting payment gateways, shipping APIs, and social media platforms.',
          skills_required: 'API Integration, REST APIs, JavaScript, Node.js, Webhooks',
          budget: 3200,
          project_type: 'fixed',
          client_company: { company_name: 'Integration Experts' },
          created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
        },
        {
          id: '6',
          title: 'Content Writing for Tech Blog',
          description: 'Looking for a technical content writer to create engaging blog posts about software development, programming tutorials, and industry insights.',
          skills_required: 'Content Writing, Technical Writing, SEO, Programming Knowledge',
          budget: 25,
          project_type: 'hourly',
          client_company: { company_name: 'TechBlog Media' },
          created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) // 6 days ago
        }
      ];
      
      // Apply filters to mock data
      let filteredProjects = mockProjects;
      
      if (filters.project_type) {
        filteredProjects = filteredProjects.filter(project => project.project_type === filters.project_type);
      }
      
      if (filters.max_budget) {
        filteredProjects = filteredProjects.filter(project => project.budget <= parseFloat(filters.max_budget));
      }
      
      if (filters.skills) {
        const searchSkills = filters.skills.toLowerCase().split(',').map(s => s.trim());
        filteredProjects = filteredProjects.filter(project => 
          searchSkills.some(skill => 
            project.skills_required.toLowerCase().includes(skill)
          )
        );
      }
      
      // Apply search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filteredProjects = filteredProjects.filter(project =>
          project.title.toLowerCase().includes(searchLower) ||
          project.description.toLowerCase().includes(searchLower) ||
          project.skills_required.toLowerCase().includes(searchLower)
        );
      }
      
      setProjects(filteredProjects);
      setError('');
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to load projects. Please try again.');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  const handleApplyFilters = () => {
    fetchProjects();
  };

  const clearFilters = () => {
    setFilters({
      project_type: '',
      max_budget: '',
      skills: ''
    });
    setSearchTerm('');
    // Fetch projects without filters
    setTimeout(() => fetchProjects(), 100);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to view available projects.</p>
          <Link
            to="/auth"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: colors.accent }}>
                Browse Projects
              </h1>
              <p className="text-lg text-gray-600">
                Find amazing opportunities that match your skills and experience
              </p>
            </div>
            <Link
              to="/dashboard"
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search projects by title, skills, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Filter Panel */}
        <FilterPanel 
          filters={filters} 
          setFilters={setFilters} 
          onApplyFilters={handleApplyFilters} 
        />

        {/* Clear Filters Button */}
        {(filters.project_type || filters.max_budget || filters.skills) && (
          <div className="mb-6">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors underline"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading projects...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchProjects}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <FaSearch className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No projects found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || Object.values(filters).some(f => f) 
                ? 'Try adjusting your search criteria or filters.'
                : 'There are currently no projects available. Check back later!'
              }
            </p>
            {(searchTerm || Object.values(filters).some(f => f)) && (
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {projects.length} project{projects.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
