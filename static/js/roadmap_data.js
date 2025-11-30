/* static/js/roadmap_data.js */

const roadmapData = {
    // CRITICAL FIX: The key was "frontend" but the logic in script.js (loadRoadmap)
    // often looks for 'frontend_dev' or 'frontend' based on the HTML.
    // We'll rename it to 'frontend_dev' for clarity and compatibility with typical calls.
    "frontend_dev": {
        title: "Frontend Developer",
        description: "Step-by-step guide to becoming a modern Frontend Developer.",

        // --- FIX IS HERE ---
        // Changed ["role, trending"] to ["role", "trending"]
        categories: ["role", "trending"],
        // ------------------

        steps: [
            // 1. Internet
            {
                id: "fe_1",
                title: "Internet Basics (الإنترنت)",
                desc: "How does the internet work? HTTP, Domain Name, Hosting, DNS, and Browsers.",
                resources: [
                    { type: "video", title: "كيف يعمل الانترنت", url: "https://www.youtube.com/watch?v=TnMNDQHB33Q" },
                    { type: "article", title: "ما هو الHTTPS", url: "https://www.ssl.com/ar/%D8%A3%D8%B3%D8%A6%D9%84%D8%A9-%D9%88%D8%A3%D8%AC%D9%88%D8%A8%D8%A9/%D9%85%D8%A7-%D9%87%D9%88-https/" },
                    { type: "article", title: "ما هو ال DNS و كيف يعمل", url: "https://netriders.academy/all-forums/discussion/%D8%B4%D8%B1%D8%AD-%D8%B3%D8%B1%D9%8A%D8%B9-%D9%84-%D8%A8%D8%B1%D9%88%D8%AA%D9%88%D9%83%D9%88%D9%84-dns/" }
                ]
            },
            // 2. HTML
            {
                id: "fe_2",
                title: "HTML",
                desc: "Learn the basics, Semantic HTML, Forms & Validations, Accessibility, and SEO Basics.",
                resources: [
                    { type: "video", title: "كورس HTML)", url: "https://www.youtube.com/watch?v=cvNTgKw8VlY" },
                    { type: "article", title: "FreeCodeCamp", url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/" },
                    { type: "article", title: "ما هو الإنترنت وكيف يعمل الإنترنت", url: "https://www.zajil.com/ar/what-is-internet-how-the-internet-works/" }
                ]
            },
            // 3. CSS
            {
                id: "fe_3",
                title: "CSS",
                desc: "Basics, Layouts (Float, Flexbox, Grid), and Responsive Design.",
                resources: [
                    { type: "video", title: "كورس css", url: "https://www.youtube.com/playlist?list=PLknwEmKsW8Os7rKViMCL8x6irVJT7McSS" },
                    { type: "article", title: "تعلم لغة CSS", url: "https://harmash.com/tutorials/css/overview" },
                ]
            },
            // 4. JavaScript
            {
                id: "fe_4",
                title: "JavaScript",
                desc: "Syntax, DOM Manipulation, Fetch API / AJAX.",
                resources: [
                    { type: "video", title: "كورس جافاسكريبت", url: "https://www.youtube.com/watch?v=2EAV2cB3FWY&list=PL8q8h6vqfkSXcfaCL_nqsbLkDnodHpBG8" },
                    { type: "article", title: "جافاسكربت", url: "https://harmash.com/tutorials/javascript/overview" },
                ]
            },
            // 5. Version Control
            {
                id: "fe_5",
                title: "Version Control / VCS Hosting (Git)",
                desc: "Git basics and hosting services (GitHub).",
                resources: [
                    { type: "video", title: "What is GitHub?", url: "https://www.youtube.com/watch?v=PsXDzwBW2Ls" },
                    { type: "article", title: "دليل شرح استخدام موقع GitHub", url: "https://mystro-learning.com/ar/%D8%B4%D8%B1%D8%AD-%D8%A7%D8%B3%D8%AA%D8%AE%D8%AF%D8%A7%D9%85-%D9%85%D9%88%D9%82%D8%B9-github/" },
                ]
            },
            // 6. Package Managers
            {
                id: "fe_6",
                title: "Package Managers",
                desc: "npm and yarn - Managing dependencies.",
                resources: [
                    { type: "video", title: "NPM - ما هى وفيما تستخدم ؟ بالعربى", url: "https://www.youtube.com/watch?v=m4qICzy1XpU" },
                    { type: "article", title: "دليلك الشامل إلى مدير الحزم npm في Node.js", url: "https://academy.hsoub.com/programming/javascript/nodejs/%D8%AF%D9%84%D9%8A%D9%84%D9%83-%D8%A7%D9%84%D8%B4%D8%A7%D9%85%D9%84-%D8%A5%D9%84%D9%89-%D9%85%D8%AF%D9%8A%D8%B1-%D8%A7%D9%84%D8%AD%D8%B2%D9%85-npm-%D9%81%D9%8A-nodejs-r1465/" }
                ]
            },
            // 7. CSS Architecture & Preprocessors
            {
                id: "fe_7",
                title: "CSS Frameworks",
                desc: "Tailwind CSS.",
                resources: [
                    { type: "article", title: "Official docs", url: "https://tailwindcss.com/" },
                    { type: "video", title: "Learn Tailwind CSS", url: "https://www.youtube.com/watch?v=jSbBYEfCcgo" }
                ]
            },
            // 8. Frameworks
            {
                id: "fe_8",
                title: "React",
                desc: "Building components and state management.",
                resources: [
                    { type: "article", title: "Official docs", url: "https://ar.react.dev/learn" },
                    { type: "video", title: "تعلم اساسيات رياكت في ساعة", url: "https://www.youtube.com/watch?v=3AJfX4Cd64c" },
                    { type: "video", title: "Harmash تعلم React", url: "https://harmash.com/tutorials/react/overview" },
                ]
            },

            {
                id: "fe_8.1",
                title: "Vue.js",
                desc: "Building components and state management.",
                resources: [
                    { type: "article", title: "Official docs", url: "https://ar.vuejs.org/" },
                    { type: "video", title: "تعلم اساسيات رياكت في ساعة", url: "https://www.youtube.com/watch?v=3AJfX4Cd64c" },
                    { type: "video", title: "Harmash تعلم React", url: "https://harmash.com/tutorials/react/overview" },
                ]
            },

            {
                id: "fe_8.2",
                title: "Angular",
                desc: "Building components and state management.",
                resources: [
                    { type: "article", title: "Help us make it happen!", url: "" },
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
};