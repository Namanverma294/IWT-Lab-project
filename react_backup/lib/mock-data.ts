export interface Event {
  id: string
  title: string
  description: string
  club: string
  date: string
  time: string
  location: string
  attendees: number
  type: "inter-college" | "intra-college"
  category: string
  coordinator: {
    name: string
    email: string
    phone: string
  }
  registrationDeadline: string
  maxParticipants: number
  rules: string[]
  prizes: string[]
  requirements: string[]
}

export const events: Event[] = [
  {
    id: "1",
    title: "TechFest 2026 - Annual Hackathon",
    description: "Join us for a 24-hour coding marathon where teams compete to build innovative solutions to real-world problems. This year's theme focuses on sustainable technology and green computing solutions.",
    club: "Computer Science Club",
    date: "April 15, 2026",
    time: "9:00 AM - 9:00 PM",
    location: "Main Auditorium",
    attendees: 150,
    type: "inter-college",
    category: "Technical",
    coordinator: {
      name: "Arjun Patel",
      email: "arjun.p@college.edu",
      phone: "+91 98765 43210"
    },
    registrationDeadline: "April 10, 2026",
    maxParticipants: 200,
    rules: [
      "Teams of 2-4 members allowed",
      "All code must be written during the event",
      "External APIs and libraries permitted",
      "Judging based on innovation, feasibility, and presentation"
    ],
    prizes: [
      "1st Place: Rs. 50,000 + Internship Opportunities",
      "2nd Place: Rs. 30,000 + Gadgets",
      "3rd Place: Rs. 15,000 + Swag Kit"
    ],
    requirements: [
      "Valid college ID",
      "Laptop with required development tools",
      "GitHub account"
    ]
  },
  {
    id: "2",
    title: "Cultural Night - Spring Festival",
    description: "An evening of dance, music, and drama performances showcasing the diverse cultural heritage of our students. Experience traditional and contemporary performances from various regions.",
    club: "Cultural Committee",
    date: "April 20, 2026",
    time: "6:00 PM - 10:00 PM",
    location: "Open Air Theatre",
    attendees: 500,
    type: "intra-college",
    category: "Cultural",
    coordinator: {
      name: "Priya Sharma",
      email: "priya.s@college.edu",
      phone: "+91 87654 32109"
    },
    registrationDeadline: "April 15, 2026",
    maxParticipants: 1000,
    rules: [
      "Performance duration: 5-10 minutes",
      "Content must be appropriate for all audiences",
      "Props and costumes to be arranged by participants",
      "Background music to be submitted 2 days prior"
    ],
    prizes: [
      "Best Performance: Trophy + Rs. 10,000",
      "Best Costume: Rs. 5,000",
      "Audience Choice Award: Rs. 5,000"
    ],
    requirements: [
      "Valid student ID",
      "Registration form",
      "Performance description"
    ]
  },
  {
    id: "3",
    title: "National Debate Championship",
    description: "Compete with the best debaters from colleges across the nation. This year's topics cover current affairs, technology ethics, and social issues.",
    club: "Debate Society",
    date: "April 25, 2026",
    time: "10:00 AM - 6:00 PM",
    location: "Seminar Hall A",
    attendees: 80,
    type: "inter-college",
    category: "Literary",
    coordinator: {
      name: "Rahul Verma",
      email: "rahul.v@college.edu",
      phone: "+91 76543 21098"
    },
    registrationDeadline: "April 20, 2026",
    maxParticipants: 100,
    rules: [
      "British Parliamentary format",
      "Teams of 2 debaters",
      "7 minutes speaking time per debater",
      "Topics announced 15 minutes before each round"
    ],
    prizes: [
      "Winners: Rs. 25,000 + Certificates",
      "Runners-up: Rs. 15,000 + Certificates",
      "Best Speaker: Rs. 5,000"
    ],
    requirements: [
      "College authorization letter",
      "Team registration form",
      "Valid ID proof"
    ]
  },
  {
    id: "4",
    title: "Robotics Workshop",
    description: "Learn the fundamentals of robotics, from basic electronics to programming autonomous robots. Hands-on sessions with industry experts.",
    club: "Robotics Club",
    date: "April 18, 2026",
    time: "2:00 PM - 5:00 PM",
    location: "Electronics Lab",
    attendees: 40,
    type: "intra-college",
    category: "Technical",
    coordinator: {
      name: "Sneha Kumar",
      email: "sneha.k@college.edu",
      phone: "+91 65432 10987"
    },
    registrationDeadline: "April 16, 2026",
    maxParticipants: 50,
    rules: [
      "Prior registration mandatory",
      "Basic programming knowledge preferred",
      "Materials will be provided",
      "Attendance required for certificate"
    ],
    prizes: [
      "Completion Certificates",
      "Best Project: Robotics Kit",
      "Participation Certificates"
    ],
    requirements: [
      "Laptop (optional)",
      "Valid student ID",
      "Enthusiasm to learn"
    ]
  },
  {
    id: "5",
    title: "Photography Exhibition",
    description: "Showcase your best photographs in our annual exhibition. This year's theme is 'Urban Stories' - capturing life in the city.",
    club: "Photography Club",
    date: "April 22, 2026",
    time: "11:00 AM - 7:00 PM",
    location: "Art Gallery",
    attendees: 200,
    type: "inter-college",
    category: "Arts",
    coordinator: {
      name: "Karan Malhotra",
      email: "karan.m@college.edu",
      phone: "+91 54321 09876"
    },
    registrationDeadline: "April 18, 2026",
    maxParticipants: 100,
    rules: [
      "Maximum 3 entries per participant",
      "Original work only",
      "Basic editing allowed",
      "Theme: Urban Stories"
    ],
    prizes: [
      "Best Photograph: Rs. 15,000 + Camera Gear",
      "2nd Place: Rs. 10,000",
      "3rd Place: Rs. 5,000"
    ],
    requirements: [
      "High-resolution images (minimum 300 DPI)",
      "Brief description of each photograph",
      "Consent form for exhibition"
    ]
  },
  {
    id: "6",
    title: "Inter-Department Cricket Tournament",
    description: "Annual cricket tournament between departments. Join your department team and compete for the championship trophy.",
    club: "Sports Committee",
    date: "April 28-30, 2026",
    time: "8:00 AM - 6:00 PM",
    location: "College Ground",
    attendees: 300,
    type: "intra-college",
    category: "Sports",
    coordinator: {
      name: "Vikram Singh",
      email: "vikram.s@college.edu",
      phone: "+91 43210 98765"
    },
    registrationDeadline: "April 25, 2026",
    maxParticipants: 200,
    rules: [
      "T20 format",
      "Team of 11 players + 4 substitutes",
      "Department-wise registration",
      "ICC rules apply"
    ],
    prizes: [
      "Champions: Trophy + Rs. 20,000",
      "Runners-up: Rs. 10,000",
      "Player of the Tournament: Rs. 5,000"
    ],
    requirements: [
      "Department authorization",
      "Sports uniform",
      "Medical fitness certificate"
    ]
  },
  {
    id: "7",
    title: "Startup Pitch Competition",
    description: "Present your startup idea to a panel of investors and entrepreneurs. Get feedback, mentorship, and potential funding for your venture.",
    club: "Entrepreneurship Cell",
    date: "May 2, 2026",
    time: "10:00 AM - 4:00 PM",
    location: "Conference Hall",
    attendees: 120,
    type: "inter-college",
    category: "Business",
    coordinator: {
      name: "Anjali Gupta",
      email: "anjali.g@college.edu",
      phone: "+91 32109 87654"
    },
    registrationDeadline: "April 28, 2026",
    maxParticipants: 50,
    rules: [
      "5-minute pitch + 3-minute Q&A",
      "Teams of 1-4 members",
      "Business plan submission required",
      "Working prototype preferred"
    ],
    prizes: [
      "Winner: Rs. 1,00,000 seed funding + Incubation",
      "Runner-up: Rs. 50,000 + Mentorship",
      "Best Innovation: Rs. 25,000"
    ],
    requirements: [
      "Detailed business plan",
      "Pitch deck (10 slides max)",
      "Demo video (optional)"
    ]
  },
  {
    id: "8",
    title: "Music Jam Session",
    description: "Open mic session for musicians. Play solo or form impromptu bands. All genres welcome - rock, jazz, classical, fusion.",
    club: "Music Club",
    date: "May 5, 2026",
    time: "5:00 PM - 9:00 PM",
    location: "Amphitheatre",
    attendees: 250,
    type: "intra-college",
    category: "Cultural",
    coordinator: {
      name: "Dev Kapoor",
      email: "dev.k@college.edu",
      phone: "+91 21098 76543"
    },
    registrationDeadline: "May 3, 2026",
    maxParticipants: 50,
    rules: [
      "Performance time: 5-15 minutes",
      "Own instruments preferred",
      "Basic sound equipment provided",
      "Original compositions encouraged"
    ],
    prizes: [
      "Best Performance: Recording Session",
      "Audience Choice: Rs. 5,000",
      "Best Original Composition: Rs. 3,000"
    ],
    requirements: [
      "Musical instruments (if needed)",
      "Track/backing music (USB)",
      "Performance slot registration"
    ]
  }
]

export const categories = [
  "Technical",
  "Cultural",
  "Literary",
  "Sports",
  "Arts",
  "Business"
]

export interface User {
  id: string
  name: string
  email: string
  role: "student" | "hod" | "nr" | "fc" | "oc"
  club?: string
  department?: string
  assignedEvents?: string[]
}

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Student User",
    email: "student@college.edu",
    role: "student",
    department: "Computer Science"
  },
  {
    id: "2",
    name: "Dr. Rajesh Kumar",
    email: "hod.cs@college.edu",
    role: "hod",
    department: "Computer Science"
  },
  {
    id: "3",
    name: "Amit Shah",
    email: "nr.techclub@college.edu",
    role: "nr",
    club: "Computer Science Club"
  },
  {
    id: "4",
    name: "Prof. Meera Joshi",
    email: "fc.cultural@college.edu",
    role: "fc",
    club: "Cultural Committee"
  },
  {
    id: "5",
    name: "Arjun Patel",
    email: "oc.hackathon@college.edu",
    role: "oc",
    club: "Computer Science Club",
    assignedEvents: ["1"]
  }
]
