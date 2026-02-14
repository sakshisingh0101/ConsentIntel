import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Eye, Activity } from 'lucide-react';

export default function Landing() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="space-y-4 max-w-2xl">
                <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Consent Intelligence
                </h1>
                <p className="text-xl text-muted-foreground">
                    Analyze app risk BEFORE you install. Monitor trust continually.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-12">
                <FeatureCard
                    icon={<ShieldCheck className="h-10 w-10 text-primary" />}
                    title="Pre-Install Audit"
                    desc="Simulate policies & read 'Terms' instantly so you don't have to."
                />
                <FeatureCard
                    icon={<Activity className="h-10 w-10 text-accent" />}
                    title="Runtime Monitoring"
                    desc="Track permission abuse in real-time with simulated runtime events."
                />
                <FeatureCard
                    icon={<Eye className="h-10 w-10 text-destructive" />}
                    title="Risk Alerts"
                    desc="Get notified when an app behavior deviates from its consent."
                />
            </div>

            <div className="mt-12">
                <Link
                    to="/preview"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 px-8 rounded-full shadow-lg transition-transform hover:scale-105 text-lg"
                >
                    Try the Demo
                </Link>
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, desc }) {
    return (
        <div className="p-6 bg-card border rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center space-y-3">
            {icon}
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="text-sm text-muted-foreground">{desc}</p>
        </div>
    );
}
