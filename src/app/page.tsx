// File ini memastikan bahwa path root ("/") menggunakan halaman yang didefinisikan
// di dalam route group (public). Ini memungkinkan halaman tersebut untuk dibungkus
// oleh (public)/layout.tsx, yang menyertakan LandingNavbar dan LandingFooter.

import LandingPageWithPublicLayout from './(public)/page';

export default LandingPageWithPublicLayout;
