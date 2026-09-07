import React, { useState, useEffect, useMemo } from "react";
import { Head, Link } from "@inertiajs/react";
import {
    MapPin,
    Phone,
    Menu as MenuIcon,
    X,
    Coffee,
    CupSoda,
    Heart,
    Smile,
    Zap,
    Award,
    Sparkles,
    Milk,
    Leaf,
    Play,
    MessageCircle,
    Send,
    ArrowRight,
    Check,
    Search,
} from "lucide-react";
import { login } from "@/routes";

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

export interface BackendProduct {
    id: number;
    name: string;
    description?: string | null;
    price: number | string;
    image_url?: string | null;
    category_id?: number;
    category_name?: string;
}

export interface BackendCategory {
    id: number;
    name: string;
    description?: string | null;
    products: BackendProduct[];
}

export interface WelcomeProps {
    categories?: BackendCategory[];
    products?: BackendProduct[];
}

/*
|--------------------------------------------------------------------------
| Fallback Menu Data (used if database is not yet seeded)
|--------------------------------------------------------------------------
*/

const FALLBACK_CATEGORIES: {
    key: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    products: BackendProduct[];
}[] = [
    {
        key: "hot-coffee",
        label: "Hot Coffee",
        icon: Coffee,
        products: [
            { id: 1, name: "Espresso", price: 0.75, description: "Rich single shot of artisanal espresso.", category_name: "Hot Coffee" },
            { id: 2, name: "Americano", price: 0.75, description: "Bold espresso diluted with hot water.", category_name: "Hot Coffee" },
            { id: 3, name: "Cappuccino", price: 1.00, description: "Balanced espresso with a thick creamy foam crown.", category_name: "Hot Coffee" },
            { id: 4, name: "Latte", price: 0.75, description: "Velvety steamed milk over bold espresso.", category_name: "Hot Coffee" },
            { id: 5, name: "Caramel Latte", price: 1.00, description: "Smooth espresso latte infused with sweet caramel.", category_name: "Hot Coffee" },
            { id: 6, name: "Spanish Latte", price: 1.00, description: "Espresso with condensed milk and creamy steamed milk.", category_name: "Hot Coffee" },
        ],
    },
    {
        key: "hot-tea",
        label: "Hot Tea",
        icon: Leaf,
        products: [
            { id: 7, name: "Somali Tea", price: 0.50, description: "Traditional Somali spiced tea with milk and cardamom.", category_name: "Hot Tea" },
            { id: 8, name: "Qaxwo Somali", price: 0.50, description: "Traditional Somali spiced coffee with ginger.", category_name: "Hot Tea" },
            { id: 9, name: "Hot Chocolate", price: 0.75, description: "Rich and velvety warm hot chocolate.", category_name: "Hot Tea" },
            { id: 10, name: "Loos Tea", price: 0.75, description: "Fresh loose leaf brewed tea.", category_name: "Hot Tea" },
            { id: 11, name: "Green Tea", price: 0.50, description: "Steamed antioxidant-rich soothing green tea.", category_name: "Hot Tea" },
            { id: 12, name: "Shaax Daqar", price: 0.75, description: "Specialty spiced traditional Somali tea.", category_name: "Hot Tea" },
        ],
    },
    {
        key: "boba-tea",
        label: "Boba Tea",
        icon: CupSoda,
        products: [
            { id: 13, name: "Blueberry With Boba", price: 1.75, description: "Blueberry milk tea with chewy tapioca pearls.", category_name: "Boba Tea" },
            { id: 14, name: "Mango With Boba", price: 1.75, description: "Sweet tropical mango milk tea with boba pearls.", category_name: "Boba Tea" },
            { id: 15, name: "Vanilla Milk Boba", price: 1.75, description: "Creamy vanilla milk tea with chewy pearls.", category_name: "Boba Tea" },
            { id: 16, name: "Strawberry Milk Boba", price: 1.75, description: "Fresh strawberry milk tea with boba.", category_name: "Boba Tea" },
            { id: 17, name: "Lotus Milk Boba", price: 1.75, description: "Lotus Biscoff flavored milk tea with boba pearls.", category_name: "Boba Tea" },
            { id: 18, name: "Chocolate Milk Boba", price: 1.75, description: "Decadent chocolate milk tea with tapioca pearls.", category_name: "Boba Tea" },
        ],
    },
    {
        key: "cold-drinks",
        label: "Cold Drinks",
        icon: Sparkles,
        products: [
            { id: 19, name: "Iced Americano", price: 1.00, description: "Chilled espresso poured over iced water.", category_name: "Cold Drinks" },
            { id: 20, name: "Latte Ice Coffee", price: 1.00, description: "Iced espresso with cold fresh velvety milk.", category_name: "Cold Drinks" },
            { id: 21, name: "Caramel Iced Latte", price: 1.25, description: "Iced latte infused with golden caramel syrup.", category_name: "Cold Drinks" },
            { id: 22, name: "Iced Matcha", price: 1.50, description: "Chilled Japanese matcha green tea latte.", category_name: "Cold Drinks" },
            { id: 23, name: "Strawberry Matcha", price: 1.50, description: "Layered iced matcha with sweet strawberry puree.", category_name: "Cold Drinks" },
            { id: 24, name: "Chocolate Latte", price: 1.25, description: "Iced mocha latte with rich chocolate swirl.", category_name: "Cold Drinks" },
        ],
    },
    {
        key: "shakes",
        label: "Shakes",
        icon: Milk,
        products: [
            { id: 25, name: "Banana Shake", price: 1.00, description: "Freshly blended creamy banana shake.", category_name: "Shakes" },
            { id: 26, name: "Mango Shake", price: 1.25, description: "Sweet ripe tropical mango fruit shake.", category_name: "Shakes" },
            { id: 27, name: "Timir Milk Shake", price: 1.00, description: "Traditional sweet Somali date (timir) milkshake.", category_name: "Shakes" },
            { id: 28, name: "Vanilla Milkshake", price: 1.25, description: "Classic rich vanilla bean milkshake.", category_name: "Shakes" },
            { id: 29, name: "Strawberry Milkshake", price: 1.25, description: "Fresh strawberry creamy blended milkshake.", category_name: "Shakes" },
            { id: 30, name: "Lotus Milkshake", price: 1.25, description: "Lotus Biscoff cookie butter milkshake.", category_name: "Shakes" },
        ],
    },
];

const FEATURES = [
    {
        icon: Award,
        title: "Premium Quality",
        desc: "We use the best coffee beans and high-quality ingredients.",
    },
    {
        icon: Coffee,
        title: "Freshly Made",
        desc: "Every drink is freshly prepared just for you.",
    },
    {
        icon: Heart,
        title: "Made With Love",
        desc: "We put love in every drink we make.",
    },
    {
        icon: Smile,
        title: "Great Taste",
        desc: "Delicious drinks that make your day better.",
    },
    {
        icon: Zap,
        title: "Fast Service",
        desc: "Quick & friendly service, always with a smile.",
    },
];

const getCategoryIcon = (name: string): React.ComponentType<{ className?: string }> => {
    const lower = name.toLowerCase();
    if (lower.includes("all")) return Sparkles;
    if (lower.includes("coffee")) return Coffee;
    if (lower.includes("tea") && !lower.includes("boba")) return Leaf;
    if (lower.includes("boba")) return CupSoda;
    if (lower.includes("shake")) return Milk;
    return Sparkles;
};

const getProductImage = (name: string, index: number): string => {
    const lower = name.toLowerCase();
    if (lower.includes("boba")) return "/images/boba_drink.jpg";
    if (lower.includes("chocolate") || lower.includes("cocoa")) return "/images/iced-chocolate.jpg";
    const fallbacks = [
        "/images/drink-item-0.jpg",
        "/images/drink-item-1.jpg",
        "/images/drink-item-2.jpg",
        "/images/boba_drink.jpg",
    ];
    return fallbacks[index % fallbacks.length];
};

export default function Welcome({ categories = [], products = [] }: WelcomeProps) {
    // Filter active categories that actually have products
    const activeCategoriesList = useMemo(() => {
        if (categories && categories.length > 0) {
            return categories.filter((c) => c.products && c.products.length > 0);
        }
        return [];
    }, [categories]);

    // Gather all products
    const allProducts = useMemo(() => {
        if (products && products.length > 0) {
            return products;
        }
        if (activeCategoriesList.length > 0) {
            return activeCategoriesList.flatMap((c) =>
                c.products.map((p) => ({
                    ...p,
                    category_id: c.id,
                    category_name: c.name,
                }))
            );
        }
        return FALLBACK_CATEGORIES.flatMap((c) => c.products);
    }, [products, activeCategoriesList]);

    // Build categories list including "All" tab
    const categoryTabs = useMemo(() => {
        const tabs = [
            {
                key: "all",
                label: "All Drinks",
                count: allProducts.length,
                icon: Sparkles,
            },
        ];

        if (activeCategoriesList.length > 0) {
            activeCategoriesList.forEach((cat) => {
                tabs.push({
                    key: String(cat.id),
                    label: cat.name,
                    count: cat.products.length,
                    icon: getCategoryIcon(cat.name),
                });
            });
        } else {
            FALLBACK_CATEGORIES.forEach((cat) => {
                tabs.push({
                    key: cat.key,
                    label: cat.label,
                    count: cat.products.length,
                    icon: cat.icon,
                });
            });
        }

        return tabs;
    }, [activeCategoriesList, allProducts]);

    // Default to "all" so visitors see the full menu list immediately
    const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    // Filter products based on selected tab and search query
    const filteredProducts = useMemo(() => {
        let list = allProducts;

        if (selectedCategoryKey !== "all") {
            if (activeCategoriesList.length > 0) {
                const cat = activeCategoriesList.find((c) => String(c.id) === selectedCategoryKey);
                list = cat ? cat.products : allProducts;
            } else {
                const fallback = FALLBACK_CATEGORIES.find((c) => c.key === selectedCategoryKey);
                list = fallback ? fallback.products : allProducts;
            }
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            list = list.filter(
                (p) =>
                    p.name.toLowerCase().includes(query) ||
                    (p.description && p.description.toLowerCase().includes(query)) ||
                    (p.category_name && p.category_name.toLowerCase().includes(query))
            );
        }

        return list;
    }, [selectedCategoryKey, allProducts, activeCategoriesList, searchQuery]);

    // Contact Form state
    const [contactName, setContactName] = useState("");
    const [contactPhone, setContactPhone] = useState("");
    const [contactMessage, setContactMessage] = useState("");
    const [contactNotice, setContactNotice] = useState<string | null>(null);

    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (contactName.trim() && contactPhone.trim() && contactMessage.trim()) {
            setContactNotice(
                `Thanks, ${contactName.trim()}! Your message has been received. We will contact you soon.`
            );
            setContactName("");
            setContactPhone("");
            setContactMessage("");
        } else {
            setContactNotice("Please fill in all contact fields.");
        }
    };

    return (
        <>
            <Head title="MaMa Café — Coffee • Boba • Ice Chocolate">
                <meta
                    name="description"
                    content="MaMa Café in Dahablaha Bakaro Market, Mogadishu. Fresh coffee, boba, ice chocolate and shakes. Made with love, served with happiness."
                />
            </Head>

            <div
                className="landing-root min-h-screen bg-[#fffaf4] text-[#2c180d] selection:bg-[#4a2411] selection:text-white"
                style={{
                    fontFamily:
                        'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                    fontStyle: "normal",
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "24px",
                }}
            >
                <style>{`
                    .landing-root, .landing-root * {
                        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
                    }
                    .landing-root .brand-heading {
                        font-family: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif !important;
                        font-weight: 600;
                        letter-spacing: -0.025em;
                    }
                    .landing-root .fresh-drinks-text {
                        font-family: "Roboto Variable", Roboto, "Helvetica Neue", Helvetica, sans-serif !important;
                        font-style: normal !important;
                        font-size: 16px !important;
                        font-weight: 400 !important;
                        line-height: 16px !important;
                        color: rgb(250, 250, 250) !important;
                    }
                `}</style>

                {/* =====================================================
                    TOP BAR (Modern, Compact, Professional - max-w-6xl)
                ===================================================== */}
                <div className="bg-[#28160d] text-[#fff5ea] text-[13px] border-b border-[#3c2114]">
                    <div className="mx-auto w-[92%] max-w-6xl h-[40px] flex items-center justify-between">
                        <div className="flex items-center gap-2 font-normal text-[#f5ebd9]">
                            <MapPin className="w-3.5 h-3.5 text-[#e5c78d] shrink-0" />
                            <span className="text-[12px] sm:text-[13px]">
                                Dahablaha Bakaro Market, Mogadishu
                            </span>
                        </div>

                        <div className="flex items-center gap-4 sm:gap-6">
                            {/* Social Icons */}
                            <div className="hidden sm:flex items-center gap-2">
                                <a
                                    href="https://facebook.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-[22px] h-[22px] rounded-full bg-white/10 hover:bg-white text-white hover:text-[#28160d] flex items-center justify-center text-[11px] font-bold transition duration-200"
                                    aria-label="Facebook"
                                >
                                    f
                                </a>
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-[22px] h-[22px] rounded-full bg-white/10 hover:bg-white text-white hover:text-[#28160d] flex items-center justify-center text-[11px] font-bold transition duration-200"
                                    aria-label="Instagram"
                                >
                                    ◎
                                </a>
                                <a
                                    href="https://tiktok.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-[22px] h-[22px] rounded-full bg-white/10 hover:bg-white text-white hover:text-[#28160d] flex items-center justify-center text-[11px] font-bold transition duration-200"
                                    aria-label="TikTok"
                                >
                                    ♪
                                </a>
                            </div>

                            {/* Phone */}
                            <a
                                href="tel:+252613399977"
                                className="flex items-center gap-1.5 text-[12px] sm:text-[13px] text-[#f5ebd9] hover:text-[#e5c78d] transition"
                            >
                                <Phone className="w-3.5 h-3.5 text-[#e5c78d]" />
                                <span>+252 61 3399977</span>
                            </a>

                            {/* Staff Sign In */}
                            <Link
                                href={login()}
                                className="hidden md:inline-block text-[11px] font-medium text-[#f5ebd9]/90 hover:text-white border border-[#f5ebd9]/30 hover:border-white px-2.5 py-0.5 rounded-full transition"
                            >
                                Staff Login
                            </Link>
                        </div>
                    </div>
                </div>

                {/* =====================================================
                    STICKY HEADER & NAV (max-w-6xl, Staff Login button)
                ===================================================== */}
                <header className="sticky top-0 z-40 bg-[#fffaf5]/95 backdrop-blur-md border-b border-[#eaded3]">
                    <div className="mx-auto w-[92%] max-w-6xl h-[60px] sm:h-[68px] flex items-center justify-between">
                        {/* Logo */}
                        <a
                            href="#home"
                            className="flex flex-col leading-none no-underline text-[#2c180d] group"
                            aria-label="MaMa Café home"
                        >
                            <span className="brand-heading text-[22px] sm:text-[24px] font-bold tracking-tight text-[#2c180d] flex items-center gap-1.5">
                                MaMa Café
                                <Coffee className="w-4 h-4 text-[#5b2d17] inline -translate-y-0.5" />
                            </span>
                            <small className="text-[9px] font-bold tracking-[0.2em] text-[#5b2d17] mt-0.5">
                                COFFEE · BOBA · ICE CHOCOLATE
                            </small>
                        </a>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-7 text-[14px] font-medium text-[#2c180d]">
                            <a
                                href="#home"
                                className="py-2 hover:text-[#5b2d17] border-b-2 border-[#5b2d17] font-semibold transition"
                            >
                                Home
                            </a>
                            <a
                                href="#menu"
                                className="py-2 hover:text-[#5b2d17] border-b-2 border-transparent transition"
                            >
                                Menu
                            </a>
                            <a
                                href="#about"
                                className="py-2 hover:text-[#5b2d17] border-b-2 border-transparent transition"
                            >
                                About Us
                            </a>
                            <a
                                href="#why"
                                className="py-2 hover:text-[#5b2d17] border-b-2 border-transparent transition"
                            >
                                Why Choose Us
                            </a>
                            <a
                                href="#gallery"
                                className="py-2 hover:text-[#5b2d17] border-b-2 border-transparent transition"
                            >
                                Gallery
                            </a>
                            <a
                                href="#contact"
                                className="py-2 hover:text-[#5b2d17] border-b-2 border-transparent transition"
                            >
                                Contact
                            </a>
                        </nav>

                        {/* Header Actions - Staff Login button */}
                        <div className="flex items-center gap-3">
                            <Link
                                href={login()}
                                className="bg-[#4b2512] hover:bg-[#391b0c] text-white rounded-full px-4 sm:px-5 py-2 text-[13px] font-semibold flex items-center gap-1.5 shadow-xs transition hover:scale-[1.02] active:scale-95"
                            >
                                <span>Staff Login</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>

                            {/* Mobile Hamburger Toggle */}
                            <button
                                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                                className="lg:hidden p-1.5 text-[#3c1d0e] focus:outline-none cursor-pointer"
                                aria-label="Toggle Navigation"
                            >
                                {mobileNavOpen ? (
                                    <X className="w-6 h-6" />
                                ) : (
                                    <MenuIcon className="w-6 h-6" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation Dropdown */}
                    {mobileNavOpen && (
                        <div className="lg:hidden bg-[#fffaf5] border-b border-[#eaded3] px-6 py-4 flex flex-col gap-2.5 shadow-md animate-in slide-in-from-top-2 text-[14px]">
                            <a
                                href="#home"
                                onClick={() => setMobileNavOpen(false)}
                                className="py-1.5 font-semibold text-[#5b2d17]"
                            >
                                Home
                            </a>
                            <a
                                href="#menu"
                                onClick={() => setMobileNavOpen(false)}
                                className="py-1.5 text-[#2c180d]"
                            >
                                Menu
                            </a>
                            <a
                                href="#about"
                                onClick={() => setMobileNavOpen(false)}
                                className="py-1.5 text-[#2c180d]"
                            >
                                About Us
                            </a>
                            <a
                                href="#why"
                                onClick={() => setMobileNavOpen(false)}
                                className="py-1.5 text-[#2c180d]"
                            >
                                Why Choose Us
                            </a>
                            <a
                                href="#gallery"
                                onClick={() => setMobileNavOpen(false)}
                                className="py-1.5 text-[#2c180d]"
                            >
                                Gallery
                            </a>
                            <a
                                href="#contact"
                                onClick={() => setMobileNavOpen(false)}
                                className="py-1.5 text-[#2c180d]"
                            >
                                Contact
                            </a>
                            <Link
                                href={login()}
                                className="mt-1 py-2 text-[13px] font-semibold text-[#5b2d17] border-t border-[#eaded3]"
                            >
                                Staff Login →
                            </Link>
                        </div>
                    )}
                </header>

                <main id="home">
                    {/* =====================================================
                        HERO SECTION (Seamless #EECAA5 and #FBEFE0 gradient)
                    ===================================================== */}
                    <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_70%_50%,#EECAA5_0%,#F6DFCA_45%,#FBEFE0_100%)] py-12 lg:py-16">
                        {/* Soft decorative leaf contours */}
                        <div className="absolute right-0 top-6 w-[100px] h-[50px] border border-[#d8a16f]/40 rounded-[100%_0_100%_0] rotate-[-25deg] pointer-events-none" />
                        <div className="absolute -left-6 bottom-12 w-[100px] h-[50px] border border-[#d8a16f]/40 rounded-[100%_0_100%_0] rotate-[40deg] pointer-events-none" />

                        <div className="mx-auto w-[92%] max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                            {/* Hero Copy (Left) */}
                            <div className="lg:col-span-5 xl:col-span-5 flex flex-col items-start z-10">
                                <p
                                    className="fresh-drinks-text inline-block px-3.5 py-1.5 rounded-full bg-[#4a2411] mb-2 tracking-wide uppercase shadow-xs"
                                    style={{
                                        fontFamily: '"Roboto Variable", Roboto, "Helvetica Neue", Helvetica, sans-serif',
                                        fontStyle: "normal",
                                        fontWeight: 400,
                                        fontSize: "16px",
                                        lineHeight: "16px",
                                        color: "rgb(250, 250, 250)",
                                    }}
                                >
                                    Fresh Drinks, Good Mood ♥
                                </p>

                                <h1 className="brand-heading text-[48px] sm:text-[60px] lg:text-[68px] leading-[0.88] tracking-tight text-[#2c180d] my-2">
                                    MaMa
                                    <br />
                                    <em className="italic ml-6 sm:ml-10 font-normal">
                                        Café
                                    </em>
                                </h1>

                                {/* Ribbon */}
                                <div className="mt-3 inline-block">
                                    <div
                                        className="bg-[#542713] text-white font-bold text-[10px] tracking-[0.18em] px-5 py-1.5 shadow-xs"
                                        style={{
                                            clipPath:
                                                "polygon(3% 0, 97% 0, 100% 50%, 97% 100%, 3% 100%, 0 50%)",
                                        }}
                                    >
                                        COFFEE &nbsp;•&nbsp; BOBA &nbsp;•&nbsp;
                                        ICE CHOCOLATE
                                    </div>
                                </div>

                                <p className="text-[13px] sm:text-[14px] text-[#553b2c] leading-relaxed my-3 max-w-sm">
                                    Made with love, served with happiness.
                                    <br />
                                    Every drink is freshly prepared just for you.
                                </p>

                                {/* CTA Buttons */}
                                <div className="flex flex-wrap items-center gap-3 mt-1">
                                    <a
                                        href="#menu"
                                        className="bg-[#4a2411] hover:bg-[#34180a] text-white rounded-full px-5 py-2 text-[13px] font-semibold flex items-center gap-1.5 shadow-xs transition hover:scale-[1.02] active:scale-95"
                                    >
                                        <Coffee className="w-3.5 h-3.5" />
                                        <span>Explore Menu</span>
                                    </a>

                                    <a
                                        href="#about"
                                        className="bg-[#fffaf5] hover:bg-[#f7efe6] text-[#32190d] border border-[#32190d] rounded-full px-5 py-2 text-[13px] font-semibold flex items-center gap-1.5 transition hover:scale-[1.02] active:scale-95"
                                    >
                                        <Play className="w-3 h-3 fill-current" />
                                        <span>Our Story</span>
                                    </a>
                                </div>
                            </div>

                            {/* Hero Visual (Right) - Transparent Background, Medium-Large sizing */}
                            <div className="lg:col-span-7 xl:col-span-7 flex items-center justify-center">
                                <div className="relative w-full max-w-[640px] lg:max-w-[700px]">
                                    <img
                                        src="/images/hero-drinks-clean.png"
                                        alt="MaMa Café Signature Drinks"
                                        className="w-full h-auto object-contain drop-shadow-md transition-transform duration-500 hover:scale-[1.02]"
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src =
                                                "/images/hero-drinks-banner.jpg";
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* =====================================================
                        QUALITY BADGES (5 PILL FLOATING BAR - max-w-6xl)
                    ===================================================== */}
                    <div className="mx-auto w-[92%] max-w-6xl -mt-5 sm:-mt-7 relative z-20">
                        <div className="bg-[#fffaf5]/95 backdrop-blur-xs border border-[#eaded3] rounded-[20px] p-3.5 sm:p-5 shadow-[0_8px_25px_rgba(70,35,15,0.06)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-0">
                            {FEATURES.map((item, index) => {
                                const IconComponent = item.icon;
                                return (
                                    <div
                                        key={item.title}
                                        className={`flex items-center gap-3 px-2.5 py-1 ${
                                            index !== FEATURES.length - 1
                                                ? "lg:border-r lg:border-dotted lg:border-[#bfa795]"
                                                : ""
                                        }`}
                                    >
                                        <div className="w-[42px] h-[42px] shrink-0 rounded-full bg-[#4a2411] text-white flex items-center justify-center shadow-xs">
                                            <IconComponent className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <strong className="block text-[13px] sm:text-[14px] font-bold text-[#2c180d]">
                                                {item.title}
                                            </strong>
                                            <p className="text-[11.5px] text-[#725f53] leading-tight mt-0.5">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* =====================================================
                        MENU SECTION (Reads Full Backend Products List like POS)
                    ===================================================== */}
                    <section className="py-14 sm:py-18" id="menu">
                        <div className="mx-auto w-[92%] max-w-6xl">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                {/* LEFT: OUR MENU (7 cols) */}
                                <div className="lg:col-span-7">
                                    <div className="flex items-end justify-between mb-4">
                                        <div>
                                            <p className="brand-heading text-[13px] font-semibold text-[#4b2512] m-0 uppercase tracking-widest">
                                                Our Menu
                                            </p>
                                            <h2 className="brand-heading text-[22px] sm:text-[28px] font-bold text-[#2c180d] leading-tight mt-0.5">
                                                Pick your favorite drink.
                                            </h2>
                                        </div>
                                        <span className="text-[12.5px] font-semibold text-[#7a4e32] bg-[#f5ebe1] px-3 py-1 rounded-full border border-[#eadfd6]">
                                            {filteredProducts.length} Drinks
                                        </span>
                                    </div>

                                    {/* Search Bar */}
                                    <div className="relative mb-3.5">
                                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9c8273]" />
                                        <input
                                            type="text"
                                            placeholder="Search drinks (e.g. Latte, Matcha, Boba, Shake)..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full bg-white/95 border border-[#e4d4c7] focus:border-[#823d21] focus:ring-2 focus:ring-[#823d21]/15 rounded-xl pl-10 pr-9 py-2.5 text-[13px] text-[#2c180d] placeholder-[#a69183] outline-none transition shadow-xs"
                                        />
                                        {searchQuery && (
                                            <button
                                                type="button"
                                                onClick={() => setSearchQuery("")}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#eaded4] hover:bg-[#d8c2b2] text-[#4b2512] flex items-center justify-center text-[11px] font-bold transition"
                                                aria-label="Clear search"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>

                                    {/* Category Tabs (Lucide Icons, includes All Drinks tab) */}
                                    <div className="flex flex-wrap gap-2 mb-5">
                                        {categoryTabs.map((cat) => {
                                            const isActive = selectedCategoryKey === cat.key;
                                            const CatIcon = cat.icon;
                                            return (
                                                <button
                                                    key={cat.key}
                                                    type="button"
                                                    onClick={() => setSelectedCategoryKey(cat.key)}
                                                    className={`rounded-xl py-2 px-3 text-[12px] font-semibold flex items-center justify-center gap-1.5 transition border cursor-pointer ${
                                                        isActive
                                                            ? "bg-[#4a2411] text-white border-[#4a2411] shadow-xs"
                                                            : "bg-[#fffaf5] text-[#3d2112] border-[#e4d4c7] hover:border-[#bfa795]"
                                                    }`}
                                                >
                                                    <CatIcon className="w-3.5 h-3.5 shrink-0" />
                                                    <span>{cat.label}</span>
                                                    <span
                                                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                                                            isActive
                                                                ? "bg-white/25 text-white"
                                                                : "bg-[#eaded4] text-[#4b2512]"
                                                        }`}
                                                    >
                                                        {cat.count}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Products Grid - Displaying All Backend Products */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4.5 pb-2">
                                        {filteredProducts.length === 0 ? (
                                            <div className="col-span-full py-12 px-6 text-center bg-white/70 rounded-2xl border border-dashed border-[#d8c2b2]">
                                                <Coffee className="w-10 h-10 text-[#a07c65] mx-auto mb-2 opacity-50" />
                                                <h4 className="brand-heading text-[16px] font-bold text-[#2c180d]">No drinks found</h4>
                                                <p className="text-[12px] text-[#725f53] mt-1 max-w-xs mx-auto">
                                                    No drinks matched "{searchQuery}". Try searching for Boba, Latte, Matcha, or Shake!
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSearchQuery("");
                                                        setSelectedCategoryKey("all");
                                                    }}
                                                    className="mt-3.5 px-4 py-1.5 bg-[#4a2411] text-white rounded-xl text-xs font-semibold hover:bg-[#381b0c] transition shadow-xs"
                                                >
                                                    View All Drinks
                                                </button>
                                            </div>
                                        ) : (
                                            filteredProducts.map((item, index) => (
                                                <article
                                                    key={item.id || item.name}
                                                    className="group relative bg-white border border-[#eadfd6] hover:border-[#c59e84] rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                                                >
                                                    {/* Image & Badges */}
                                                    <div className="h-[155px] sm:h-[165px] w-full overflow-hidden bg-[#faf2ea] relative">
                                                        <img
                                                            src={item.image_url || getProductImage(item.name, index)}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                                                            onError={(e) => {
                                                                (e.currentTarget as HTMLImageElement).src =
                                                                    "/images/drink-item-0.jpg";
                                                            }}
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10 opacity-60 group-hover:opacity-75 transition-opacity" />

                                                        {/* Category Badge */}
                                                        <span className="absolute top-2.5 left-2.5 text-[9.5px] font-bold uppercase tracking-wider bg-white/95 backdrop-blur-xs text-[#4b2512] px-2.5 py-0.5 rounded-full border border-white/60 shadow-xs">
                                                            {item.category_name || "Specialty"}
                                                        </span>

                                                        {/* Floating Price Pill */}
                                                        <span className="absolute bottom-2.5 right-2.5 text-[13.5px] font-extrabold font-mono bg-[#28160d]/90 backdrop-blur-xs text-[#fedcb4] px-2.5 py-0.5 rounded-full border border-[#d8a16f]/40 shadow-sm">
                                                            ${Number(item.price).toFixed(2)}
                                                        </span>

                                                        {/* Fresh Indicator */}
                                                        <span className="absolute bottom-2.5 left-2.5 text-[9.5px] font-medium text-white/90 drop-shadow flex items-center gap-1">
                                                            <Sparkles className="w-3 h-3 text-amber-300" />
                                                            Handcrafted
                                                        </span>
                                                    </div>

                                                    {/* Card Body */}
                                                    <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                                                        <div>
                                                            <h3 className="brand-heading text-[15px] sm:text-[16px] font-bold text-[#2c180d] group-hover:text-[#823d21] transition-colors leading-snug line-clamp-1">
                                                                {item.name}
                                                            </h3>
                                                            <p className="text-[11.5px] text-[#6e5a4e] line-clamp-2 leading-relaxed mt-1">
                                                                {item.description ||
                                                                    "Freshly prepared with love and premium ingredients at MaMa Café."}
                                                            </p>
                                                        </div>

                                                        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#f4eade]">
                                                            <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#2e7d32] bg-[#edf7ee] px-2 py-0.5 rounded-full border border-[#c8e6c9]">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d32] animate-pulse"></span>
                                                                Available
                                                            </span>
                                                            <div className="text-right">
                                                                <span className="text-[10px] uppercase font-bold text-[#8c6d5b] tracking-wider block leading-none mb-0.5">
                                                                    Price
                                                                </span>
                                                                <span className="text-[16px] font-extrabold text-[#2c180d] font-mono leading-none">
                                                                    ${Number(item.price).toFixed(2)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </article>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* RIGHT: WHY CHOOSE MAMA CAFÉ (5 cols) - CODED WITH MAMA CUP CUTOUT */}
                                <div className="lg:col-span-5 sticky top-24" id="why">
                                    <div className="rounded-[22px] overflow-hidden border border-[#eadfd6] bg-gradient-to-br from-[#2b170c] via-[#381e10] to-[#1c0e07] text-[#fff6ed] p-6 sm:p-7 shadow-lg flex flex-col justify-between">
                                        <div>
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d8a16f]/20 border border-[#d8a16f]/40 text-[#f5ebd9] text-[11px] font-semibold uppercase tracking-wider mb-3">
                                                <Heart className="w-3.5 h-3.5 text-[#e5c78d]" />
                                                <span>Why Choose Us</span>
                                            </div>

                                            <h2 className="brand-heading text-[22px] sm:text-[25px] font-bold text-white leading-tight mb-2">
                                                Why Choose MaMa Café? ♥
                                            </h2>

                                            <p className="text-[13px] text-[#dfc8b6] leading-relaxed mb-5">
                                                Our goal is simple: to serve you amazing drinks that make you happy.
                                            </p>

                                            <ul className="space-y-3 mb-6">
                                                {[
                                                    {
                                                        title: "High-quality ingredients",
                                                        desc: "Freshly roasted coffee beans, artisanal teas, and rich cocoa.",
                                                    },
                                                    {
                                                        title: "Unique & delicious flavors",
                                                        desc: "Handcrafted boba teas, decadent shakes, and special drinks.",
                                                    },
                                                    {
                                                        title: "Hygienic & safe preparation",
                                                        desc: "Spotlessly clean preparation, always served with care and joy.",
                                                    },
                                                    {
                                                        title: "Affordable prices",
                                                        desc: "Premium café taste at everyday friendly neighborhood prices.",
                                                    },
                                                ].map((item) => (
                                                    <li key={item.title} className="flex items-start gap-3">
                                                        <div className="w-5 h-5 rounded-full bg-[#e5c78d] text-[#28160d] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                                                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                                                        </div>
                                                        <div>
                                                            <strong className="block text-[13px] sm:text-[13.5px] font-semibold text-[#fff6ed] leading-snug">
                                                                {item.title}
                                                            </strong>
                                                            <span className="text-[11.5px] text-[#d1b8a4] leading-tight">
                                                                {item.desc}
                                                            </span>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Featured MaMa Cup Cutout Image */}
                                        <div className="relative rounded-2xl bg-gradient-to-t from-[#1b0d06] to-[#3a1f12] p-4 flex items-center justify-center overflow-hidden border border-white/10 mt-2">
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#d8a16f33_0%,transparent_70%)] pointer-events-none" />
                                            <img
                                                src="/images/mama-cup-cutout.png"
                                                alt="MaMa Café Signature Cup"
                                                className="h-[180px] sm:h-[195px] w-auto object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.55)] transition-transform duration-500 hover:scale-105"
                                            />
                                            <div className="absolute bottom-3 right-3 bg-[#e5c78d] text-[#28160d] text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                                                Signature Cup
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* =====================================================
                        ABOUT US SECTION (max-w-6xl)
                    ===================================================== */}
                    <section className="py-14 sm:py-18 bg-[#f4e6d8]" id="about">
                        <div className="mx-auto w-[92%] max-w-6xl">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                                {/* Left Card */}
                                <div className="lg:col-span-7 bg-[#fffaf5] p-6 sm:p-8 rounded-[22px] shadow-xs">
                                    <p className="brand-heading text-[13px] font-semibold text-[#4b2512] m-0 uppercase tracking-widest">
                                        Our Story
                                    </p>
                                    <h2 className="brand-heading text-[20px] sm:text-[26px] font-bold text-[#2c180d] leading-tight my-2">
                                        A little cup of happiness, every day.
                                    </h2>
                                    <p className="text-[13px] text-[#553b2c] leading-relaxed mt-2">
                                        MaMa Café is a warm neighborhood café
                                        serving fresh coffee, boba, ice
                                        chocolate, shakes and tea in the heart
                                        of Mogadishu.
                                    </p>
                                    <p className="text-[13px] text-[#553b2c] leading-relaxed mt-2 mb-4">
                                        We believe a great drink should taste
                                        amazing, look beautiful and be served
                                        with a smile.
                                    </p>
                                    <a
                                        href="#contact"
                                        className="inline-flex items-center gap-1.5 bg-[#4a2411] hover:bg-[#34180a] text-white rounded-full px-5 py-2 text-[13px] font-semibold transition hover:scale-[1.02] shadow-xs"
                                    >
                                        <span>Visit Us</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </a>
                                </div>

                                {/* Right Graphic Stamp */}
                                <div className="lg:col-span-5 rounded-[22px] min-h-[260px] bg-gradient-to-br from-[#5b2d17] to-[#2c160d] flex items-center justify-center relative overflow-hidden shadow-xs p-6">
                                    <div className="w-[160px] h-[160px] rounded-full border-2 border-[#d8a16f] flex flex-col items-center justify-center text-center text-[#f7dfc3] rotate-[-8deg] shadow-inner">
                                        <span className="brand-heading text-[32px] font-bold leading-none">
                                            MaMa
                                        </span>
                                        <small className="brand-heading text-[20px] leading-none">
                                            Café
                                        </small>
                                    </div>

                                    <div className="absolute right-6 bottom-4 text-[#f7dfc3]/40 pointer-events-none">
                                        <Coffee className="w-12 h-12" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* =====================================================
                        GALLERY SECTION (max-w-6xl, Good Mood with cup cutout)
                    ===================================================== */}
                    <section className="py-14 sm:py-18 bg-[#fff7ef]" id="gallery">
                        <div className="mx-auto w-[92%] max-w-6xl">
                            <div className="mb-5">
                                <p className="brand-heading text-[13px] font-semibold text-[#4b2512] m-0 uppercase tracking-widest">
                                    Gallery
                                </p>
                                <h2 className="brand-heading text-[22px] sm:text-[28px] font-bold text-[#2c180d] leading-tight mt-0.5">
                                    Made to be enjoyed.
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="h-[210px] rounded-2xl overflow-hidden relative group shadow-xs">
                                    <img
                                        src="/images/drink-item-0.jpg"
                                        alt="Fresh Coffee"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <span className="absolute bottom-3 left-3 bg-[#fffaf4]/90 backdrop-blur-xs text-[#2c180d] text-[12px] font-bold px-3 py-1 rounded-full shadow-xs">
                                        Fresh Coffee
                                    </span>
                                </div>

                                <div className="h-[210px] rounded-2xl overflow-hidden relative group shadow-xs">
                                    <img
                                        src="/images/boba_drink.jpg"
                                        alt="Boba Love"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <span className="absolute bottom-3 left-3 bg-[#fffaf4]/90 backdrop-blur-xs text-[#2c180d] text-[12px] font-bold px-3 py-1 rounded-full shadow-xs">
                                        Boba Love
                                    </span>
                                </div>

                                <div className="h-[210px] rounded-2xl overflow-hidden relative group shadow-xs">
                                    <img
                                        src="/images/iced-chocolate.jpg"
                                        alt="Ice Chocolate"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <span className="absolute bottom-3 left-3 bg-[#fffaf4]/90 backdrop-blur-xs text-[#2c180d] text-[12px] font-bold px-3 py-1 rounded-full shadow-xs">
                                        Ice Chocolate
                                    </span>
                                </div>

                                <div className="h-[210px] rounded-2xl overflow-hidden relative group shadow-xs bg-[#faf2ea] flex items-center justify-center p-3">
                                    <img
                                        src="/images/mama-cup-cutout.png"
                                        alt="Good Mood - Signature Cup"
                                        className="h-[175px] w-auto object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-md"
                                    />
                                    <span className="absolute bottom-3 left-3 bg-[#fffaf4]/90 backdrop-blur-xs text-[#2c180d] text-[12px] font-bold px-3 py-1 rounded-full shadow-xs">
                                        Good Mood
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* =====================================================
                        CONTACT SECTION (max-w-6xl)
                    ===================================================== */}
                    <section className="py-14 sm:py-18 bg-[#f0dfd0]" id="contact">
                        <div className="mx-auto w-[92%] max-w-6xl">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                                {/* Contact Info */}
                                <div className="lg:col-span-5">
                                    <p className="brand-heading text-[13px] font-semibold text-[#4b2512] m-0 uppercase tracking-widest">
                                        Contact Us
                                    </p>
                                    <h2 className="brand-heading text-[22px] sm:text-[28px] font-bold text-[#2c180d] leading-tight my-1.5">
                                        Come say hello.
                                    </h2>
                                    <p className="text-[13px] text-[#553b2c] leading-relaxed mt-2 mb-4">
                                        We are at Dahablaha Bakaro Market,
                                        Mogadishu.
                                    </p>

                                    <div className="space-y-3 font-medium text-[#4a2411] text-[13px]">
                                        <a
                                            href="tel:+252613399977"
                                            className="flex items-center gap-2 hover:opacity-80 transition"
                                        >
                                            <Phone className="w-3.5 h-3.5 text-[#4a2411]" />
                                            <span>+252 61 3399977</span>
                                        </a>

                                        <a
                                            href="https://wa.me/252613399977?text=Hello%20MaMa%20Cafe%2C%20I%20have%20an%20inquiry."
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 hover:opacity-80 transition"
                                        >
                                            <MessageCircle className="w-4 h-4 text-[#4a2411]" />
                                            <span>WhatsApp us →</span>
                                        </a>

                                        <div className="flex items-center gap-2.5 text-[#553b2c]">
                                            <MapPin className="w-4 h-4 text-[#4a2411]" />
                                            <span>
                                                Dahablaha Bakaro Market,
                                                Mogadishu
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Form */}
                                <div className="lg:col-span-7">
                                    <form
                                        onSubmit={handleContactSubmit}
                                        className="bg-[#fffaf5] p-5 sm:p-7 rounded-[20px] shadow-[0_8px_25px_rgba(60,28,10,0.06)]"
                                    >
                                        {contactNotice && (
                                            <div className="bg-[#efe1d5] border border-[#d8c5b6] text-[#3d2112] text-[13px] p-3 rounded-xl mb-3.5">
                                                {contactNotice}
                                            </div>
                                        )}

                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                name="contact_name"
                                                placeholder="Your name"
                                                value={contactName}
                                                onChange={(e) =>
                                                    setContactName(
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                className="w-full bg-white border border-[#ddcfc4] focus:border-[#8a5a3c] rounded-xl px-3.5 py-2.5 text-[13.5px] outline-none transition"
                                            />

                                            <input
                                                type="text"
                                                name="contact_phone"
                                                placeholder="Phone number"
                                                value={contactPhone}
                                                onChange={(e) =>
                                                    setContactPhone(
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                className="w-full bg-white border border-[#ddcfc4] focus:border-[#8a5a3c] rounded-xl px-3.5 py-2.5 text-[13.5px] outline-none transition"
                                            />

                                            <textarea
                                                name="contact_message"
                                                rows={3}
                                                placeholder="How can we help?"
                                                value={contactMessage}
                                                onChange={(e) =>
                                                    setContactMessage(
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                className="w-full bg-white border border-[#ddcfc4] focus:border-[#8a5a3c] rounded-xl px-3.5 py-2.5 text-[13.5px] outline-none transition resize-none"
                                            />

                                            <button
                                                type="submit"
                                                className="w-full sm:w-auto bg-[#4a2411] hover:bg-[#34180a] text-white rounded-full px-6 py-2.5 text-[14px] font-semibold transition hover:scale-[1.02] active:scale-95 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                                            >
                                                <span>Send Message</span>
                                                <Send className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                {/* =====================================================
                    FOOTER (max-w-6xl)
                ===================================================== */}
                <footer className="bg-[#28160d] text-[#fff5ec] py-8">
                    <div className="mx-auto w-[92%] max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-5">
                        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                            <span className="brand-heading text-[20px] font-bold text-white leading-none">
                                MaMa Café
                            </span>
                            <small className="text-[9px] font-bold tracking-[0.2em] text-[#d8a16f] mt-0.5">
                                COFFEE · BOBA · ICE CHOCOLATE
                            </small>
                        </div>

                        <div className="flex items-center gap-5 text-[12.5px] text-[#f7dfc3]/80">
                            <a href="#home" className="hover:text-white transition">
                                Home
                            </a>
                            <a href="#menu" className="hover:text-white transition">
                                Menu
                            </a>
                            <a href="#about" className="hover:text-white transition">
                                About Us
                            </a>
                            <Link
                                href={login()}
                                className="hover:text-white transition underline"
                            >
                                Staff Login
                            </Link>
                        </div>

                        <p className="text-[12px] text-[#dfc9b8]/80 text-center sm:text-right">
                            © {new Date().getFullYear()} MaMa Café. Made with
                            love in Mogadishu.
                        </p>
                    </div>
                </footer>

                {/* =====================================================
                    FIXED WHATSAPP BUTTON (Lucide Icon)
                ===================================================== */}
                <div className="fixed bottom-5 right-5 z-40">
                    <a
                        href="https://wa.me/252613399977?text=Hello%20MaMa%20Cafe%2C%20I%20have%20an%20inquiry."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#2a160d] hover:bg-[#1a0c06] text-white rounded-full px-4 py-2.5 text-[13px] font-semibold flex items-center gap-2 shadow-[0_6px_20px_rgba(0,0,0,0.22)] border border-[#d8a16f]/40 hover:scale-105 transition-all duration-300"
                    >
                        <MessageCircle className="w-4 h-4 text-green-400 fill-current" />
                        <span>Chat on WhatsApp</span>
                    </a>
                </div>
            </div>
        </>
    );
}
