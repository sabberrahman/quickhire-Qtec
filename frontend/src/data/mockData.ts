export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  category: string;
  type: string;
  description: string;
  tags: string[];
  createdAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  name: string;
  email: string;
  resumeLink: string;
  coverNote: string;
  createdAt: string;
}

export const categories = [
  { name: "Design", icon: "Palette", count: 225 },
  { name: "Sales", icon: "BarChart3", count: 155 },
  { name: "Marketing", icon: "Megaphone", count: 140 },
  { name: "Finance", icon: "DollarSign", count: 325 },
  { name: "Technology", icon: "Monitor", count: 435 },
  { name: "Engineering", icon: "Code", count: 542 },
  { name: "Business", icon: "Briefcase", count: 211 },
  { name: "Human Resource", icon: "Users", count: 346 },
];

export const companies = ["vodafone", "intel", "TESLA", "AMD", "Talkit"];

export const jobs: Job[] = [
  {
    id: "1",
    title: "Email Marketing",
    company: "Revolut",
    companyLogo: "R",
    location: "Madrid, Spain",
    category: "Marketing",
    type: "Full Time",
    description: "Revolut is looking for Email Marketing to help team manage a large number of marketing campaigns and deliver high quality results.",
    tags: ["Marketing", "Design"],
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Brand Designer",
    company: "Dropbox",
    companyLogo: "D",
    location: "San Francisco, US",
    category: "Design",
    type: "Full Time",
    description: "Dropbox is looking for Brand Designer to help the team create beautiful and consistent brand experiences across all platforms.",
    tags: ["Design", "Business"],
    createdAt: "2024-01-14",
  },
  {
    id: "3",
    title: "Email Marketing",
    company: "Pitch",
    companyLogo: "P",
    location: "Berlin, Germany",
    category: "Marketing",
    type: "Full Time",
    description: "Pitch is looking for Customer Manager to join marketing team and help deliver exceptional customer experiences.",
    tags: ["Marketing"],
    createdAt: "2024-01-13",
  },
  {
    id: "4",
    title: "Visual Designer",
    company: "Blinklist",
    companyLogo: "B",
    location: "Granada, Spain",
    category: "Design",
    type: "Full Time",
    description: "Blinklist is looking for Visual Designer to help team design beautiful user interfaces and experiences.",
    tags: ["Design"],
    createdAt: "2024-01-12",
  },
  {
    id: "5",
    title: "Product Designer",
    company: "ClassPass",
    companyLogo: "C",
    location: "Manchester, UK",
    category: "Design",
    type: "Full Time",
    description: "ClassPass is looking for Product Designer to help us create amazing fitness and wellness experiences.",
    tags: ["Marketing", "Design"],
    createdAt: "2024-01-11",
  },
  {
    id: "6",
    title: "Lead Designer",
    company: "Canva",
    companyLogo: "Ca",
    location: "Ontario, Canada",
    category: "Design",
    type: "Full Time",
    description: "Canva is looking for Lead Engineer to help develop next generation design tools.",
    tags: ["Design", "Business"],
    createdAt: "2024-01-10",
  },
  {
    id: "7",
    title: "Brand Strategist",
    company: "GoDaddy",
    companyLogo: "G",
    location: "Marseille, France",
    category: "Marketing",
    type: "Full Time",
    description: "GoDaddy is looking for Brand Strategist to join the team and help shape brand identity.",
    tags: ["Marketing"],
    createdAt: "2024-01-09",
  },
  {
    id: "8",
    title: "Data Analyst",
    company: "Twitter",
    companyLogo: "T",
    location: "San Diego, US",
    category: "Technology",
    type: "Full Time",
    description: "Twitter is looking for Data Analyst to help team develop data-driven insights and strategies.",
    tags: ["Technology"],
    createdAt: "2024-01-08",
  },
  {
    id: "9",
    title: "Social Media Assistant",
    company: "Nomad",
    companyLogo: "N",
    location: "Paris, France",
    category: "Marketing",
    type: "Full Time",
    description: "Nomad is looking for a Social Media Assistant to manage social media channels and create engaging content.",
    tags: ["Marketing", "Design"],
    createdAt: "2024-01-07",
  },
  {
    id: "10",
    title: "Social Media Assistant",
    company: "Netlify",
    companyLogo: "Ne",
    location: "Paris, France",
    category: "Marketing",
    type: "Full Time",
    description: "Netlify is looking for a Social Media Assistant to help grow their online presence.",
    tags: ["Marketing", "Design"],
    createdAt: "2024-01-06",
  },
  {
    id: "11",
    title: "Brand Designer",
    company: "Dropbox",
    companyLogo: "D",
    location: "San Francisco, USA",
    category: "Design",
    type: "Full Time",
    description: "Dropbox is looking for a Brand Designer to create stunning visual content.",
    tags: ["Marketing", "Design"],
    createdAt: "2024-01-05",
  },
  {
    id: "12",
    title: "Brand Designer",
    company: "Maze",
    companyLogo: "M",
    location: "San Francisco, USA",
    category: "Design",
    type: "Full Time",
    description: "Maze is looking for a Brand Designer to enhance product design.",
    tags: ["Marketing", "Design"],
    createdAt: "2024-01-04",
  },
  {
    id: "13",
    title: "Interactive Developer",
    company: "Terraform",
    companyLogo: "Tf",
    location: "Hamburg, Germany",
    category: "Engineering",
    type: "Full Time",
    description: "Terraform is looking for an Interactive Developer to build engaging web experiences.",
    tags: ["Marketing", "Design"],
    createdAt: "2024-01-03",
  },
  {
    id: "14",
    title: "Interactive Developer",
    company: "Udacity",
    companyLogo: "U",
    location: "Hamburg, Germany",
    category: "Engineering",
    type: "Full Time",
    description: "Udacity is looking for an Interactive Developer to create learning experiences.",
    tags: ["Marketing", "Design"],
    createdAt: "2024-01-02",
  },
  {
    id: "15",
    title: "HR Manager",
    company: "Packer",
    companyLogo: "Pk",
    location: "Lucern, Switzerland",
    category: "Human Resource",
    type: "Full Time",
    description: "Packer is looking for an HR Manager to lead people operations.",
    tags: ["Marketing", "Design"],
    createdAt: "2024-01-01",
  },
  {
    id: "16",
    title: "HR Manager",
    company: "Webflow",
    companyLogo: "W",
    location: "Lucern, Switzerland",
    category: "Human Resource",
    type: "Full Time",
    description: "Webflow is looking for an HR Manager to build company culture.",
    tags: ["Marketing", "Design"],
    createdAt: "2023-12-31",
  },
];
