import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldAlert, BarChart3, Lock, Home } from 'lucide-react';

export default function Navbar() {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground";
    };

    return (
        <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <ShieldAlert className="h-6 w-6 text-primary" />
                    <span>Consent<span className="text-primary">Intel</span></span>
                </Link>

                <div className="flex gap-6 text-sm font-medium">
                    <Link to="/" className={isActive("/") + " flex items-center gap-1"}>
                        <Home className="h-4 w-4" /> Home
                    </Link>
                    <Link to="/preview" className={isActive("/preview") + " flex items-center gap-1"}>
                        <Lock className="h-4 w-4" /> Risk Preview
                    </Link>
                    <Link to="/dashboard" className={isActive("/dashboard") + " flex items-center gap-1"}>
                        <BarChart3 className="h-4 w-4" /> Live Dashboard
                    </Link>
                </div>
            </div>
        </nav>
    );
}
