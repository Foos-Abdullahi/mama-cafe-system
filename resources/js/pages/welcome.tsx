import { Head, Link } from '@inertiajs/react';
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
    ArrowRight,
    Check,
    Search,
    ShoppingCart,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import React, { useMemo, useState, useEffect } from 'react';
import { login } from '@/routes';
import { UpwardRibbonBanner } from '@/components/cafe/UpwardRibbonBanner';


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

const STORY_SLIDES = [
    {
        subtitle: 'OUR STORY',
        title: 'A little cup of happiness, every day.',
        paragraph1:
            'MaMa Café is a warm neighborhood café serving fresh coffee, boba, ice chocolate, shakes and tea in the heart of Mogadishu.',
        paragraph2:
            'We believe a great drink should taste amazing, look beautiful and be served with a smile.',
        image: '/images/hero/MaMaCaféBobaTrio_Splash-removebg-preview.png',
        badge: 'Crafted with Love',
    },
    {
        subtitle: 'OUR PASSION',
        title: 'Fresh ingredients, unforgettable flavors.',
        paragraph1:
            'From rich espresso beans to handcrafted boba pearls, every ingredient is carefully chosen for maximum quality and freshness.',
        paragraph2:
            'Experience the magic of handcrafted drinks prepared with care by our dedicated baristas.',
        image: '/images/hero/MaMaCaféCoffee_andChocolateStillLife.png',
        badge: '100% Fresh Daily',
    },
    {
        subtitle: 'OUR COMMUNITY',
        title: 'Serving warmth across Mogadishu.',
        paragraph1:
            'Located in Dahablaha Bakaro Market, we are proud to be Mogadishu\'s favorite cozy spot for friends, families, and coffee lovers.',
        paragraph2:
            'Join us today and discover your new favorite signature drink!',
        image: '/images/mama-cup-cutout.png',
        badge: 'Mogadishu\'s Choice',
    },
];

/*
|--------------------------------------------------------------------------
| Fallback Menu Data (used if database is not yet seeded)
|--------------------------------------------------------------------------
*/

const FALLBACK_CATEGORIES: {
    key: string;
    label: string;
    icon: LucideIcon;
    products: BackendProduct[];
}[] = [
    {
        key: 'hot-coffee',
        label: 'Hot Coffee',
        icon: Coffee,
        products: [
            {
                id: 1,
                name: 'Espresso',
                price: 0.75,
                description: 'Rich single shot of artisanal espresso.',
                category_name: 'Hot Coffee',
            },
            {
                id: 2,
                name: 'Americano',
                price: 0.75,
                description: 'Bold espresso diluted with hot water.',
                category_name: 'Hot Coffee',
            },
            {
                id: 3,
                name: 'Cappuccino',
                price: 1.0,
                description:
                    'Balanced espresso with a thick creamy foam crown.',
                category_name: 'Hot Coffee',
            },
            {
                id: 4,
                name: 'Latte',
                price: 0.75,
                description: 'Velvety steamed milk over bold espresso.',
                category_name: 'Hot Coffee',
            },
            {
                id: 5,
                name: 'Caramel Latte',
                price: 1.0,
                description:
                    'Smooth espresso latte infused with sweet caramel.',
                category_name: 'Hot Coffee',
            },
            {
                id: 6,
                name: 'Spanish Latte',
                price: 1.0,
                description:
                    'Espresso with condensed milk and creamy steamed milk.',
                category_name: 'Hot Coffee',
            },
        ],
    },
    {
        key: 'hot-tea',
        label: 'Hot Tea',
        icon: Leaf,
        products: [
            {
                id: 7,
                name: 'Somali Tea',
                price: 0.5,
                description:
                    'Traditional Somali spiced tea with milk and cardamom.',
                category_name: 'Hot Tea',
            },
            {
                id: 8,
                name: 'Qaxwo Somali',
                price: 0.5,
                description: 'Traditional Somali spiced coffee with ginger.',
                category_name: 'Hot Tea',
            },
            {
                id: 9,
                name: 'Hot Chocolate',
                price: 0.75,
                description: 'Rich and velvety warm hot chocolate.',
                category_name: 'Hot Tea',
            },
            {
                id: 10,
                name: 'Loos Tea',
                price: 0.75,
                description: 'Fresh loose leaf brewed tea.',
                category_name: 'Hot Tea',
            },
            {
                id: 11,
                name: 'Green Tea',
                price: 0.5,
                description: 'Steamed antioxidant-rich soothing green tea.',
                category_name: 'Hot Tea',
            },
            {
                id: 12,
                name: 'Shaax Daqar',
                price: 0.75,
                description: 'Specialty spiced traditional Somali tea.',
                category_name: 'Hot Tea',
            },
        ],
    },
    {
        key: 'boba-tea',
        label: 'Boba Tea',
        icon: CupSoda,
        products: [
            {
                id: 13,
                name: 'Blueberry With Boba',
                price: 1.75,
                description: 'Blueberry milk tea with chewy tapioca pearls.',
                category_name: 'Boba Tea',
            },
            {
                id: 14,
                name: 'Mango With Boba',
                price: 1.75,
                description: 'Sweet tropical mango milk tea with boba pearls.',
                category_name: 'Boba Tea',
            },
            {
                id: 15,
                name: 'Vanilla Milk Boba',
                price: 1.75,
                description: 'Creamy vanilla milk tea with chewy pearls.',
                category_name: 'Boba Tea',
            },
            {
                id: 16,
                name: 'Strawberry Milk Boba',
                price: 1.75,
                description: 'Fresh strawberry milk tea with boba.',
                category_name: 'Boba Tea',
            },
            {
                id: 17,
                name: 'Lotus Milk Boba',
                price: 1.75,
                description:
                    'Lotus Biscoff flavored milk tea with boba pearls.',
                category_name: 'Boba Tea',
            },
            {
                id: 18,
                name: 'Chocolate Milk Boba',
                price: 1.75,
                description: 'Decadent chocolate milk tea with tapioca pearls.',
                category_name: 'Boba Tea',
            },
        ],
    },
    {
        key: 'cold-drinks',
        label: 'Cold Drinks',
        icon: Sparkles,
        products: [
            {
                id: 19,
                name: 'Iced Americano',
                price: 1.0,
                description: 'Chilled espresso poured over iced water.',
                category_name: 'Cold Drinks',
            },
            {
                id: 20,
                name: 'Latte Ice Coffee',
                price: 1.0,
                description: 'Iced espresso with cold fresh velvety milk.',
                category_name: 'Cold Drinks',
            },
            {
                id: 21,
                name: 'Caramel Iced Latte',
                price: 1.25,
                description: 'Iced latte infused with golden caramel syrup.',
                category_name: 'Cold Drinks',
            },
            {
                id: 22,
                name: 'Iced Matcha',
                price: 1.5,
                description: 'Chilled Japanese matcha green tea latte.',
                category_name: 'Cold Drinks',
            },
            {
                id: 23,
                name: 'Strawberry Matcha',
                price: 1.5,
                description: 'Layered iced matcha with sweet strawberry puree.',
                category_name: 'Cold Drinks',
            },
            {
                id: 24,
                name: 'Chocolate Latte',
                price: 1.25,
                description: 'Iced mocha latte with rich chocolate swirl.',
                category_name: 'Cold Drinks',
            },
        ],
    },
    {
        key: 'shakes',
        label: 'Shakes',
        icon: Milk,
        products: [
            {
                id: 25,
                name: 'Banana Shake',
                price: 1.0,
                description: 'Freshly blended creamy banana shake.',
                category_name: 'Shakes',
            },
            {
                id: 26,
                name: 'Mango Shake',
                price: 1.25,
                description: 'Sweet ripe tropical mango fruit shake.',
                category_name: 'Shakes',
            },
            {
                id: 27,
                name: 'Timir Milk Shake',
                price: 1.0,
                description: 'Traditional sweet Somali date (timir) milkshake.',
                category_name: 'Shakes',
            },
            {
                id: 28,
                name: 'Vanilla Milkshake',
                price: 1.25,
                description: 'Classic rich vanilla bean milkshake.',
                category_name: 'Shakes',
            },
            {
                id: 29,
                name: 'Strawberry Milkshake',
                price: 1.25,
                description: 'Fresh strawberry creamy blended milkshake.',
                category_name: 'Shakes',
            },
            {
                id: 30,
                name: 'Lotus Milkshake',
                price: 1.25,
                description: 'Lotus Biscoff cookie butter milkshake.',
                category_name: 'Shakes',
            },
        ],
    },
];

const FEATURES = [
    {
        icon: Award,
        title: 'Premium Quality',
        desc: 'We use the best coffee beans and high-quality ingredients.',
    },
    {
        icon: Coffee,
        title: 'Freshly Made',
        desc: 'Every drink is freshly prepared just for you.',
    },
    {
        icon: Heart,
        title: 'Made With Love',
        desc: 'We put love in every drink we make.',
    },
    {
        icon: Smile,
        title: 'Great Taste',
        desc: 'Delicious drinks that make your day better.',
    },
    {
        icon: Zap,
        title: 'Fast Service',
        desc: 'Quick & friendly service, always with a smile.',
    },
];

const getCategoryIcon = (name: string): LucideIcon => {
    const lower = name.toLowerCase();

    if (lower.includes('all')) {
        return Sparkles;
    }

    if (lower.includes('coffee')) {
        return Coffee;
    }

    if (lower.includes('tea') && !lower.includes('boba')) {
        return Leaf;
    }

    if (lower.includes('boba')) {
        return CupSoda;
    }

    if (lower.includes('shake')) {
        return Milk;
    }

    return Sparkles;
};

const getProductImage = (name: string, index: number): string => {
    const lower = name.toLowerCase();

    if (lower.includes('boba') || lower.includes('milk tea') || lower.includes('blueberry') || lower.includes('mango') || lower.includes('strawberry') || lower.includes('lotus') || lower.includes('vanilla milk')) {
        return '/images/boba_drink.jpg';
    }

    if (lower.includes('chocolate') || lower.includes('cocoa') || lower.includes('mocha')) {
        return '/images/iced-chocolate.jpg';
    }

    if (lower.includes('shake') || lower.includes('milkshake')) {
        return '/images/drink-item-1.jpg';
    }

    if (lower.includes('iced') || lower.includes('cold') || lower.includes('caramel') || lower.includes('matcha')) {
        return '/images/iced_coffee.jpg';
    }

    const fallbacks = [
        '/images/drink-item-0.jpg',
        '/images/drink-item-1.jpg',
        '/images/boba_drink.jpg',
        '/images/iced_coffee.jpg',
    ];

    return fallbacks[index % fallbacks.length];
};

export default function Welcome({
    categories = [],
    products = [],
}: WelcomeProps) {
    // Filter active categories that actually have products
    const activeCategoriesList = useMemo(() => {
        if (categories && categories.length > 0) {
            return categories.filter(
                (c) => c.products && c.products.length > 0,
            );
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
                })),
            );
        }

        return FALLBACK_CATEGORIES.flatMap((c) => c.products);
    }, [products, activeCategoriesList]);

    // Build categories list including "All" tab
    const categoryTabs = useMemo(() => {
        const tabs = [
            {
                key: 'all',
                label: 'All Drinks',
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
    const [selectedCategoryKey, setSelectedCategoryKey] =
        useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [currentStorySlide, setCurrentStorySlide] = useState(0);
    const [activeSection, setActiveSection] = useState<string>('home');

    // Auto-advance Our Story slideshow every 4.5 seconds    
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentStorySlide((prev) => (prev + 1) % STORY_SLIDES.length);
        }, 4500);
        return () => clearInterval(timer);
    }, []);

    // Track active section for nav underline using IntersectionObserver
    useEffect(() => {
        // Map nav ids to the actual DOM element ids (home -> hero-section)
        const sectionMap: Record<string, string> = {
            home: 'hero-section',
            menu: 'menu',
            about: 'about',
            why: 'why',
            gallery: 'gallery',
            contact: 'contact',
        };
        const observers: IntersectionObserver[] = [];

        Object.entries(sectionMap).forEach(([navId, domId]) => {
            const el = document.getElementById(domId);
            if (!el) { return; }
            const obs = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setActiveSection(navId);
                    }
                },
                { threshold: 0.15, rootMargin: '-68px 0px 0px 0px' },
            );
            obs.observe(el);
            observers.push(obs);
        });

        return () => observers.forEach((obs) => obs.disconnect());
    }, []);

    // Filter products based on selected tab and search query
    const filteredProducts = useMemo(() => {
        let list = allProducts;

        if (selectedCategoryKey !== 'all') {
            if (activeCategoriesList.length > 0) {
                const cat = activeCategoriesList.find(
                    (c) => String(c.id) === selectedCategoryKey,
                );
                list = cat ? cat.products : allProducts;
            } else {
                const fallback = FALLBACK_CATEGORIES.find(
                    (c) => c.key === selectedCategoryKey,
                );
                list = fallback ? fallback.products : allProducts;
            }
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            list = list.filter(
                (p) =>
                    p.name.toLowerCase().includes(query) ||
                    (p.description &&
                        p.description.toLowerCase().includes(query)) ||
                    (p.category_name &&
                        p.category_name.toLowerCase().includes(query)),
            );
        }

        return list;
    }, [selectedCategoryKey, allProducts, activeCategoriesList, searchQuery]);

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
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '24px',
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
                    .landing-root .menu-product-list {
                        scrollbar-width: none;
                        -ms-overflow-style: none;
                    }
                    .landing-root .menu-product-list::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
                {/* =====================================================
                    TOP BAR + STICKY HEADER (both stick together on scroll)
                ===================================================== */}
                <div className="sticky top-0 z-40">
                {/* TOP BAR */}
                <div className="border-b border-[#3c2114] bg-[#28160d] text-[13px] text-[#fff5ea]">
                    <div className="mx-auto flex h-[40px] w-[98%] max-w-[1560px] items-center justify-between">
                        <a
                            href="https://maps.app.goo.gl/mgdrY1B7E9TerDbEA?g_st=awb"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 font-normal text-[#f5ebd9] no-underline transition hover:text-[#e5c78d]"
                        >
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#e5c78d]" />
                            <span className="text-[12px] sm:text-[13px]">
                                Dahablaha Bakaro Market, Mogadishu
                            </span>
                        </a>

                        <div className="flex items-center gap-4 sm:gap-6">
                            {/* Social Icons */}
                            <div className="hidden items-center gap-2 sm:flex">
                                <a
                                    href="https://www.facebook.com/share/1DpFNEB23K/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-white/10 text-[11px] font-bold text-white transition duration-200 hover:bg-white hover:text-[#28160d]"
                                    aria-label="Facebook"
                                >
                                    f
                                </a>
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-white/10 text-[11px] font-bold text-white transition duration-200 hover:bg-white hover:text-[#28160d]"
                                    aria-label="Instagram"
                                >
                                    ◎
                                </a>
                                <a
                                    href="https://tiktok.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-white/10 text-[11px] font-bold text-white transition duration-200 hover:bg-white hover:text-[#28160d]"
                                    aria-label="TikTok"
                                >
                                    ♪
                                </a>
                            </div>

                            {/* Phone */}
                            <a
                                href="tel:+252613399977"
                                className="flex items-center gap-1.5 text-[12px] text-[#f5ebd9] transition hover:text-[#e5c78d] sm:text-[13px]"
                            >
                                <Phone className="h-3.5 w-3.5 text-[#e5c78d]" />
                                <span>+252 61 3399977</span>
                            </a>
                        </div>
                    </div>
                </div>
                {/* =====================================================
                    STICKY HEADER & NAV
                ===================================================== */}
                <header className="border-b border-[#eaded3] bg-[#fffaf5]/95 backdrop-blur-md">
                    <div className="mx-auto flex h-[60px] w-[98%] max-w-[1560px] items-center justify-between sm:h-[68px]">
                        {/* Logo */}
                        <a
                            href="#home"
                            className="group flex items-center no-underline"
                            aria-label="MaMa Café home"
                        >
                            <img
                                src="/images/hero/MaMaCaféCoffeehouseLogo.png"
                                alt="MaMa Café — Coffee, Boba, Ice Chocolate"
                                className="h-[42px] sm:h-[50px] w-auto object-contain block"
                            />
                        </a>

                        {/* Desktop Navigation */}
                        <nav className="hidden items-center gap-7 text-[14px] font-medium text-[#2c180d] lg:flex">
                            {[
                                { id: 'home', label: 'Home' },
                                { id: 'menu', label: 'Menu' },
                                { id: 'about', label: 'About Us' },
                                { id: 'why', label: 'Why Choose Us' },
                                { id: 'gallery', label: 'Gallery' },
                                { id: 'contact', label: 'Contact' },
                            ].map(({ id, label }) => (
                                <a
                                    key={id}
                                    href={`#${id}`}
                                    className={[
                                        'border-b-2 py-2 transition hover:text-[#5b2d17]',
                                        activeSection === id
                                            ? 'border-[#5b2d17] font-semibold text-[#5b2d17]'
                                            : 'border-transparent',
                                    ].join(' ')}
                                >
                                    {label}
                                </a>
                            ))}
                        </nav>

                        {/* Header Actions - Staff Login button */}
                        <div className="flex items-center gap-3">
                            <Link
                                href={login()}
                                className="flex items-center gap-1.5 rounded-full bg-[#4b2512] px-4 py-2 text-[13px] font-semibold text-white shadow-xs transition hover:scale-[1.02] hover:bg-[#391b0c] active:scale-95 sm:px-5"
                            >
                                <span>Order Now</span>
                                <ShoppingCart className="h-3.5 w-3.5" />
                            </Link>

                            {/* Mobile Hamburger Toggle */}
                            <button
                                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                                className="cursor-pointer p-1.5 text-[#3c1d0e] focus:outline-none lg:hidden"
                                aria-label="Toggle Navigation"
                            >
                                {mobileNavOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <MenuIcon className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation Dropdown */}
                    {mobileNavOpen && (
                        <div className="flex animate-in flex-col gap-2.5 border-b border-[#eaded3] bg-[#fffaf5] px-6 py-4 text-[14px] shadow-md slide-in-from-top-2 lg:hidden">
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
                                className="mt-1 border-t border-[#eaded3] py-2 text-[13px] font-semibold text-[#5b2d17]"
                            >
                                Order Now →
                            </Link>
                        </div>
                    )}
                </header>
                </div>
                <main id="home">
                    {/* =====================================================
                        HERO SECTION — heroSection.png image under Header 2
                    ===================================================== */}
                    <section id="hero-section" className="relative w-full bg-[#FAF0E4]">
                        <img   
                            src="/images/hero/heroSection.png"
                            alt="MaMa Café Hero Section — Coffee, Boba, Ice Chocolate"
                            className="w-full block"
                            style={{ height: 'auto', minHeight: '420px', objectFit: 'cover', objectPosition: 'center top' }}
                        />
                    </section>

                    {/* =====================================================
                        MENU & WHY CHOOSE SECTION
                    ===================================================== */}
                    <section id="menu" className="py-10 sm:py-14">
                        <div className="mx-auto w-[98%] max-w-[1560px]">
                            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
                                {/* =================================================
                                    LEFT — OUR MENU (5 Categories + menu-strip.jpg)
                                ================================================= */}
                                <div className="flex flex-col lg:col-span-6">
                                    {/* MENU HEADER */}
                                    <div className="mb-3.5 flex items-end justify-between">
                                        <div>
                                            <h2 className="brand-heading m-0 flex items-center gap-2 text-[22px] leading-tight font-bold text-[#2c180d] sm:text-[28px]">
                                                <span>Our Menu</span>
                                                <Leaf className="h-5 w-5 sm:h-6 sm:w-6 text-[#3c1d0c] inline-block -translate-y-0.5" />
                                            </h2>
                                        </div>

                                        <a
                                            href="#menu"
                                            className="flex items-center gap-1.5 border-b border-[#6b4229] pb-1 text-[11px] font-semibold text-[#3d2112] transition hover:text-[#7a4e32] sm:text-[12px]"
                                        >
                                            <span>View Full Menu</span>
                                            <ArrowRight className="h-3.5 w-3.5" />
                                        </a>
                                    </div>

                                    {/* 5 Category Buttons (Interactive Selectable + Hover Dark Pill Style) */}
                                    <div className="mb-4 flex flex-wrap items-center gap-2 sm:gap-2.5">
                                        {FALLBACK_CATEGORIES.map((cat) => {
                                            const isActive = selectedCategoryKey === cat.key;
                                            const CatIcon = cat.icon;

                                            return (
                                                <button
                                                    key={cat.key}
                                                    type="button"
                                                    onClick={() => setSelectedCategoryKey(cat.key)}
                                                    className={`flex items-center gap-2 rounded-[14px] px-3.5 py-2.5 text-[12px] font-bold transition-all duration-300 shadow-xs sm:px-4 sm:text-[13px] ${
                                                        isActive
                                                            ? 'bg-[#3c1d0c] text-white shadow-md scale-[1.02]'
                                                            : 'bg-[#fffaf5] border border-[#eadfd6] text-[#3c1d0c] hover:bg-[#3c1d0c] hover:text-white'
                                                    }`}
                                                >
                                                    <CatIcon className="h-4 w-4 shrink-0" />
                                                    <span>{cat.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* menu-strip.jpg image (Full view under 5 category tabs) */}
                                    <div className="overflow-hidden rounded-[20px] border border-[#eadfd6] shadow-md transition-transform duration-300 hover:shadow-lg">
                                        <img
                                            src="/images/hero/menu-strip.jpg"
                                            alt="MaMa Café Signature Menu Strip"
                                            className="h-auto w-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* =================================================
                                    RIGHT — WHY CHOOSE MAMA CAFÉ
                                ================================================= */}
                                <div
                                    id="why"
                                    className="relative overflow-hidden rounded-[20px] border border-[#3d2012]/10 shadow-lg lg:col-span-6 self-start"
                                >
                                    <img
                                        src="/images/hero/whyMamaCafe.png"
                                        alt="Why Choose MaMa Café"
                                        className="h-auto w-full block rounded-[20px] object-contain"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* =====================================================
                        ABOUT US / OUR STORY SECTION (3 SLIDES ANIMATED CAROUSEL)
                    ===================================================== */}
                    <section className="relative overflow-hidden bg-[#f4e6d8] py-14 sm:py-18" id="about">
                        <div className="mx-auto w-[98%] max-w-[1560px]">
                            {/* Slideshow Container */}
                            <div className="relative overflow-hidden rounded-[24px] bg-[#fffaf5] p-6 shadow-md sm:p-10">
                                <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
                                    {/* Left Text */}
                                    <div className="transition-all duration-500 lg:col-span-7">
                                        <div className="inline-block rounded-full bg-[#4b2512]/10 px-3 py-1 text-[11px] font-bold tracking-widest text-[#4b2512] uppercase">
                                            {STORY_SLIDES[currentStorySlide].badge}
                                        </div>
                                        <h2 className="brand-heading my-3 text-[22px] leading-tight font-bold text-[#2c180d] sm:text-[28px]">
                                            {STORY_SLIDES[currentStorySlide].title}
                                        </h2>
                                        <p className="text-[13px] leading-relaxed text-[#553b2c] sm:text-[14px]">
                                            {STORY_SLIDES[currentStorySlide].paragraph1}
                                        </p>
                                        <p className="mt-2 mb-5 text-[13px] leading-relaxed text-[#553b2c] sm:text-[14px]">
                                            {STORY_SLIDES[currentStorySlide].paragraph2}
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <a
                                                href="#contact"
                                                className="inline-flex items-center gap-1.5 rounded-full bg-[#4a2411] px-5 py-2.5 text-[13px] font-semibold text-white shadow-xs transition hover:scale-[1.02] hover:bg-[#34180a]"
                                            >
                                                <span>Visit Us</span>
                                                <ArrowRight className="h-3.5 w-3.5" />
                                            </a>
                                        </div>
                                    </div>

                                    {/* Right Slide Image */}
                                    <div className="relative flex min-h-[260px] items-center justify-center overflow-hidden rounded-[20px] bg-gradient-to-br from-[#5b2d17] to-[#2c160d] p-6 shadow-sm lg:col-span-5">
                                        <img
                                            src={STORY_SLIDES[currentStorySlide].image}
                                            alt={STORY_SLIDES[currentStorySlide].title}
                                            className="h-[220px] w-auto max-w-full object-contain drop-shadow-xl transition-all duration-700 ease-in-out"
                                        />
                                    </div>
                                </div>

                                {/* Carousel Controls (Arrows + Dots) */}
                                <div className="mt-6 flex items-center justify-between border-t border-[#eaded3] pt-4">
                                    {/* Indicator Dots */}
                                    <div className="flex items-center gap-2">
                                        {STORY_SLIDES.map((_, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => setCurrentStorySlide(idx)}
                                                className={`h-2.5 rounded-full transition-all duration-300 ${
                                                    currentStorySlide === idx
                                                        ? 'w-7 bg-[#4a2411]'
                                                        : 'w-2.5 bg-[#d8c2b2] hover:bg-[#a07c65]'
                                                }`}
                                                aria-label={`Go to slide ${idx + 1}`}
                                            />
                                        ))}
                                    </div>

                                    {/* Prev / Next Arrows */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setCurrentStorySlide(
                                                    (prev) => (prev - 1 + STORY_SLIDES.length) % STORY_SLIDES.length,
                                                )
                                            }
                                            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d8c2b2] bg-white text-[#4a2411] transition hover:bg-[#4a2411] hover:text-white"
                                            aria-label="Previous Slide"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setCurrentStorySlide((prev) => (prev + 1) % STORY_SLIDES.length)}
                                            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d8c2b2] bg-white text-[#4a2411] transition hover:bg-[#4a2411] hover:text-white"
                                            aria-label="Next Slide"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* =====================================================
                        GALLERY SECTION (max-w-[1560px], Good Mood with cup cutout)
                    ===================================================== */}
                    <section
                        className="bg-[#fff7ef] py-14 sm:py-18"
                        id="gallery"
                    >
                        <div className="mx-auto w-[98%] max-w-[1560px]">
                            <div className="mb-5">
                                <p className="brand-heading m-0 text-[13px] font-semibold tracking-widest text-[#4b2512] uppercase">
                                    Gallery
                                </p>
                                <h2 className="brand-heading mt-0.5 text-[22px] leading-tight font-bold text-[#2c180d] sm:text-[28px]">
                                    Made to be enjoyed.
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="group relative h-[210px] overflow-hidden rounded-2xl shadow-xs">
                                    <img
                                        src="/images/drink-item-0.jpg"
                                        alt="Fresh Coffee"
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        onError={(e) => { e.currentTarget.src = '/images/coffee-bg.jpg'; }}
                                    />
                                    <span className="absolute bottom-3 left-3 rounded-full bg-[#fffaf4]/90 px-3 py-1 text-[12px] font-bold text-[#2c180d] shadow-xs backdrop-blur-xs">
                                        Fresh Coffee
                                    </span>
                                </div>

                                <div className="group relative h-[210px] overflow-hidden rounded-2xl shadow-xs">
                                    <img
                                        src="/images/boba_drink.jpg"
                                        alt="Boba Love"
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        onError={(e) => { e.currentTarget.src = '/images/boba-drink.jpg'; }}
                                    />
                                    <span className="absolute bottom-3 left-3 rounded-full bg-[#fffaf4]/90 px-3 py-1 text-[12px] font-bold text-[#2c180d] shadow-xs backdrop-blur-xs">
                                        Boba Love
                                    </span>
                                </div>

                                <div className="group relative h-[210px] overflow-hidden rounded-2xl shadow-xs">
                                    <img
                                        src="/images/iced-chocolate.jpg"
                                        alt="Ice Chocolate"
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        onError={(e) => { e.currentTarget.src = '/images/ice_chocolate.jpg'; }}
                                    />
                                    <span className="absolute bottom-3 left-3 rounded-full bg-[#fffaf4]/90 px-3 py-1 text-[12px] font-bold text-[#2c180d] shadow-xs backdrop-blur-xs">
                                        Ice Chocolate
                                    </span>
                                </div>

                                <div className="group relative h-[210px] overflow-hidden rounded-2xl shadow-xs">
                                    <img
                                        src="/images/iced_coffee.jpg"
                                        alt="Iced latte"
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        onError={(e) => { e.currentTarget.src = '/images/iced-chocolate.jpg'; }}
                                    />
                                    <span className="absolute bottom-3 left-3 rounded-full bg-[#fffaf4]/90 px-3 py-1 text-[12px] font-bold text-[#2c180d] shadow-xs backdrop-blur-xs">
                                        Iced Latte
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
                {/* =====================================================
    FOOTER
===================================================== */}
                <footer
                    className="bg-[#28160d] py-10 text-[#fff5ec]"
                    id="contact"
                >
                    <div className="mx-auto grid w-[98%] max-w-[1560px] grid-cols-1 gap-8 md:grid-cols-3 md:items-start">
                        {/* LEFT — BRAND */}
                        <div className="flex flex-col items-center text-center md:items-start md:text-left">
                            <img
                                src="/images/hero/MaMaCaféCoffeehouseLogo.png"
                                alt="MaMa Café — Coffee, Boba, Ice Chocolate"
                                className="h-[40px] sm:h-[46px] w-auto object-contain brightness-0 invert opacity-95 block"
                            />
                            <p className="mt-4 text-[11px] text-[#dfc9b8]/70">
                                © 2026 MaMa Café. Made with love in Mogadishu.
                            </p>
                        </div>

                        {/* CENTER — CONTACT */}
                        <div className="space-y-2 text-center text-[12px] text-[#f7dfc3]/80 md:text-left">
                            <a
                                href="tel:+252613399977"
                                className="flex items-center justify-center gap-2 transition hover:text-white md:justify-start"
                            >
                                <Phone className="h-3.5 w-3.5 shrink-0" />
                                <span>+252 61 3399977</span>
                            </a>

                            <a
                                href="https://wa.me/252613399977?text=Hello%20MaMa%20Cafe%2C%20I%20have%20an%20inquiry."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 transition hover:text-white md:justify-start"
                            >
                                <MessageCircle className="h-3.5 w-3.5 shrink-0" />
                                <span>Chat with us on WhatsApp</span>
                            </a>

                            <a
                                href="https://maps.app.goo.gl/mgdrY1B7E9TerDbEA?g_st=awb"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 text-[12px] text-[#f7dfc3]/80 no-underline transition hover:text-white md:justify-start"
                            >
                                <MapPin className="h-3.5 w-3.5 shrink-0 text-[#e5c78d]" />
                                <span>Dahablaha Bakaro Market, Mogadishu</span>
                            </a>
                        </div>

                        {/* RIGHT — MENU + COPYRIGHT */}
                        <div className="flex flex-col items-center text-center text-[12px] text-[#f7dfc3]/80 md:items-end md:text-right">
                            <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 md:justify-end">
                                <a
                                    href="#home"
                                    className="transition hover:text-white"
                                >
                                    Home
                                </a>

                                <a
                                    href="#menu"
                                    className="transition hover:text-white"
                                >
                                    Menu
                                </a>

                                <a
                                    href="#about"
                                    className="transition hover:text-white"
                                >
                                    About Us
                                </a>

                                <Link
                                    href={login()}
                                    className="underline transition hover:text-white"
                                >
                                    Order Now
                                </Link>
                            </nav>
                        </div>
                    </div>
                </footer>

                {/* =====================================================
                    FIXED WHATSAPP BUTTON (Lucide Icon)
                ===================================================== */}
                <div className="fixed right-5 bottom-5 z-40">
                    <a
                        href="https://wa.me/252613399977?text=Hello%20MaMa%20Cafe%2C%20I%20have%20an%20inquiry."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-full border border-[#d8a16f]/40 bg-[#2a160d] px-4 py-2.5 text-[13px] font-semibold text-white shadow-[0_6px_20px_rgba(0,0,0,0.22)] transition-all duration-300 hover:scale-105 hover:bg-[#1a0c06]"
                    >
                        <MessageCircle className="h-4 w-4 fill-current text-green-400" />
                        <span>Chat on WhatsApp</span>
                    </a>
                </div>
            </div>
        </>
    );
}
