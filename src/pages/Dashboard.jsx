import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, CheckCircle, ArrowRight, Activity, Smartphone } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export default function Dashboard() {
    const [installedApps, setInstalledApps] = useState([]); // This would need a new endpoint to get ALL installed apps, currently we only have simulation endpoint for single app risk?
    // Wait, the Store has `installedApps` array. I should add an endpoint to get all installed apps or I can use the existing `MOCK_APPS` and filter? 
    // No, I need a new endpoint `GET /installed-apps` or modify `GET /apps` to return status. 
    // For now, I will add a simple endpoint in the backend or just Mock it in client state if I can't touch backend. 
    // actually, the plan said "GET /runtime-risk/:appId". 
    // I will add `GET /installed-apps` to `api.js` via a quick edit or I will assume I can fetch all apps and check their status if I had that info. 
    // Let's add the endpoint `GET /installed-apps` to `server/routes/api.js` first.

    // Actually, I can just use `GET /apps` and maybe the backend didn't persist installs? 
    // The backend `store.js` has `installedApps`. I should expose it.

    // Let's implement the Dashboard assuming I'll fix the backend in a moment.

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInstalledApps();
    }, []);

    const fetchInstalledApps = async () => {
        try {
            // I will assume this endpoint exists or I will create it.
            const res = await axios.get(`${API_URL}/installed-apps`);
            setInstalledApps(res.data);
        } catch (err) {
            console.error("Failed to fetch installed apps", err);
            // Fallback for demo if endpoint missing
            setInstalledApps([]);
        }
        setLoading(false);
    };

    const calculateGlobalScore = () => {
        if (installedApps.length === 0) return 100;
        const totalRisk = installedApps.reduce((acc, app) => acc + app.riskScore, 0);
        // Average risk. Trust score = 100 - Average Risk.
        return Math.round(100 - (totalRisk / installedApps.length));
    };

    const globalScore = calculateGlobalScore();
    let scoreColor = "text-green-500";
    if (globalScore < 70) scoreColor = "text-yellow-500";
    if (globalScore < 40) scoreColor = "text-red-500";

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row justify-between items-center gap-4 border-b pb-6">
                <div>
                    <h2 className="text-3xl font-bold">Live Dashboard</h2>
                    <p className="text-muted-foreground">Monitoring active consent and runtime behavior.</p>
                </div>
                <div className="text-center bg-card p-4 rounded-xl shadow-sm border">
                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Global Trust Score</div>
                    <div className={`text-5xl font-extrabold ${scoreColor}`}>{globalScore}</div>
                </div>
            </header>

            {installedApps.length === 0 ? (
                <div className="text-center py-20 bg-muted/20 rounded-xl border-dashed border-2">
                    <Smartphone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-bold">No Apps Monitored</h3>
                    <p className="text-muted-foreground mb-6">Install apps via the Risk Preview to start monitoring.</p>
                    <Link to="/preview" className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-bold">
                        Go to Risk Preview
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {installedApps.map(app => (
                        <AppRiskCard key={app.appId} app={app} />
                    ))}
                </div>
            )}
        </div>
    );
}

function AppRiskCard({ app }) {
    const riskScore = app.riskScore;
    let riskLevel = "LOW";
    let riskColor = "bg-green-500";
    if (riskScore > 30) { riskLevel = "MEDIUM"; riskColor = "bg-yellow-500"; }
    if (riskScore > 60) { riskLevel = "HIGH"; riskColor = "bg-red-500"; }

    // Calculate Trust Score for this app (inverse of risk)
    const trustScore = 100 - riskScore;

    return (
        <div className="bg-card border rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-bold ${riskColor}`}>
                    {trustScore}
                </div>
                <div>
                    <h3 className="font-bold text-xl">{app.name}</h3>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Activity className="h-3 w-3" /> Last active: {new Date(app.lastActive).toLocaleString()}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-8">
                <div className="text-center">
                    <div className="text-xs font-bold uppercase text-muted-foreground">Permissions Used</div>
                    <div className="font-mono font-bold text-lg">{app.permissionAccessCount}</div>
                </div>

                <div className="flex gap-2">
                    <Link
                        to={`/timeline/${app.appId}`}
                        className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-md text-sm font-medium flex items-center gap-1"
                    >
                        Timeline <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                        to={`/explain/${app.appId}`}
                        className="border hover:bg-muted px-4 py-2 rounded-md text-sm font-medium"
                    >
                        Risk Details
                    </Link>
                </div>
            </div>
        </div>
    );
}
