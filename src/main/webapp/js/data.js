const initialEvents = [
  {
    id: "1",
    title: "TechFest 2026 - Annual Hackathon",
    club: "Computer Science Club",
    date: "2026-04-15",
    time: "09:00",
    location: "Main Auditorium",
    attendees: 150,
    type: "inter-college",
    category: "Technical"
  },
  {
    id: "2",
    title: "Cultural Night - Spring Festival",
    club: "Cultural Committee",
    date: "2026-04-20",
    time: "18:00",
    location: "Open Air Theatre",
    attendees: 500,
    type: "intra-college",
    category: "Cultural"
  },
  {
    id: "3",
    title: "National Debate Championship",
    club: "Debate Society",
    date: "2026-04-25",
    time: "10:00",
    location: "Seminar Hall A",
    attendees: 80,
    type: "inter-college",
    category: "Literary"
  },
  {
    id: "4",
    title: "Robotics Workshop",
    club: "Robotics Club",
    date: "2026-04-18",
    time: "14:00",
    location: "Electronics Lab",
    attendees: 40,
    type: "intra-college",
    category: "Technical"
  },
  {
    id: "5",
    title: "Photography Exhibition",
    club: "Photography Club",
    date: "2026-04-22",
    time: "11:00",
    location: "Art Gallery",
    attendees: 200,
    type: "inter-college",
    category: "Arts"
  },
  {
    id: "6",
    title: "Inter-Department Cricket Tournament",
    club: "Sports Committee",
    date: "2026-04-28",
    time: "08:00",
    location: "College Ground",
    attendees: 300,
    type: "intra-college",
    category: "Sports"
  },
  {
    id: "7",
    title: "Startup Pitch Competition",
    club: "Entrepreneurship Cell",
    date: "2026-05-02",
    time: "10:00",
    location: "Conference Hall",
    attendees: 120,
    type: "inter-college",
    category: "Business"
  },
  {
    id: "8",
    title: "Music Jam Session",
    club: "Music Club",
    date: "2026-05-05",
    time: "17:00",
    location: "Amphitheatre",
    attendees: 250,
    type: "intra-college",
    category: "Cultural"
  }
];

const categories = [
  "Technical",
  "Cultural",
  "Literary",
  "Sports",
  "Arts",
  "Business"
];

const initialClubs = [
  {
    id: "ccc",
    name: "CCC",
    fullName: "Computer Coding Club",
    description: "The primary coding club focused on competitive programming, logic building, and open-source contributions."
  },
  {
    id: "gdgoc",
    name: "GDGOC",
    fullName: "Google Developer Groups on Campus",
    description: "A Google-backed student community aimed at bridging the gap between theory and practice using Google technologies."
  },
  {
    id: "switch",
    name: "Switch",
    fullName: "Switch Hardware Club",
    description: "The definitive club for internet of things, networking, and hardcore hardware engineering."
  },
  {
    id: "ed-cell",
    name: "Ed Cell",
    fullName: "Entrepreneurship Development Cell",
    description: "Fostering the entrepreneurial spirit among students, supporting startup incubation and investor networking."
  },
  {
    id: "spc",
    name: "SPC",
    fullName: "Student Placement Cell",
    description: "The bridge between academics and professional careers, organizing recruitment drives."
  },
  {
    id: "css",
    name: "CSS",
    fullName: "Computer Science Society",
    description: "Empowering CS students with seminars, advanced algorithmic workshops, and academic mentorship."
  },
  {
    id: "ieee",
    name: "IEEE",
    fullName: "IEEE Student Branch",
    description: "Driving global technological advancements and maintaining professional electrical and electronic standards."
  },
  {
    id: "achievers",
    name: "Achievers",
    fullName: "Achievers Club",
    description: "Celebrating and developing all-rounded extracurricular excellence, public speaking, and leadership."
  }
];

if (!localStorage.getItem('eventhub_events')) {
    localStorage.setItem('eventhub_events', JSON.stringify(initialEvents));
}
if (!localStorage.getItem('eventhub_clubs')) {
    localStorage.setItem('eventhub_clubs', JSON.stringify(initialClubs));
}

const events = JSON.parse(localStorage.getItem('eventhub_events'));
const clubs = JSON.parse(localStorage.getItem('eventhub_clubs'));

function saveNewEvent(newEvent) {
    const currentEvents = JSON.parse(localStorage.getItem('eventhub_events'));
    currentEvents.push(newEvent);
    localStorage.setItem('eventhub_events', JSON.stringify(currentEvents));
}
