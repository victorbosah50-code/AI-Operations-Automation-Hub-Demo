// DOM Elements
const emailForm = document.getElementById('email-form');
const emailContent = document.getElementById('email-content');
const logsBody = document.getElementById('logs-body');
const toggleModeBtn = document.getElementById('toggle-mode');
const generateReportBtn = document.getElementById('generate-report');

// Local Storage Key
const LOGS_KEY = 'aiOpsAutomationLogs';

// Load logs from localStorage
let logs = JSON.parse(localStorage.getItem(LOGS_KEY)) || [];
renderLogs();

// Event Listeners
emailForm.addEventListener('submit', handleSubmit);
toggleModeBtn.addEventListener('click', toggleDarkMode);
generateReportBtn.addEventListener('click', generateReport);

// Handle email processing
function handleSubmit(e) {
    e.preventDefault();
    const content = emailContent.value.trim();
    if (!content) return;

    // Simulate AI processing
    const classification = classifyEmail(content);
    const leads = extractLeads(content);
    const priority = determinePriority(content);
    const routedTo = routeTask(classification, priority);

    // Log the result
    const log = {
        timestamp: new Date().toLocaleString(),
        classification,
        leads: leads.join(', ') || 'None',
        priority,
        routedTo
    };
    logs.push(log);
    saveLogs();
    renderLogs();

    // Clear input
    emailContent.value = '';
}

// Render logs in table
function renderLogs() {
    logsBody.innerHTML = '';
    logs.forEach(log => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${log.timestamp}</td>
            <td>${log.classification}</td>
            <td>${log.leads}</td>
            <td>${log.priority}</td>
            <td>${log.routedTo}</td>
        `;
        logsBody.appendChild(row);
    });
}

// Save logs to localStorage
function saveLogs() {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
}

// Toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

// Generate and download report
function generateReport() {
    if (logs.length === 0) {
        alert('No logs to report.');
        return;
    }

    const csvContent = 'data:text/csv;charset=utf-8,' 
        + 'Timestamp,Classification,Leads,Priority,Routed To\n'
        + logs.map(log => `${log.timestamp},${log.classification},${log.leads},${log.priority},${log.routedTo}`).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'ai_ops_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// AI Simulation Functions

// Classify email (keyword-based)
function classifyEmail(content) {
    const lower = content.toLowerCase();
    if (lower.includes('support') || lower.includes('issue') || lower.includes('help')) return 'Support';
    if (lower.includes('sales') || lower.includes('lead') || lower.includes('purchase')) return 'Sales';
    if (lower.includes('feedback')) return 'Feedback';
    return 'General';
}

// Extract leads (regex for emails and phones)
function extractLeads(content) {
    const emailRegex = /[\w\.-]+@[\w\.-]+\.\w+/g;
    const phoneRegex = /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
    const emails = content.match(emailRegex) || [];
    const phones = content.match(phoneRegex) || [];
    return [...new Set([...emails, ...phones])]; // Unique
}

// Determine priority (keyword-based)
function determinePriority(content) {
    const lower = content.toLowerCase();
    if (lower.includes('urgent') || lower.includes('immediate') || lower.includes('asap')) return 'High';
    if (lower.includes('important')) return 'Medium';
    return 'Low';
}

// Route task based on classification and priority
function routeTask(classification, priority) {
    if (priority === 'High') return 'Escalation Team';
    switch (classification) {
        case 'Support': return 'Support Team';
        case 'Sales': return 'Sales Team';
        case 'Feedback': return 'Product Team';
        default: return 'General Inbox';
    }
}
