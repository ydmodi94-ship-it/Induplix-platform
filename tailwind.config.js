// Tailwind CSS configuration for Induplix project
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        "industrial-navy": "#101F35",
        "tech-blue": "#2378C9",
        "steel-grey": "#E9EEF4",
        "white": "#FFFFFF",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
      },
      borderRadius: {
        lg: "0.5rem",
      },
    },
  },
  plugins: [],
};
