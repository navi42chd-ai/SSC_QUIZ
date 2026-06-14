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
        label: "Ancient India — Stone Age & IVC",
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
  }
];
