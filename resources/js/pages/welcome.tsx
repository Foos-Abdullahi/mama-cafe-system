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
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { login } from '@/routes';

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

type NavigationSection =
    'home' | 'menu' | 'about' | 'why' | 'gallery' | 'contact';

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

    if (lower.includes('boba')) {
        return '/images/boba_drink.jpg';
    }

    if (lower.includes('chocolate') || lower.includes('cocoa')) {
        return '/images/iced-chocolate.jpg';
    }

    const fallbacks = [
        '/images/drink-item-0.jpg',
        '/images/drink-item-1.jpg',
        '/images/drink-item-2.jpg',
        '/images/boba_drink.jpg',
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
    const [activeNavigation, setActiveNavigation] =
        useState<NavigationSection | null>(null);

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
                    TOP BAR (Modern, Compact, Professional - max-w-6xl)
                ===================================================== */}
                <div className="hidden border-b border-[#3c2114] bg-[#28160d] text-[13px] text-[#fff5ea]">
                    <div className="mx-auto flex h-[40px] w-[92%] max-w-6xl items-center justify-between">
                        <div className="flex items-center gap-2 font-normal text-[#f5ebd9]">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#e5c78d]" />
                            <span className="text-[12px] sm:text-[13px]">
                                Dahablaha Bakaro Market, Mogadishu
                            </span>
                        </div>

                        <div className="flex items-center gap-4 sm:gap-6">
                            {/* Social Icons */}
                            <div className="hidden items-center gap-2 sm:flex">
                                <a
                                    href="https://facebook.com"
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

                            {/* Staff Sign In */}
                            <Link
                                href={login()}
                                className="hidden rounded-full border border-[#f5ebd9]/30 px-2.5 py-0.5 text-[11px] font-medium text-[#f5ebd9]/90 transition hover:border-white hover:text-white md:inline-block"
                            >
                                Order Now
                            </Link>
                        </div>
                    </div>
                </div>
                {/* =====================================================
                    STICKY HEADER & NAV (max-w-6xl, Staff Login button)
                ===================================================== */}
                <header className="sticky top-0 z-40 hidden border-b border-[#eaded3] bg-[#fffaf5]/95 backdrop-blur-md">
                    <div className="mx-auto flex h-[60px] w-[92%] max-w-6xl items-center justify-between sm:h-[68px]">
                        {/* Logo */}
                        <a
                            href="#home"
                            className="group flex flex-col leading-none text-[#2c180d] no-underline"
                            aria-label="MaMa Café home"
                        >
                            <span className="brand-heading flex items-center gap-1.5 text-[22px] font-bold tracking-tight text-[#2c180d] sm:text-[24px]">
                                MaMa Café
                                <Coffee className="inline h-4 w-4 -translate-y-0.5 text-[#5b2d17]" />
                            </span>
                            <small className="mt-0.5 text-[9px] font-bold tracking-[0.2em] text-[#5b2d17]">
                                COFFEE · BOBA · ICE CHOCOLATE
                            </small>
                        </a>

                        {/* Desktop Navigation */}
                        <nav className="hidden items-center gap-7 text-[14px] font-medium text-[#2c180d] lg:flex">
                            <a
                                href="#home"
                                className="border-b-2 border-[#5b2d17] py-2 font-semibold transition hover:text-[#5b2d17]"
                            >
                                Home
                            </a>
                            <a
                                href="#menu"
                                className="border-b-2 border-transparent py-2 transition hover:text-[#5b2d17]"
                            >
                                Menu
                            </a>
                            <a
                                href="#about"
                                className="border-b-2 border-transparent py-2 transition hover:text-[#5b2d17]"
                            >
                                About Us
                            </a>
                            <a
                                href="#why"
                                className="border-b-2 border-transparent py-2 transition hover:text-[#5b2d17]"
                            >
                                Why Choose Us
                            </a>
                            <a
                                href="#gallery"
                                className="border-b-2 border-transparent py-2 transition hover:text-[#5b2d17]"
                            >
                                Gallery
                            </a>
                            <a
                                href="#contact"
                                className="border-b-2 border-transparent py-2 transition hover:text-[#5b2d17]"
                            >
                                Contact
                            </a>
                        </nav>

                        {/* Header Actions - Staff Login button */}
                        <div className="flex items-center gap-3">
                            <Link
                                href={login()}
                                className="flex items-center gap-1.5 rounded-full bg-[#4b2512] px-4 py-2 text-[13px] font-semibold text-white shadow-xs transition hover:scale-[1.02] hover:bg-[#391b0c] active:scale-95 sm:px-5"
                            >
                                <span>Order Now</span>
                                <ArrowRight className="h-3.5 w-3.5" />
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
                <main id="home">
                    <section className="relative">
                        <img
                            src="/images/mama-cafe-home-header.jpeg"
                            alt=""
                            className="block h-auto w-full"
                        />

                        <nav aria-label="Main navigation">
                            <span
                                aria-hidden="true"
                                className="absolute top-[15.2%] left-[34.3%] h-[0.45%] w-[3.2%] bg-[#f9efe4]"
                            />
                            <a
                                href="#home"
                                onClick={() => setActiveNavigation('home')}
                                className="absolute top-[6.6%] left-[34%] h-[12%] w-[5.5%]"
                                aria-label="Home"
                            />
                            <a
                                href="#menu"
                                onClick={() => setActiveNavigation('menu')}
                                className="absolute top-[6.6%] left-[40%] h-[12%] w-[5.5%]"
                                aria-label="Menu"
                            />
                            <a
                                href="#about"
                                onClick={() => setActiveNavigation('about')}
                                className="absolute top-[6.6%] left-[46%] h-[12%] w-[7%]"
                                aria-label="About Us"
                            />
                            <a
                                href="#why"
                                onClick={() => setActiveNavigation('why')}
                                className="absolute top-[6.6%] left-[53%] h-[12%] w-[10%]"
                                aria-label="Why Choose Us"
                            />
                            <a
                                href="#gallery"
                                onClick={() => setActiveNavigation('gallery')}
                                className="absolute top-[6.6%] left-[63%] h-[12%] w-[7%]"
                                aria-label="Gallery"
                            />
                            <a
                                href="#contact"
                                onClick={() => setActiveNavigation('contact')}
                                className="absolute top-[6.6%] left-[70%] h-[12%] w-[7%]"
                                aria-label="Contact"
                            />
                            <a
                                href="tel:+252613399977"
                                className="absolute top-0 left-[84%] h-[6.4%] w-[13%]"
                                aria-label="Call MaMa Café on +252 61 3399977"
                            />
                            <Link
                                href={login()}
                                className="absolute top-[7%] left-[83%] h-[10%] w-[12%]"
                                aria-label="Order Now"
                            />
                            {activeNavigation &&
                                activeNavigation !== 'home' && (
                                    <span
                                        aria-hidden="true"
                                        className="absolute top-[15.2%] h-[0.45%] bg-[#5b2d17]"
                                        style={{
                                            left: {
                                                menu: '40.3%',
                                                about: '46.3%',
                                                why: '54.0%',
                                                gallery: '64.0%',
                                                contact: '70.4%',
                                            }[activeNavigation],
                                            width: {
                                                menu: '2.6%',
                                                about: '4.4%',
                                                why: '7.2%',
                                                gallery: '3.7%',
                                                contact: '4.1%',
                                            }[activeNavigation],
                                        }}
                                    />
                                )}
                            {activeNavigation === 'home' && (
                                <span
                                    aria-hidden="true"
                                    className="absolute top-[15.2%] left-[34.3%] h-[0.45%] w-[3.2%] bg-[#5b2d17]"
                                />
                            )}
                        </nav>
                    </section>

                    {/* =====================================================
                        HERO SECTION (Seamless #EECAA5 and #FBEFE0 gradient)
                    ===================================================== */}
                    <section className="relative hidden overflow-hidden bg-[radial-gradient(ellipse_at_70%_50%,#EECAA5_0%,#F6DFCA_45%,#FBEFE0_100%)] py-12 lg:py-16">
                        {/* Soft decorative leaf contours */}
                        <div className="pointer-events-none absolute top-6 right-0 h-[50px] w-[100px] rotate-[-25deg] rounded-[100%_0_100%_0] border border-[#d8a16f]/40" />
                        <div className="pointer-events-none absolute bottom-12 -left-6 h-[50px] w-[100px] rotate-[40deg] rounded-[100%_0_100%_0] border border-[#d8a16f]/40" />

                        <div className="mx-auto grid w-[92%] max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
                            {/* Hero Copy (Left) */}
                            <div className="z-10 flex flex-col items-start lg:col-span-5 xl:col-span-5">
                                <p
                                    className="fresh-drinks-text mb-2 inline-block rounded-full bg-[#4a2411] px-3.5 py-1.5 tracking-wide uppercase shadow-xs"
                                    style={{
                                        fontFamily:
                                            '"Roboto Variable", Roboto, "Helvetica Neue", Helvetica, sans-serif',
                                        fontStyle: 'normal',
                                        fontWeight: 400,
                                        fontSize: '16px',
                                        lineHeight: '16px',
                                        color: 'rgb(250, 250, 250)',
                                    }}
                                >
                                    Fresh Drinks, Good Mood ♥
                                </p>

                                <h1 className="brand-heading my-2 text-[48px] leading-[0.88] tracking-tight text-[#2c180d] sm:text-[60px] lg:text-[68px]">
                                    MaMa
                                    <br />
                                    <em className="ml-6 font-normal italic sm:ml-10">
                                        Café
                                    </em>
                                </h1>

                                {/* Ribbon */}
                                <div className="mt-3 inline-block">
                                    <div
                                        className="bg-[#542713] px-5 py-1.5 text-[10px] font-bold tracking-[0.18em] text-white shadow-xs"
                                        style={{
                                            clipPath:
                                                'polygon(3% 0, 97% 0, 100% 50%, 97% 100%, 3% 100%, 0 50%)',
                                        }}
                                    >
                                        COFFEE &nbsp;•&nbsp; BOBA &nbsp;•&nbsp;
                                        ICE CHOCOLATE
                                    </div>
                                </div>

                                <p className="my-3 max-w-sm text-[13px] leading-relaxed text-[#553b2c] sm:text-[14px]">
                                    Made with love, served with happiness.
                                    <br />
                                    Every drink is freshly prepared just for
                                    you.
                                </p>

                                {/* CTA Buttons */}
                                <div className="mt-1 flex flex-wrap items-center gap-3">
                                    <a
                                        href="#menu"
                                        className="flex items-center gap-1.5 rounded-full bg-[#4a2411] px-5 py-2 text-[13px] font-semibold text-white shadow-xs transition hover:scale-[1.02] hover:bg-[#34180a] active:scale-95"
                                    >
                                        <Coffee className="h-3.5 w-3.5" />
                                        <span>Explore Menu</span>
                                    </a>

                                    <a
                                        href="#about"
                                        className="flex items-center gap-1.5 rounded-full border border-[#32190d] bg-[#fffaf5] px-5 py-2 text-[13px] font-semibold text-[#32190d] transition hover:scale-[1.02] hover:bg-[#f7efe6] active:scale-95"
                                    >
                                        <Play className="h-3 w-3 fill-current" />
                                        <span>Our Story</span>
                                    </a>
                                </div>
                            </div>

                            {/* Hero Visual (Right) - Transparent Background, Medium-Large sizing */}
                            <div className="flex items-center justify-center lg:col-span-7 xl:col-span-7">
                                <div className="relative w-full max-w-[640px] lg:max-w-[700px]">
                                    <img
                                        src="/images/hero-drinks-clean.png"
                                        alt="MaMa Café Signature Drinks"
                                        className="h-auto w-full object-contain drop-shadow-md transition-transform duration-500 hover:scale-[1.02]"
                                        onError={(e) => {
                                            (
                                                e.currentTarget as HTMLImageElement
                                            ).src =
                                                '/images/hero-drinks-banner.jpg';
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* =====================================================
                        QUALITY BADGES (5 PILL FLOATING BAR - max-w-6xl)
                    ===================================================== */}
                    <div className="relative z-20 mx-auto -mt-5 hidden w-[92%] max-w-6xl sm:-mt-7">
                        <div className="grid grid-cols-1 gap-3 rounded-[20px] border border-[#eaded3] bg-[#fffaf5]/95 p-3.5 shadow-[0_8px_25px_rgba(70,35,15,0.06)] backdrop-blur-xs sm:grid-cols-2 sm:p-5 lg:grid-cols-5 lg:gap-0">
                            {FEATURES.map((item, index) => {
                                const IconComponent = item.icon;

                                return (
                                    <div
                                        key={item.title}
                                        className={`flex items-center gap-3 px-2.5 py-1 ${
                                            index !== FEATURES.length - 1
                                                ? 'lg:border-r lg:border-dotted lg:border-[#bfa795]'
                                                : ''
                                        }`}
                                    >
                                        <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-[#4a2411] text-white shadow-xs">
                                            <IconComponent className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <strong className="block text-[13px] font-bold text-[#2c180d] sm:text-[14px]">
                                                {item.title}
                                            </strong>
                                            <p className="mt-0.5 text-[11.5px] leading-tight text-[#725f53]">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    {/* =====================================================
    MENU SECTION
===================================================== */}
                    <section id="menu" className="py-14 sm:py-18">
                        <div className="mx-auto w-[92%] max-w-6xl">
                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
                                {/* =================================================
                LEFT — OUR MENU
            ================================================= */}
                                <div className="flex min-h-0 flex-col lg:col-span-7 lg:h-[520px]">
                                    {/* MENU HEADER */}
                                    <div className="mb-3 flex shrink-0 items-end justify-between">
                                        <div>
                                            <h2 className="brand-heading m-0 text-[22px] leading-tight font-bold text-[#2c180d] sm:text-[28px]">
                                                Our Menu
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

                                    {/* =================================================
                    CATEGORY TABS
                    Horizontal scrolling
                ================================================= */}
                                    {/* Categories */}
                                    <div className="menu-category-scroll mb-3 w-full overflow-x-auto">
                                        <div className="flex w-max min-w-full gap-2 rounded-[16px] border border-[#eadfd6]/80 bg-white/45 p-2 pb-2 pl-3 shadow-[0_8px_22px_rgba(84,49,28,0.06)] backdrop-blur-md">
                                            {categoryTabs
                                                .filter(
                                                    (cat) => cat.key !== 'all',
                                                )
                                                .map((cat) => {
                                                    const isActive =
                                                        selectedCategoryKey ===
                                                        cat.key;
                                                    const CatIcon = cat.icon;

                                                    return (
                                                        <button
                                                            key={cat.key}
                                                            type="button"
                                                            title={cat.label}
                                                            onClick={() =>
                                                                setSelectedCategoryKey(
                                                                    cat.key,
                                                                )
                                                            }
                                                            className={`flex w-[112px] shrink-0 items-center justify-center gap-1.5 rounded-[11px] border px-2.5 py-2.5 text-[11px] font-semibold transition sm:w-[120px] sm:text-[12px] ${
                                                                isActive
                                                                    ? 'border-[#4a2411] bg-[#4a2411] text-white shadow-[0_6px_14px_rgba(70,35,15,0.16)]'
                                                                    : 'border-[#eadfd6] bg-white/55 text-[#3d2112] hover:border-[#bfa795] hover:bg-white/75'
                                                            }`}
                                                        >
                                                            <CatIcon className="h-3.5 w-3.5 shrink-0" />

                                                            <span className="truncate whitespace-nowrap">
                                                                {cat.label}
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                        </div>
                                    </div>

                                    {/* =================================================
                    PRODUCT GRID

                    Mobile  : 2 columns
                    Tablet  : 3 columns
                    Desktop : 4 columns

                    Vertical scrolling is preserved.
                ================================================= */}
                                    <div className="menu-product-list grid min-h-0 flex-1 grid-cols-2 gap-3 overflow-y-auto pr-1 pb-1 sm:grid-cols-3 lg:grid-cols-4">
                                        {filteredProducts.length === 0 ? (
                                            /* EMPTY STATE */
                                            <div className="col-span-full flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#d8c2b2] bg-white/70 px-6 py-12 text-center">
                                                <Coffee className="mx-auto mb-2 h-9 w-9 text-[#a07c65] opacity-50" />

                                                <h4 className="brand-heading text-[16px] font-bold text-[#2c180d]">
                                                    No drinks found
                                                </h4>

                                                <p className="mx-auto mt-1 max-w-xs text-[12px] text-[#725f53]">
                                                    No drinks matched "
                                                    {searchQuery}".
                                                </p>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSearchQuery('');
                                                        setSelectedCategoryKey(
                                                            'all',
                                                        );
                                                    }}
                                                    className="mt-3 rounded-xl bg-[#4a2411] px-4 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#381b0c]"
                                                >
                                                    View All Drinks
                                                </button>
                                            </div>
                                        ) : (
                                            /* PRODUCT CARDS */
                                            filteredProducts.map(
                                                (item, index) => (
                                                    <article
                                                        key={
                                                            item.id || item.name
                                                        }
                                                        className="group relative flex min-h-[145px] flex-col overflow-hidden rounded-[14px] border border-[#eadfd6] bg-[#fffaf5] shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#c59e84] hover:shadow-lg"
                                                        title={item.name}
                                                    >
                                                        {/* PRODUCT IMAGE */}
                                                        <div className="relative h-[105px] w-full shrink-0 overflow-hidden bg-[#faf2ea]">
                                                            <img
                                                                src={
                                                                    item.image_url ||
                                                                    getProductImage(
                                                                        item.name,
                                                                        index,
                                                                    )
                                                                }
                                                                alt={item.name}
                                                                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                                                onError={(
                                                                    e,
                                                                ) => {
                                                                    e.currentTarget.src =
                                                                        '/images/drink-item-0.jpg';
                                                                }}
                                                            />
                                                        </div>

                                                        {/* PRODUCT NAME + PRICE */}
                                                        <div className="flex min-h-[42px] flex-1 items-center justify-between gap-2 px-2.5 py-2.5">
                                                            {/* ONE LINE NAME */}
                                                            <h3
                                                                title={
                                                                    item.name
                                                                }
                                                                className="brand-heading min-w-0 flex-1 truncate text-[12px] leading-tight font-semibold text-[#2c180d] transition-colors group-hover:text-[#823d21] sm:text-[13px]"
                                                            >
                                                                {item.name}
                                                            </h3>

                                                            {/* PRICE */}
                                                            <span className="shrink-0 text-[12px] font-bold text-[#4a2411] sm:text-[13px]">
                                                                $
                                                                {Number(
                                                                    item.price,
                                                                ).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    </article>
                                                ),
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* =================================================
                RIGHT — WHY CHOOSE MAMA CAFÉ

                Starts at same top as Our Menu.
                Image is NOT cropped.
                Natural aspect ratio is preserved.
            ================================================= */}
                                <div
                                    id="why"
                                    className="overflow-hidden bg-transparent lg:col-span-5"
                                >
                                    <img
                                        src="/images/why-cafe.jpg"
                                        alt="Why choose MaMa Café"
                                        className="h-55 w-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* =====================================================
                        ABOUT US SECTION (max-w-6xl)
                    ===================================================== */}
                    <section className="bg-[#f4e6d8] py-14 sm:py-18" id="about">
                        <div className="mx-auto w-[92%] max-w-6xl">
                            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
                                {/* Left Card */}
                                <div className="rounded-[22px] bg-[#fffaf5] p-6 shadow-xs sm:p-8 lg:col-span-7">
                                    <p className="brand-heading m-0 text-[13px] font-semibold tracking-widest text-[#4b2512] uppercase">
                                        Our Story
                                    </p>
                                    <h2 className="brand-heading my-2 text-[20px] leading-tight font-bold text-[#2c180d] sm:text-[26px]">
                                        A little cup of happiness, every day.
                                    </h2>
                                    <p className="mt-2 text-[13px] leading-relaxed text-[#553b2c]">
                                        MaMa Café is a warm neighborhood café
                                        serving fresh coffee, boba, ice
                                        chocolate, shakes and tea in the heart
                                        of Mogadishu.
                                    </p>
                                    <p className="mt-2 mb-4 text-[13px] leading-relaxed text-[#553b2c]">
                                        We believe a great drink should taste
                                        amazing, look beautiful and be served
                                        with a smile.
                                    </p>
                                    <a
                                        href="#contact"
                                        className="inline-flex items-center gap-1.5 rounded-full bg-[#4a2411] px-5 py-2 text-[13px] font-semibold text-white shadow-xs transition hover:scale-[1.02] hover:bg-[#34180a]"
                                    >
                                        <span>Visit Us</span>
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </a>
                                </div>

                                {/* Right Graphic Stamp */}
                                <div className="relative flex min-h-[260px] items-center justify-center overflow-hidden rounded-[22px] bg-gradient-to-br from-[#5b2d17] to-[#2c160d] p-6 shadow-xs lg:col-span-5">
                                    <div className="flex h-[160px] w-[160px] rotate-[-8deg] flex-col items-center justify-center rounded-full border-2 border-[#d8a16f] text-center text-[#f7dfc3] shadow-inner">
                                        <span className="brand-heading text-[32px] leading-none font-bold">
                                            MaMa
                                        </span>
                                        <small className="brand-heading text-[20px] leading-none">
                                            Café
                                        </small>
                                    </div>

                                    <div className="pointer-events-none absolute right-6 bottom-4 text-[#f7dfc3]/40">
                                        <Coffee className="h-12 w-12" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* =====================================================
                        GALLERY SECTION (max-w-6xl, Good Mood with cup cutout)
                    ===================================================== */}
                    <section
                        className="bg-[#fff7ef] py-14 sm:py-18"
                        id="gallery"
                    >
                        <div className="mx-auto w-[92%] max-w-6xl">
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
                    <div className="mx-auto grid w-[92%] max-w-6xl grid-cols-1 gap-8 md:grid-cols-3 md:items-start">
                        {/* LEFT — BRAND */}
                        <div className="flex flex-col items-center text-center md:items-start md:text-left">
                            <span className="brand-heading text-[20px] leading-none font-bold text-white">
                                MaMa Café
                            </span>

                            <small className="mt-1 text-[9px] font-bold tracking-[0.2em] text-[#d8a16f]">
                                COFFEE · BOBA · ICE CHOCOLATE
                            </small>
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

                            <div className="flex items-center justify-center gap-2 md:justify-start">
                                <MapPin className="h-3.5 w-3.5 shrink-0" />
                                <span>Dahablaha Bakaro Market, Mogadishu</span>
                            </div>
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
