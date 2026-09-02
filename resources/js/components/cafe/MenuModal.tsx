import React, { useState } from 'react';
import { X, Coffee, Sparkles, CupSoda, Search, ShoppingBag } from 'lucide-react';

interface MenuItem {
    name: string;
    price: string;
    category: string;
    description: string;
    tag?: string;
}

const MENU_ITEMS: MenuItem[] = [
    // Hot Coffee
    { name: 'Espresso', price: '$0.75', category: 'Hot Coffee', description: 'Rich single shot of premium dark roast espresso.' },
    { name: 'Americano', price: '$0.75', category: 'Hot Coffee', description: 'Freshly pulled espresso diluted with hot water.' },
    { name: 'Cappuccino', price: '$1.00', category: 'Hot Coffee', description: 'Espresso with rich velvety steamed milk foam.', tag: 'Popular' },
    { name: 'Latte', price: '$0.75', category: 'Hot Coffee', description: 'Smooth espresso balanced with steamed milk.' },
    { name: 'Macchiato', price: '$0.75', category: 'Hot Coffee', description: 'Bold espresso topped with a dollop of milk foam.' },
    { name: 'Caramel latte', price: '$1.00', category: 'Hot Coffee', description: 'Latte infused with golden caramel syrup.' },
    { name: 'Vanilla latte', price: '$1.00', category: 'Hot Coffee', description: 'Latte infused with fragrant vanilla syrup.' },
    { name: 'Spanish latte', price: '$1.00', category: 'Hot Coffee', description: 'Signature espresso with sweet condensed milk.', tag: 'Signature' },
    { name: 'Matcha', price: '$1.25', category: 'Hot Coffee', description: 'Ceremonial warm Japanese matcha green tea latte.' },

    // Hot Tea
    { name: 'Loos tea', price: '$0.75', category: 'Hot Tea', description: 'Specialty loose leaf tea brewed to perfection.' },
    { name: 'Somali tea', price: '$0.50', category: 'Hot Tea', description: 'Traditional spiced Somali milk tea with cardamom.', tag: 'Favorite' },
    { name: 'Qaxwo somali', price: '$0.50', category: 'Hot Tea', description: 'Authentic spiced Somali coffee blend.' },
    { name: 'Hot Chocolate', price: '$0.75', category: 'Hot Tea', description: 'Rich Dutch cocoa with warm steamed milk.' },
    { name: 'Green tea', price: '$0.50', category: 'Hot Tea', description: 'Antioxidant-rich steamed green tea leaves.' },
    { name: 'Shaax daqar', price: '$0.75', category: 'Hot Tea', description: 'Traditional aromatic herbal tea infusion.' },

    // Boba Tea
    { name: 'Blueberry With boba', price: '$1.75', category: 'Boba Tea', description: 'Sweet blueberry infused milk tea with chewy boba.', tag: 'Top Rated' },
    { name: 'Mango with boba', price: '$1.75', category: 'Boba Tea', description: 'Tropical mango milk tea with tapioca pearls.', tag: 'Popular' },
    { name: 'Vanilla Milk boba', price: '$1.75', category: 'Boba Tea', description: 'Silky smooth vanilla milk tea with fresh boba.' },
    { name: 'Strawberry Milk boba', price: '$1.75', category: 'Boba Tea', description: 'Creamy strawberry milk tea with tapioca pearls.' },
    { name: 'Lutos Milk boba', price: '$1.75', category: 'Boba Tea', description: 'Lotus Biscoff cookie butter flavored boba tea.', tag: 'Signature' },
    { name: 'Biskut Milk boba', price: '$1.50', category: 'Boba Tea', description: 'Crunchy biscuit blended milk tea with pearls.' },
    { name: 'Chocolate Milk boba', price: '$1.75', category: 'Boba Tea', description: 'Decadent chocolate milk tea loaded with boba pearls.', tag: 'Signature' },

    // Cold Drinks
    { name: 'Americano', price: '$1.00', category: 'Cold Drinks', description: 'Chilled bold espresso poured over ice.' },
    { name: 'Latte Ice Coffee', price: '$1.00', category: 'Cold Drinks', description: 'Iced espresso with fresh cold milk and ice.' },
    { name: 'Caramel latte', price: '$1.25', category: 'Cold Drinks', description: 'Chilled latte with swirls of caramel sauce.' },
    { name: 'Vanilla latte', price: '$1.25', category: 'Cold Drinks', description: 'Iced latte flavored with sweet vanilla bean.' },
    { name: 'Chocolate latte', price: '$1.25', category: 'Cold Drinks', description: 'Iced mocha latte with Belgian chocolate.' },
    { name: 'Matcha', price: '$1.50', category: 'Cold Drinks', description: 'Iced ceremonial grade green tea matcha latte.' },
    { name: 'Strawberry Matcha', price: '$1.50', category: 'Cold Drinks', description: 'Layered fresh strawberry puree and iced matcha.', tag: 'Trend' },
    { name: 'Mango Matcha', price: '$1.50', category: 'Cold Drinks', description: 'Layered tropical mango puree with iced matcha.' },
    { name: 'Vanilla Matcha', price: '$1.50', category: 'Cold Drinks', description: 'Iced matcha balanced with French vanilla cream.' },

    // Shakes
    { name: 'Banana shake', price: '$1.00', category: 'Shakes', description: 'Fresh banana blended with cold cream.' },
    { name: 'Mango shake', price: '$1.25', category: 'Shakes', description: 'Rich ripe mango pulp blended into thick shake.' },
    { name: 'Timir Milk shake', price: '$1.00', category: 'Shakes', description: 'Sweet Somali date (timir) and milk shake.', tag: 'Special' },
    { name: 'loos Milk shake', price: '$1.25', category: 'Shakes', description: 'Nutty peanut & caramel roasted milkshake.' },
    { name: 'Vanilla Milkshake', price: '$1.25', category: 'Shakes', description: 'Classic thick Madagascar vanilla milkshake.' },
    { name: 'Strawberry Milkshake', price: '$1.25', category: 'Shakes', description: 'Creamy milkshake with ripe strawberries.' },
    { name: 'Lutos Milkshake', price: '$1.25', category: 'Shakes', description: 'Lotus Biscoff blended thick shake with crumble.', tag: 'Favorite' },
    { name: 'Biskut Milkshake', price: '$1.25', category: 'Shakes', description: 'Crushed sweet biscuit rich milkshake.' },
    { name: 'Chocolate Milkshake', price: '$1.25', category: 'Shakes', description: 'Fudge chocolate thick milkshake with chocolate drizzle.' },
    { name: 'Blueberry Milkshake', price: '$1.25', category: 'Shakes', description: 'Sweet and tangy blueberry puree milkshake.' },
];

const CATEGORIES = ['All', 'Boba Tea', 'Hot Coffee', 'Cold Drinks', 'Shakes', 'Hot Tea'];

interface MenuModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOrderClick: () => void;
}

export const MenuModal: React.FC<MenuModalProps> = ({ isOpen, onClose, onOrderClick }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    if (!isOpen) return null;

    const filteredItems = MENU_ITEMS.filter((item) => {
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-fade-in">
            {/* Modal Container with Vintage Gold & Espresso Frame */}
            <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#FAF5EB] rounded-3xl border-4 border-[#3C2A21] shadow-2xl overflow-hidden flex flex-col">
                
                {/* Modal Header */}
                <div className="relative bg-[#2B1B17] text-[#FAF6EE] px-6 py-5 border-b-2 border-[#D4AF37] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-[#3C2A21] border border-[#D4AF37]">
                            <Coffee className="w-5 h-5 text-[#D4AF37]" />
                        </div>
                        <div>
                            <h2 className="font-serif-title font-bold text-lg sm:text-xl text-[#FAF6EE]">
                                MaMa Café & Boba Tea Menu
                            </h2>
                            <p className="font-handwriting text-base sm:text-lg text-[#E6C280] -mt-0.5">
                                Fresh Coffee • Boba • Ice Chocolate • Made with Love
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-full text-[#E6C280] hover:text-[#FAF6EE] hover:bg-[#3C2A21] transition-colors"
                        aria-label="Close menu"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Filter Controls Bar */}
                <div className="p-4 sm:p-6 border-b border-[#3C2A21]/15 bg-[#FAF6EE] flex flex-col sm:flex-row items-center justify-between gap-3">
                    {/* Category Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                                    selectedCategory === cat
                                        ? 'bg-[#2B1B17] text-[#FAF6EE] shadow-md border border-[#D4AF37]'
                                        : 'bg-[#FAF6EE] text-[#3C2A21] border border-[#3C2A21]/20 hover:bg-[#3C2A21]/10'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 text-[#3C2A21]/50 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search drinks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-full bg-[#FAF6EE] border border-[#3C2A21]/25 text-[#2B1B17] placeholder:text-[#3C2A21]/50 focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
                        />
                    </div>
                </div>

                {/* Menu Items Grid */}
                <div className="p-4 sm:p-6 overflow-y-auto flex-grow max-h-[60vh] space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                        {filteredItems.map((item, idx) => (
                            <div
                                key={idx}
                                className="group relative bg-[#FAF6EE] rounded-2xl p-3.5 border border-[#3C2A21]/15 shadow-xs hover:shadow-md hover:border-[#D4AF37] transition-all duration-200 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-sans font-bold text-sm text-[#2B1B17] group-hover:text-[#8B261D] transition-colors">
                                            {item.name}
                                        </h3>
                                        <span className="shrink-0 font-serif-title font-extrabold text-sm text-[#2B1B17] bg-[#D4AF37]/20 px-2.5 py-0.5 rounded-full border border-[#D4AF37]/40">
                                            {item.price}
                                        </span>
                                    </div>
                                    <p className="text-xs text-[#3C2A21]/70 mt-1 leading-snug font-medium">
                                        {item.description}
                                    </p>
                                </div>

                                <div className="mt-2.5 pt-2 border-t border-[#3C2A21]/10 flex items-center justify-between text-[11px]">
                                    <span className="text-[#A67C52] font-semibold">
                                        {item.category}
                                    </span>
                                    {item.tag && (
                                        <span className="bg-[#2B1B17] text-[#FAF6EE] text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase">
                                            {item.tag}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredItems.length === 0 && (
                        <div className="text-center py-12 text-[#3C2A21]/70">
                            <p className="text-sm font-semibold">No drinks found matching "{searchQuery}"</p>
                            <button
                                type="button"
                                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                                className="mt-2 text-xs font-bold text-[#D4AF37] underline"
                            >
                                Reset filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Modal Footer CTA */}
                <div className="p-4 sm:p-5 bg-[#2B1B17] border-t-2 border-[#D4AF37] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                        <p className="text-xs sm:text-sm text-[#FAF6EE] font-medium">
                            <strong className="text-[#E6C280]">The Testing is Free</strong> for all drinks!
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 sm:flex-none px-4 py-2 rounded-full text-xs font-bold text-[#E6C280] border border-[#E6C280]/40 hover:bg-[#3C2A21] transition-colors"
                        >
                            Close Menu
                        </button>
                        <button
                            type="button"
                            onClick={() => { onClose(); onOrderClick(); }}
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-6 py-2 rounded-full text-xs font-extrabold bg-[#D4AF37] hover:bg-[#C5A059] text-[#2B1B17] shadow-md transition-all active:scale-95"
                        >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Sign In</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};
