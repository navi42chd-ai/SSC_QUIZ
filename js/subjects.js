// SUBJECTS REGISTRY
// To add a new subject: add an entry here and create a folder under data/
// To add a new chapter: add to the chapters array and create the JS file

const SUBJECTS = [
  {
    id: "history",
    label: "History",
    icon: "🏛️",
    color: "#185FA5",
    colorLight: "#E6F1FB",
    chapters: [
      {
        id: "ancient-india",
        label: "Ancient India",
        file: "data/history/ancient-india.js",
        dataVar: "chapter_ancient_india"
      },
      {
        id: "medieval-india",
        label: "Medieval India",
        file: "data/history/medieval-india.js",
        dataVar: "chapter_medieval_india"
      },
      {
        id: "modern-india",
        label: "Modern India",
        file: "data/history/modern-india.js",
        dataVar: "chapter_modern_india"
      }
    ]
  },
  {
    id: "geography",
    label: "Geography",
    icon: "🗺️",
    color: "#0F6E56",
    colorLight: "#E1F5EE",
    chapters: [
      {
        id: "physical-geography",
        label: "Physical Geography",
        file: "data/geography/physical-geography.js",
        dataVar: "chapter_physical_geography"
      },
      {
        id: "indian-climate",
        label: "Indian Climate",
        file: "data/geography/indian-climate.js",
        dataVar: "chapter_indian_climate"
      }
    ]
  },
  {
    id: "polity",
    label: "Polity",
    icon: "⚖️",
    color: "#534AB7",
    colorLight: "#EEEDFE",
    chapters: [
      {
        id: "constitution",
        label: "Constitution",
        file: "data/polity/constitution.js",
        dataVar: "chapter_constitution"
      },
      {
        id: "parliament",
        label: "Parliament",
        file: "data/polity/parliament.js",
        dataVar: "chapter_parliament"
      }
    ]
  },
  {
    id: "static-gk",
    label: "Static GK",
    icon: "🎭",
    color: "#B5451B",
    colorLight: "#FDEEE8",
    chapters: [
      {
        id: "dance",
        label: "Dance",
        file: "data/static-gk/dance.js",
        dataVar: "chapter_dance"
      },
      {
        id: "arts-personality",
        label: "Arts Personality",
        file: "data/static-gk/arts-personality.js",
        dataVar: "chapter_arts_personality"
      },
      {
        id: "arts-awards",
        label: "Arts Awards",
        file: "data/static-gk/arts-awards.js",
        dataVar: "chapter_arts_awards"
      },
      {
        id: "musical-instruments",
        label: "Musical Instruments",
        file: "data/static-gk/musical-instruments.js",
        dataVar: "chapter_musical_instruments"
      },
      {
        id: "festivals",
        label: "Festivals",
        file: "data/static-gk/festivals.js",
        dataVar: "chapter_festivals"
      }
    ]
  }
];
