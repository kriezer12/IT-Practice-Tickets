export type CheatsheetMethodStep = {
  number: string;
  title: string;
  description: string;
};

export type HardwareTriageRow = {
  problem: string;
  causes: string;
  check: string;
};

export type CheatsheetTopic = {
  id: string;
  number: string;
  label: string;
};

export type KeyValueNote = {
  label: string;
  detail: string;
};

export type PortNote = {
  port: string;
  service: string;
  use: string;
};

export type CommandNote = {
  command: string;
  purpose: string;
};

export type QuickFireScenario = {
  scenario: string;
  direction: string;
};

export const CHEATSHEET_TOPICS: CheatsheetTopic[] = [
  { id: 'methodology', number: '01', label: 'Troubleshooting method' },
  { id: 'hardware', number: '02', label: 'Hardware + OS' },
  { id: 'networking', number: '03', label: 'Networking' },
  { id: 'active-directory', number: '04', label: 'Active Directory' },
  { id: 'security', number: '05', label: 'Security basics' },
  { id: 'customer-service', number: '06', label: 'Customer service' },
  { id: 'quick-fire', number: '07', label: 'Quick-fire scenarios' },
];

export const TROUBLESHOOTING_METHOD: CheatsheetMethodStep[] = [
  { number: '01', title: 'Identify the problem', description: 'Ask what changed, when it started, and what error appears.' },
  { number: '02', title: 'Establish a theory', description: 'Start with the simplest and most common probable cause.' },
  { number: '03', title: 'Test the theory', description: 'Isolate variables across another account, machine, or network.' },
  { number: '04', title: 'Plan the action', description: 'Choose the fix and keep a backup plan ready.' },
  { number: '05', title: 'Implement the fix', description: 'Make the smallest change that addresses the evidence.' },
  { number: '06', title: 'Verify the system', description: 'Confirm the symptom is gone and nothing else broke.' },
  { number: '07', title: 'Document the solution', description: 'Leave the ticket and the next technician a clear trail.' },
];

export const HARDWARE_TRIAGE: HardwareTriageRow[] = [
  { problem: "PC won't POST / no display", causes: 'RAM seating, PSU, loose GPU, dead CMOS battery', check: 'Reseat RAM, check power cables, listen for beep codes.' },
  { problem: 'Blue Screen of Death (BSOD)', causes: 'Driver conflict, faulty RAM, overheating, corrupted system files', check: 'Note the stop code, check Event Viewer, run sfc /scannow, memtest.' },
  { problem: 'Slow boot / slow performance', causes: 'Startup apps, failing HDD, malware, low disk space', check: 'Task Manager → Startup, disk health (chkdsk), Disk Cleanup.' },
  { problem: "Printer won't print", causes: 'Spooler stuck, wrong default, driver mismatch, offline status', check: 'Restart Print Spooler, check the queue, reinstall the driver.' },
  { problem: 'No internet but Wi-Fi connected', causes: 'DNS issue, IP conflict, driver issue, router problem', check: 'ipconfig /all; ping 8.8.8.8 vs ping google.com to separate connectivity from DNS.' },
  { problem: 'Limited connectivity', causes: 'DHCP failure, APIPA address (169.254.x.x)', check: 'ipconfig /release then /renew; check the DHCP scope.' },
];

export const OSI_LAYERS: KeyValueNote[] = [
  { label: '07 / Application', detail: 'HTTP, FTP, DNS — the actual apps and services.' },
  { label: '06 / Presentation', detail: 'Encryption and formatting.' },
  { label: '05 / Session', detail: 'Connection management.' },
  { label: '04 / Transport', detail: 'TCP/UDP and ports.' },
  { label: '03 / Network', detail: 'IP addresses and routers.' },
  { label: '02 / Data Link', detail: 'MAC addresses and switches.' },
  { label: '01 / Physical', detail: 'Cables, hubs, and signals.' },
];

export const NETWORKING_CONCEPTS: KeyValueNote[] = [
  { label: 'DHCP', detail: 'Automatically assigns IP addresses.' },
  { label: 'DNS', detail: 'Translates domain names to IP addresses; often AD-integrated.' },
  { label: 'Subnetting', detail: 'A /24 (255.255.255.0) provides 254 usable hosts.' },
  { label: 'Public vs private IP', detail: 'Private ranges include 10.x.x.x, 172.16–31.x.x, and 192.168.x.x.' },
  { label: 'TCP vs UDP', detail: 'TCP is reliable and connection-based; UDP is fast and connectionless.' },
];

export const COMMON_PORTS: PortNote[] = [
  { port: '80', service: 'HTTP', use: 'Web traffic' },
  { port: '443', service: 'HTTPS', use: 'Encrypted web traffic' },
  { port: '53', service: 'DNS', use: 'Name resolution' },
  { port: '25', service: 'SMTP', use: 'Email transfer' },
  { port: '3389', service: 'RDP', use: 'Remote desktop' },
  { port: '22', service: 'SSH', use: 'Secure shell' },
  { port: '445', service: 'SMB', use: 'Windows file sharing' },
];

export const DIAGNOSTIC_COMMANDS: CommandNote[] = [
  { command: 'ping', purpose: 'Basic reachability test.' },
  { command: 'tracert / traceroute', purpose: 'Shows the path and hops to a destination.' },
  { command: 'ipconfig /all', purpose: 'Shows Windows IP configuration. Linux: ifconfig / ip a.' },
  { command: 'nslookup', purpose: 'Tests DNS resolution.' },
  { command: 'netstat -an', purpose: 'Shows active connections and listening ports.' },
];

export const ACTIVE_DIRECTORY_TERMS: KeyValueNote[] = [
  { label: 'Domain Controller', detail: 'A server holding AD DS that authenticates logins and manages security policy.' },
  { label: 'OU / Organizational Unit', detail: 'A container for organizing users, computers, and groups for delegated administration and GPO targeting.' },
  { label: 'Security vs Distribution Group', detail: 'Security groups grant permissions; distribution groups are for email lists.' },
  { label: 'GPO / Group Policy Object', detail: 'Centrally pushes settings and restrictions; it applies at Site > Domain > OU level (SDOU).' },
  { label: 'DHCP scope', detail: 'The defined IP range a DHCP server can lease from.' },
  { label: 'SYSVOL', detail: 'A replicated folder holding GPO templates and logon scripts across domain controllers.' },
];

export const ACTIVE_DIRECTORY_COMMANDS: CommandNote[] = [
  { command: 'gpresult /r', purpose: 'See which policies applied.' },
  { command: 'gpupdate /force', purpose: 'Force a Group Policy refresh.' },
  { command: 'dcdiag', purpose: 'Health-check a domain controller.' },
  { command: 'repadmin', purpose: 'Check Active Directory replication.' },
];

export const DOMAIN_LOGIN_STEPS: string[] = [
  'Confirm it is not a typo or Caps Lock issue.',
  'Check whether the account is locked out in Active Directory Users and Computers.',
  'Verify that the PC has network connectivity to the domain controller.',
  'Check time sync; Kerberos fails when client and DC clocks drift by more than five minutes.',
  'Check for a broken trust relationship; the PC may need to rejoin the domain.',
];

export const SECURITY_BASICS: KeyValueNote[] = [
  { label: 'Phishing', detail: 'Recognize urgency, mismatched sender domains, and suspicious links; report or quarantine, do not just delete.' },
  { label: 'Least privilege', detail: 'Users and accounts should have only the access they need.' },
  { label: 'MFA', detail: 'Use more than one factor: something you know plus something you have or are.' },
  { label: 'Patch management', detail: 'Timely OS and software updates reduce exposure to known vulnerabilities.' },
  { label: 'Ransomware response', detail: "Isolate the machine immediately, do not negotiate yourself, and escalate." },
];

export const CUSTOMER_SERVICE_PROMPTS: string[] = [
  'Tell me about a time you dealt with a frustrated or angry user.',
  'Describe a time you explained something technical to a non-technical person.',
  "Tell me about a time you couldn't solve a problem — what did you do?",
  'How do you prioritize multiple tickets at once?',
];

export const CUSTOMER_SERVICE_TIPS: string[] = [
  'Listen first, then diagnose — do not jump straight to “did you restart it?”',
  'Document and follow up; do not just fix and forget.',
  "When escalating, hand off the useful facts so the next tier does not spend time starting over.",
];

export const QUICK_FIRE_SCENARIOS: QuickFireScenario[] = [
  { scenario: 'The internet is down, but it is really just one website.', direction: 'Isolate: ping the site, ping another site, check DNS, and see if it is down for everyone.' },
  { scenario: 'A shared printer works for some users but not others.', direction: 'Look at permissions, drivers, and GPO deployment status before blaming the network.' },
  { scenario: 'A laptop connects to Wi-Fi poorly but works wired.', direction: 'Narrow to wireless: driver, saved network profile, security type, or MAC filtering.' },
  { scenario: 'A GPO setting is not applying to a user.', direction: 'Check gpresult /r for filtering or denial, OU/group placement, and higher-priority overrides.' },
  { scenario: 'How do you stay current in IT?', direction: 'Mention hands-on lab work, your VMware AD lab, CCNA/NetAcad work, and release notes or security bulletins.' },
];

export const LAB_TALKING_POINT = 'You built and debugged an AD lab with DNS, DHCP, GPOs, and printer deployment. Mention the real GPO application failures you troubleshot — that is stronger than reciting textbook knowledge.';
