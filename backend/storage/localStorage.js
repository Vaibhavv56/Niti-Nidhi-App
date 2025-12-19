const fs = require('fs').promises;
const path = require('path');


// Storage directory
const STORAGE_DIR = path.join(__dirname, '..', 'data');
const COMPLAINTS_FILE = path.join(STORAGE_DIR, 'complaints.json');
const APPLICATIONS_FILE = path.join(STORAGE_DIR, 'applications.json');
const NEWS_FILE = path.join(STORAGE_DIR, 'news.json');
const EMPLOYMENT_FILE = path.join(STORAGE_DIR, 'employment.json');

// Ensure storage directory exists
async function ensureStorageDir() {
  try {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating storage directory:', error);
  }
}

// Initialize storage files
async function initStorage() {
  try {
    await ensureStorageDir();
    
    // Initialize complaints file
    try {
      await fs.access(COMPLAINTS_FILE);
    } catch {
      await fs.writeFile(COMPLAINTS_FILE, JSON.stringify([]), 'utf8');
      console.log('✅ Initialized complaints storage file');
    }
    
    // Initialize applications file
    try {
      await fs.access(APPLICATIONS_FILE);
    } catch {
      await fs.writeFile(APPLICATIONS_FILE, JSON.stringify([]), 'utf8');
      console.log('✅ Initialized applications storage file');
    }
    
    // Initialize news file
    try {
      await fs.access(NEWS_FILE);
    } catch {
      await fs.writeFile(NEWS_FILE, JSON.stringify([]), 'utf8');
      console.log('✅ Initialized news storage file');
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }

  try {
  await fs.access(EMPLOYMENT_FILE);
} catch {
  await fs.writeFile(EMPLOYMENT_FILE, JSON.stringify([]), 'utf8');
  console.log('✅ Initialized employment storage file');
}
}

// ============ COMPLAINTS FUNCTIONS ============

async function readComplaints() {
  try {
    const data = await fs.readFile(COMPLAINTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading complaints:', error);
    return [];
  }
}

async function writeComplaints(complaints) {
  try {
    await fs.writeFile(COMPLAINTS_FILE, JSON.stringify(complaints, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing complaints:', error);
    throw error;
  }
}

async function addComplaint(complaintData) {
  try {
    const complaints = await readComplaints();
    
    const newComplaint = {
      _id: `CMP${Date.now()}${Math.floor(Math.random() * 1000)}`,
      ...complaintData,
      createdAt: complaintData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    complaints.push(newComplaint);
    await writeComplaints(complaints);

    console.log('✅ Complaint added:', newComplaint._id);
    return newComplaint;
  } catch (error) {
    console.error('Error adding complaint:', error);
    throw error;
  }
}

async function getComplaints(userId = null) {
  try {
    const complaints = await readComplaints();
    
    if (userId === null) {
      return complaints;
    }
    
    return complaints.filter(c => c.userId === userId);
  } catch (error) {
    console.error('Error getting complaints:', error);
    return [];
  }
}

async function getComplaintById(id) {
  try {
    const complaints = await readComplaints();
    return complaints.find(c => c._id === id);
  } catch (error) {
    console.error('Error getting complaint:', error);
    return null;
  }
}

async function updateComplaint(id, updates) {
  try {
    const complaints = await readComplaints();
    const index = complaints.findIndex(c => c._id === id);
    
    if (index === -1) {
      throw new Error('Complaint not found');
    }

    complaints[index] = {
      ...complaints[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await writeComplaints(complaints);
    console.log('✅ Complaint updated:', id);
    return complaints[index];
  } catch (error) {
    console.error('Error updating complaint:', error);
    throw error;
  }
}

async function deleteComplaint(id) {
  try {
    const complaints = await readComplaints();
    const filtered = complaints.filter(c => c._id !== id);
    
    if (filtered.length === complaints.length) {
      throw new Error('Complaint not found');
    }

    await writeComplaints(filtered);
    console.log('✅ Complaint deleted:', id);
    return true;
  } catch (error) {
    console.error('Error deleting complaint:', error);
    throw error;
  }
}
// ============ EMPLOYMENT OPPORTUNITIES FUNCTIONS ============

async function readEmploymentOpportunities() {
  try {
    const data = await fs.readFile(EMPLOYMENT_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading employment opportunities:', error);
    return [];
  }
}

async function writeEmploymentOpportunities(opportunities) {
  try {
    await fs.writeFile(EMPLOYMENT_FILE, JSON.stringify(opportunities, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing employment opportunities:', error);
    throw error;
  }
}

async function addEmploymentOpportunity(opportunityData) {
  try {
    const opportunities = await readEmploymentOpportunities();
    
    const newOpportunity = {
      _id: `EMP${Date.now()}${Math.floor(Math.random() * 1000)}`,
      ...opportunityData,
      postedAt: opportunityData.postedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    opportunities.push(newOpportunity);
    await writeEmploymentOpportunities(opportunities);

    console.log('✅ Employment opportunity added:', newOpportunity._id);
    return newOpportunity;
  } catch (error) {
    console.error('Error adding employment opportunity:', error);
    throw error;
  }
}

async function getEmploymentOpportunities() {
  try {
    const opportunities = await readEmploymentOpportunities();
    return opportunities;
  } catch (error) {
    console.error('Error getting employment opportunities:', error);
    return [];
  }
}

async function getEmploymentOpportunityById(id) {
  try {
    const opportunities = await readEmploymentOpportunities();
    return opportunities.find(opp => opp._id === id);
  } catch (error) {
    console.error('Error getting employment opportunity:', error);
    return null;
  }
}

async function updateEmploymentOpportunity(id, updates) {
  try {
    const opportunities = await readEmploymentOpportunities();
    const index = opportunities.findIndex(opp => opp._id === id);
    
    if (index === -1) {
      throw new Error('Employment opportunity not found');
    }

    opportunities[index] = {
      ...opportunities[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await writeEmploymentOpportunities(opportunities);
    console.log('✅ Employment opportunity updated:', id);
    return opportunities[index];
  } catch (error) {
    console.error('Error updating employment opportunity:', error);
    throw error;
  }
}

async function deleteEmploymentOpportunity(id) {
  try {
    const opportunities = await readEmploymentOpportunities();
    const filtered = opportunities.filter(opp => opp._id !== id);
    
    if (filtered.length === opportunities.length) {
      throw new Error('Employment opportunity not found');
    }

    await writeEmploymentOpportunities(filtered);
    console.log('✅ Employment opportunity deleted:', id);
    return true;
  } catch (error) {
    console.error('Error deleting employment opportunity:', error);
    throw error;
  }
}
// ============ APPLICATIONS FUNCTIONS ============

async function readApplications() {
  try {
    const data = await fs.readFile(APPLICATIONS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading applications:', error);
    return [];
  }
}

async function writeApplications(applications) {
  try {
    await fs.writeFile(APPLICATIONS_FILE, JSON.stringify(applications, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing applications:', error);
    throw error;
  }
}

async function addApplication(applicationData) {
  try {
    const applications = await readApplications();
    
    const newApplication = {
      _id: applicationData.applicationId || `APP${Date.now()}${Math.floor(Math.random() * 1000)}`,
      ...applicationData,
      submittedAt: applicationData.submittedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    applications.push(newApplication);
    await writeApplications(applications);

    console.log('✅ Application added:', newApplication._id);
    return newApplication;
  } catch (error) {
    console.error('Error adding application:', error);
    throw error;
  }
}

async function getApplications(userId = null) {
  try {
    const applications = await readApplications();
    
    if (userId === null) {
      return applications;
    }
    
    return applications.filter(app => app.userId === userId);
  } catch (error) {
    console.error('Error getting applications:', error);
    return [];
  }
}

async function getApplicationById(id) {
  try {
    const applications = await readApplications();
    return applications.find(app => app._id === id || app.applicationId === id);
  } catch (error) {
    console.error('Error getting application:', error);
    return null;
  }
}

async function updateApplication(id, updates) {
  try {
    const applications = await readApplications();
    const index = applications.findIndex(app => app._id === id || app.applicationId === id);
    
    if (index === -1) {
      throw new Error('Application not found');
    }

    applications[index] = {
      ...applications[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await writeApplications(applications);
    console.log('✅ Application updated:', id);
    return applications[index];
  } catch (error) {
    console.error('Error updating application:', error);
    throw error;
  }
}

async function deleteApplication(id) {
  try {
    const applications = await readApplications();
    const filtered = applications.filter(app => app._id !== id && app.applicationId !== id);
    
    if (filtered.length === applications.length) {
      throw new Error('Application not found');
    }

    await writeApplications(filtered);
    console.log('✅ Application deleted:', id);
    return true;
  } catch (error) {
    console.error('Error deleting application:', error);
    throw error;
  }
}

// ============ NEWS FUNCTIONS ============

async function readNews() {
  try {
    const data = await fs.readFile(NEWS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading news:', error);
    return [];
  }
}

async function writeNews(news) {
  try {
    await fs.writeFile(NEWS_FILE, JSON.stringify(news, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing news:', error);
    throw error;
  }
}

async function addNews(newsData) {
  try {
    const news = await readNews();
    
    const newNews = {
      _id: `NEWS${Date.now()}${Math.floor(Math.random() * 1000)}`,
      ...newsData,
      publishedAt: newsData.publishedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    news.push(newNews);
    await writeNews(news);

    console.log('✅ News added:', newNews._id);
    return newNews;
  } catch (error) {
    console.error('Error adding news:', error);
    throw error;
  }
}

async function getNews() {
  try {
    const news = await readNews();
    return news;
  } catch (error) {
    console.error('Error getting news:', error);
    return [];
  }
}

async function getNewsById(id) {
  try {
    const news = await readNews();
    return news.find(n => n._id === id);
  } catch (error) {
    console.error('Error getting news:', error);
    return null;
  }
}

async function updateNews(id, updates) {
  try {
    const news = await readNews();
    const index = news.findIndex(n => n._id === id);
    
    if (index === -1) {
      throw new Error('News not found');
    }

    news[index] = {
      ...news[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await writeNews(news);
    console.log('✅ News updated:', id);
    return news[index];
  } catch (error) {
    console.error('Error updating news:', error);
    throw error;
  }
}

async function deleteNews(id) {
  try {
    const news = await readNews();
    const filtered = news.filter(n => n._id !== id);
    
    if (filtered.length === news.length) {
      throw new Error('News not found');
    }

    await writeNews(filtered);
    console.log('✅ News deleted:', id);
    return true;
  } catch (error) {
    console.error('Error deleting news:', error);
    throw error;
  }
}

// Initialize storage on module load
initStorage();

module.exports = {
  // Complaints
  addComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  
  // Applications
  addApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  
  // News
  addNews,
  getNews,
  getNewsById,
  updateNews,
  deleteNews,

  // Employment Opportunities
  addEmploymentOpportunity,
  getEmploymentOpportunities,
  getEmploymentOpportunityById,
  updateEmploymentOpportunity,
  deleteEmploymentOpportunity,
};