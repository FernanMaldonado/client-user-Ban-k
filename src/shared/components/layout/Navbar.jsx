import imgLogo from "../../../assets/img/bank-icon-logo-design-vector-removebg-preview.png";

export const Navbar = () => {
    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                <div className="flex items-center gap-2">
                    <img
                        src={imgLogo}
                        alt="Bank Logo"
                        className="h-8 md:h-10 w-auto object-contain"
                    />

                    <h1 className="font-bold text-main-blue text-lg">
                        Banco Admin
                    </h1>
                </div>

                {/* Avatar placeholder */}
                <div className="w-10 h-10 rounded-full bg-gray-200" />
            </div>
        </nav>
    );
};import imgLogo from "../../../assets/img/bank-icon-logo-design-vector-removebg-preview.png";

export const Navbar = () => {
    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                <div className="flex items-center gap-2">
                    <img
                        src={imgLogo}
                        alt="Bank Logo"
                        className="h-8 md:h-10 w-auto object-contain"
                    />

                    <h1 className="font-bold text-main-blue text-lg">
                        Banco Admin
                    </h1>
                </div>

                {/* Avatar placeholder */}
                <div className="w-10 h-10 rounded-full bg-gray-200" />
            </div>
        </nav>
    );
};