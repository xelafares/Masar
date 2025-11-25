/* static/js/roadmap_data.js */

const roadmapData = {
    // --- FRONTEND (Aligned with roadmap.sh image) ---
    "frontend": {
        title: "Frontend Developer (مطور واجهة أمامية)",
        description: "Step-by-step guide to becoming a modern Frontend Developer.",
        categories: ["role"], 
        steps: [
            // 1. Internet
            {
                id: "fe_1",
                title: "Internet Basics (الإنترنت)",
                desc: "How does the internet work? HTTP, Domain Name, Hosting, DNS, and Browsers.",
                resources: [
                    { type: "video", title: "كيف يعمل الإنترنت؟ (Elzero)", url: "https://www.youtube.com/watch?v=s5fP1d_D87A" },
                    { type: "video", title: "شرح الـ HTTP و HTTPS", url: "https://www.youtube.com/watch?v=q6Y-4YhO4gs" },
                    { type: "video", title: "ما هو الـ DNS؟", url: "https://www.youtube.com/watch?v=27rCa0iI0cI" }
                ]
            },
            // 2. HTML
            {
                id: "fe_2",
                title: "HTML",
                desc: "Learn the basics, Semantic HTML, Forms & Validations, Accessibility, and SEO Basics.",
                resources: [
                    { type: "video", title: "كورس HTML كامل (Elzero)", url: "https://www.youtube.com/playlist?list=PLDoPjvoNmBAw_t_XWUFbBX-c9MafPk9ji" },
                    { type: "video", title: "Semantic HTML (شرح مفصل)", url: "https://www.youtube.com/watch?v=A_i7v-b3Wrs" },
                    { type: "article", title: "سهولة الوصول (Accessibility)", url: "https://developer.mozilla.org/ar/docs/Learn/Accessibility" }
                ]
            },
            // 3. CSS
            {
                id: "fe_3",
                title: "CSS",
                desc: "Basics, Layouts (Float, Flexbox, Grid), and Responsive Design.",
                resources: [
                    { type: "video", title: "كورس CSS كامل (Elzero)", url: "https://www.youtube.com/playlist?list=PLDoPjvoNmBAyE_7NIgC6YAhlg3YI-V59n" },
                    { type: "video", title: "Flexbox في فيديو واحد", url: "https://www.youtube.com/watch?v=GetrF8G7Q0s" },
                    { type: "video", title: "Grid System شرح", url: "https://www.youtube.com/watch?v=RZQu85gW-I0" }
                ]
            },
            // 4. JavaScript
            {
                id: "fe_4",
                title: "JavaScript",
                desc: "Syntax, DOM Manipulation, Fetch API / AJAX.",
                resources: [
                    { type: "video", title: "كورس JavaScript (Elzero)", url: "https://www.youtube.com/playlist?list=PLDoPjvoNmBAx3kiplQR_oeDqLDBUDYwVv" },
                    { type: "video", title: "شرح DOM Manipulation", url: "https://www.youtube.com/watch?v=5z_dJj_Lgqg" },
                    { type: "video", title: "AJAX & JSON شرح", url: "https://www.youtube.com/watch?v=9QO4Du-gqQE" }
                ]
            },
            // 5. Version Control
            {
                id: "fe_5",
                title: "Version Control (Git)",
                desc: "Git basics and hosting services (GitHub/GitLab).",
                resources: [
                    { type: "video", title: "كورس Git & GitHub (Elzero)", url: "https://www.youtube.com/playlist?list=PLDoPjvoNmBAw4eOJ58IZ8vZDB6SQ0mYgI" }
                ]
            },
            // 6. Package Managers
            {
                id: "fe_6",
                title: "Package Managers",
                desc: "npm, yarn, pnpm - Managing dependencies.",
                resources: [
                    { type: "video", title: "شرح NPM وأوامره (Elzero)", url: "https://www.youtube.com/watch?v=OCIRRyBbz_w" },
                    { type: "video", title: "ما هو Yarn؟", url: "https://www.youtube.com/watch?v=1Sjhc09Q7f8" }
                ]
            },
            // 7. CSS Architecture & Preprocessors
            {
                id: "fe_7",
                title: "Modern CSS",
                desc: "BEM, Sass, Tailwind CSS.",
                resources: [
                    { type: "video", title: "كورس SASS (Elzero)", url: "https://www.youtube.com/playlist?list=PLDoPjvoNmBAzlPyLCtU3D4k4YS0W8LgC7" },
                    { type: "video", title: "شرح Tailwind CSS بالعربي", url: "https://www.youtube.com/playlist?list=PL0vfts4VzfNiI1k-S0sYq-gIqYc95iA4k" }
                ]
            },
            // 8. Frameworks
            {
                id: "fe_8",
                title: "Frameworks (React)",
                desc: "Building components and state management.",
                resources: [
                    { type: "video", title: "كورس React كامل (Unique Coderz)", url: "https://www.youtube.com/playlist?list=PLtFbQRDJ11sHMcfW6V9XW8r9j0iY7bN7b" },
                    { type: "video", title: "Redux Toolkit شرح", url: "https://www.youtube.com/watch?v=9gWzJgXFpkw" }
                ]
            },
            // 9. Build Tools
            {
                id: "fe_9",
                title: "Build Tools",
                desc: "Vite, Webpack, Linters (ESLint), and Formatters (Prettier).",
                resources: [
                    { type: "video", title: "ما هو Webpack؟ (Elzero)", url: "https://www.youtube.com/watch?v=X1qQ6g1_e0M" },
                    { type: "video", title: "Vite JS Crash Course (Arabic)", url: "https://www.youtube.com/watch?v=DkH0sF5ZtOw" }
                ]
            },
            // 10. Testing
            {
                id: "fe_10",
                title: "Testing",
                desc: "Unit Testing (Jest, Vitest) and E2E (Cypress, Playwright).",
                resources: [
                    { type: "video", title: "شرح Unit Testing بـ Jest (Elzero)", url: "https://www.youtube.com/playlist?list=PLDoPjvoNmBAyA5F_R5F09vC5g7Fq5y_z_" }
                ]
            },
            // 11. Security & Auth
            {
                id: "fe_11",
                title: "Web Security & Auth",
                desc: "HTTPS, CORS, JWT, OAuth, and OWASP Risks.",
                resources: [
                    { type: "video", title: "شرح JWT (JSON Web Token)", url: "https://www.youtube.com/watch?v=V9Q2g3aP16c" },
                    { type: "video", title: "ما هو CORS؟", url: "https://www.youtube.com/watch?v=yi2XDwPxr5c" }
                ]
            },
            // 12. TypeScript
            {
                id: "fe_12",
                title: "TypeScript",
                desc: "Static Type Checking for JavaScript.",
                resources: [
                    { type: "video", title: "كورس TypeScript (Elzero)", url: "https://www.youtube.com/playlist?list=PLDoPjvoNmBAy53JXMpE8BqzDlAhqJ+f1e" }
                ]
            },
            // 13. SSR & Next.js
            {
                id: "fe_13",
                title: "SSR (Next.js)",
                desc: "Server Side Rendering and Static Site Generation.",
                resources: [
                    { type: "video", title: "كورس Next.js 13 (Unique Coderz)", url: "https://www.youtube.com/playlist?list=PLtFbQRDJ11sHh3O_FzX_yO5L_b5_y5_5" }
                ]
            },
            // 14. Performance
            {
                id: "fe_14",
                title: "Web Performance",
                desc: "Web Vitals, Lighthouse, DevTools, and Optimization.",
                resources: [
                    { type: "video", title: "تحسين سرعة الموقع (Performance)", url: "https://www.youtube.com/watch?v=0fW1sA6sH_0" },
                    { type: "article", title: "قياس الأداء (MDN Arabic)", url: "https://developer.mozilla.org/ar/docs/Web/Performance" }
                ]
            }
        ]
    },

    // --- OTHER ROLES (Examples - You can expand these later) ---
    "backend": {
        title: "Backend Developer",
        description: "Server logic, Databases, and APIs.",
        categories: ["role"],
        steps: [
            { id: "be_1", title: "Python Basics", desc: "Core syntax.", resources: [{ type: "video", title: "Python (Codezilla)", url: "https://www.youtube.com/playlist?list=PLuXY3ddo_8nzrO74UeZQVfV5CYYE2J0pz" }] }
        ]
    },
    // ... keep your other roles here (data_analyst, etc.) as placeholders ...
};